import redis
from .logger import logger

try:
    redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
    logger.info("Connected to Redis!")
except redis.ConnectionError as e:
    logger.error(f"Redis connection error: {e}")
    redis_client = None

