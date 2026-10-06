import os
import time
import json
import requests
from jose import jwt, JWTError
from fastapi import HTTPException, status
from dotenv import load_dotenv
from .logger import logger
from .redis import redis_client

load_dotenv()

# Sanitize domain: strip protocol and slashes
raw_domain = os.getenv("AUTH0_DOMAIN", "").strip()
AUTH0_DOMAIN = raw_domain.replace("https://", "").replace("http://", "").rstrip("/")

AUTH0_API_AUDIENCE = os.getenv("AUTH0_API_AUDIENCE", "").strip()
AUTH0_ISSUER = f"https://{AUTH0_DOMAIN}/" if AUTH0_DOMAIN else ""
AUTH0_ALGORITHMS = ["RS256"]

# Cache JWKS for 1 hour
_jwks_cache = None
_jwks_cache_time = 0
JWKS_CACHE_TTL = 3600

# In-memory userinfo fallback cache: sub -> (timestamp, data)
_userinfo_mem_cache = {}
USERINFO_CACHE_TTL = 600  # 10 minutes

def is_auth0_configured() -> bool:
    return bool(AUTH0_DOMAIN and not AUTH0_DOMAIN.startswith("your-") and "example" not in AUTH0_DOMAIN)

def get_jwks(force_refresh: bool = False):
    global _jwks_cache, _jwks_cache_time
    now = time.time()
    if not force_refresh and _jwks_cache and (now - _jwks_cache_time) < JWKS_CACHE_TTL:
        return _jwks_cache
    
    if not is_auth0_configured():
        return None

    try:
        jwks_url = f"https://{AUTH0_DOMAIN}/.well-known/jwks.json"
        response = requests.get(jwks_url, timeout=10)
        response.raise_for_status()
        _jwks_cache = response.json()
        _jwks_cache_time = now
        return _jwks_cache
    except Exception as e:
        logger.error(f"Failed to fetch Auth0 JWKS: {e}")
        return _jwks_cache if _jwks_cache else None

def verify_token_via_userinfo(token: str) -> dict:
    """Fetch user profile from Auth0 userinfo endpoint."""
    if not is_auth0_configured():
        return {}
    try:
        userinfo_url = f"https://{AUTH0_DOMAIN}/userinfo"
        headers = {"Authorization": f"Bearer {token}"}
        resp = requests.get(userinfo_url, headers=headers, timeout=10)
        if resp.status_code == 200:
            return resp.json()
        logger.warning(f"Auth0 userinfo returned status {resp.status_code}: {resp.text}")
    except Exception as e:
        logger.error(f"Error calling Auth0 userinfo endpoint: {e}")
    return {}

def fetch_userinfo_cached(token: str, sub: str = None) -> dict:
    """Fetch userinfo with caching in Redis or in-memory to prevent rate-limiting."""
    cache_key = f"userinfo:{sub}" if sub else f"userinfo:tok:{token[-16:]}"
    
    # Try Redis cache first
    if redis_client:
        try:
            cached = redis_client.get(cache_key)
            if cached:
                return json.loads(cached)
        except Exception as e:
            logger.warning(f"Redis get userinfo cache error: {e}")

    # Try in-memory cache
    now = time.time()
    if cache_key in _userinfo_mem_cache:
        timestamp, data = _userinfo_mem_cache[cache_key]
        if now - timestamp < USERINFO_CACHE_TTL:
            return data

    userinfo = verify_token_via_userinfo(token)
    if userinfo:
        # Save to Redis
        if redis_client:
            try:
                redis_client.setex(cache_key, USERINFO_CACHE_TTL, json.dumps(userinfo))
            except Exception as e:
                logger.warning(f"Redis set userinfo cache error: {e}")
        # Save to memory
        _userinfo_mem_cache[cache_key] = (now, userinfo)

    return userinfo

