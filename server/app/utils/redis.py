import os
import redis
from .logger import logger

try:
    redis_host = os.getenv("REDIS_HOST", "redis")
    redis_client = redis.StrictRedis(host=redis_host, port=6379, db=0, decode_responses=True)
    redis_client.ping()
    logger.info("Connected to Redis!")
except redis.ConnectionError as e:
    logger.error(f"Redis connection error: {e}")
    redis_client = None

