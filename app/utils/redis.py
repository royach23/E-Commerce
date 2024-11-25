import redis

try:
    redis_client = redis.StrictRedis(host='localhost', port=6379, db=0, decode_responses=True)
    # Test the connection
    redis_client.ping()
    print("Connected to Redis!")
except redis.ConnectionError as e:
    print(f"Redis connection error: {e}")
    redis_client = None