def verify_token(token: str) -> dict:
    """
    Verifies an Auth0 token using RS256 JWKS or Auth0 userinfo endpoint.
    Handles JWT access tokens, ID tokens, and opaque access tokens.
    Enriches JWT claims with user profile if missing.
    """
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    if not is_auth0_configured():
        logger.warning("Auth0 environment variables are not configured.")
        try:
            return jwt.get_unverified_claims(token)
        except Exception as e:
            logger.error(f"Could not parse unverified token: {e}")
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token claims",
                headers={"WWW-Authenticate": "Bearer"},
            )

    # Check if token is a standard 3-part JWT
    if token.count('.') == 2:
        try:
            unverified_header = jwt.get_unverified_header(token)
            jwks = get_jwks()
            target_kid = unverified_header.get("kid")

            rsa_key = {}
            if jwks and "keys" in jwks:
                for key in jwks["keys"]:
                    if key.get("kid") == target_kid:
                        rsa_key = {
                            "kty": key["kty"],
                            "kid": key["kid"],
                            "use": key.get("use"),
                            "n": key["n"],
                            "e": key["e"]
                        }
                        break

            # If key not found in cache, attempt force refresh once (handles key rotation)
            if not rsa_key and target_kid:
                jwks = get_jwks(force_refresh=True)
                if jwks and "keys" in jwks:
                    for key in jwks["keys"]:
                        if key.get("kid") == target_kid:
                            rsa_key = {
                                "kty": key["kty"],
                                "kid": key["kid"],
                                "use": key.get("use"),
                                "n": key["n"],
                                "e": key["e"]
                            }
                            break

            if rsa_key:
                decode_kwargs = {
                    "token": token,
                    "key": rsa_key,
                    "algorithms": AUTH0_ALGORITHMS,
                    "issuer": AUTH0_ISSUER,
                    "options": {"verify_aud": False}
                }
                
                claims = None
                if AUTH0_API_AUDIENCE:
                    try:
                        claims = jwt.decode(**{**decode_kwargs, "audience": AUTH0_API_AUDIENCE, "options": {}})
                    except jwt.ExpiredSignatureError:
                        raise
                    except Exception:
                        # Fallback without strict audience check (e.g. ID token or multi-audience)
                        claims = jwt.decode(**decode_kwargs)
                else:
                    claims = jwt.decode(**decode_kwargs)

                if claims:
                    # If access token has no profile information, enrich via userinfo if available
                    if "email" not in claims and claims.get("sub"):
                        userinfo = fetch_userinfo_cached(token, claims["sub"])
                        for k, v in userinfo.items():
                            if k not in claims:
                                claims[k] = v
                    return claims

        except jwt.ExpiredSignatureError:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Token has expired",
                headers={"WWW-Authenticate": "Bearer"},
            )
        except Exception as e:
            logger.warning(f"JWT verification failed: {e}. Attempting userinfo fallback.")

    # Fallback to userinfo endpoint (handles opaque tokens or unconventional claims)
    userinfo = verify_token_via_userinfo(token)
    if userinfo and "sub" in userinfo:
        return userinfo

    raise HTTPException(
        status_code=status.HTTP_401_UNAUTHORIZED,
        detail="Invalid or expired token",
        headers={"WWW-Authenticate": "Bearer"},
    )


def extract_user_roles(payload: dict) -> list:
    """Extract all assigned roles from token claims, custom namespaces, and permissions."""
    if not payload or not isinstance(payload, dict):
        return []

    roles = set()

    # 1. Check known and namespaced claim keys
    for key, value in payload.items():
        if key == "roles" or key.endswith("/roles") or key.endswith("/claims/roles"):
            if isinstance(value, list):
                for r in value:
                    if isinstance(r, str):
                        roles.add(r.strip())
            elif isinstance(value, str):
                roles.add(value.strip())

    # 2. Check Auth0 permissions
    permissions = payload.get("permissions")
    if isinstance(permissions, list):
        for p in permissions:
            if isinstance(p, str):
                roles.add(p.strip())

    # 3. Check metadata objects
    for meta_key in ("app_metadata", "user_metadata"):
        meta = payload.get(meta_key)
        if isinstance(meta, dict):
            meta_roles = meta.get("roles")
            if isinstance(meta_roles, list):
                for r in meta_roles:
                    if isinstance(r, str):
                        roles.add(r.strip())
            elif isinstance(meta_roles, str):
                roles.add(meta_roles.strip())

    return list(roles)


def is_admin_user(payload: dict) -> bool:
    """Check if the user has the admin role via token claims."""
    if not payload or not isinstance(payload, dict):
        return False

    roles = extract_user_roles(payload)
    for r in roles:
        if r.lower() == "admin":
            return True

    return False

