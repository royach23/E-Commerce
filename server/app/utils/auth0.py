import os
import time
import requests
from jose import jwt, JWTError
from fastapi import HTTPException, status
from dotenv import load_dotenv
from .logger import logger

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

def _find_rsa_key(keys_data: dict, kid: str) -> dict:
    if not keys_data or "keys" not in keys_data or not kid:
        return {}
    for key in keys_data["keys"]:
        if key.get("kid") == kid:
            return {
                "kty": key["kty"],
                "kid": key["kid"],
                "use": key.get("use"),
                "n": key["n"],
                "e": key["e"]
            }
    return {}

def verify_token(token: str) -> dict:
    """Verifies a signed Auth0 RS256 access token against JWKS, issuer, and audience."""
    if not token:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Missing authentication token",
            headers={"WWW-Authenticate": "Bearer"},
        )

    try:
        unverified_header = jwt.get_unverified_header(token)
        target_kid = unverified_header.get("kid")

        # 1. Find RSA public key from JWKS (refresh once if missing for key rotation)
        rsa_key = _find_rsa_key(get_jwks(), target_kid)
        if not rsa_key and target_kid:
            rsa_key = _find_rsa_key(get_jwks(force_refresh=True), target_kid)

        if not rsa_key:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Invalid token key ID (kid)",
                headers={"WWW-Authenticate": "Bearer"},
            )

        # 2. Strictly verify signature, issuer, expiration, and audience
        claims = jwt.decode(
            token=token,
            key=rsa_key,
            algorithms=AUTH0_ALGORITHMS,
            issuer=AUTH0_ISSUER,
            audience=AUTH0_API_AUDIENCE,
        )

        # 3. Normalize custom claims to standard root keys
        for k, v in list(claims.items()):
            if k.endswith("/email") and "email" not in claims:
                claims["email"] = v
            elif k.endswith("/name") and "name" not in claims:
                claims["name"] = v

        return claims

    except jwt.ExpiredSignatureError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Token has expired",
            headers={"WWW-Authenticate": "Bearer"},
        )
    except (JWTError, Exception) as e:
        logger.warning(f"JWT verification failed: {e}")
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid or expired token",
            headers={"WWW-Authenticate": "Bearer"},
        )


def extract_user_roles(payload: dict) -> list:
    """Extract assigned roles from token claims."""
    if not payload or not isinstance(payload, dict):
        return []

    # Find the namespaced roles claim (e.g., https://.../roles) or standard "roles"
    for key, value in payload.items():
        if key == "roles" or key.endswith("/roles"):
            if isinstance(value, list):
                return [r.strip() for r in value if isinstance(r, str) and r.strip()]
            elif isinstance(value, str) and value.strip():
                return [value.strip()]

    return []


def is_admin_user(payload: dict) -> bool:
    """Check if the user has the admin role via token claims."""
    return any(role.lower() == "admin" for role in extract_user_roles(payload))
