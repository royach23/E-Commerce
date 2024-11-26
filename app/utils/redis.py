import redis
import logging

try:
    redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
    redis_client.ping()
    logging.info("Connected to Redis!")
except redis.ConnectionError as e:
    logging.error(f"Redis connection error: {e}")
    redis_client = None

