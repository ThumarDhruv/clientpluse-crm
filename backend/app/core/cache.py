import json
import logging
from typing import Any, Optional
import redis
from app.core.config import settings

logger = logging.getLogger("cache")

class CacheManager:
    """High-performance Redis cache manager with graceful in-memory fallback."""
    def __init__(self):
        self.client: Optional[redis.Redis] = None
        self._memory_cache = {}
        if settings.REDIS_URL and settings.APP_ENV != "test":
            try:
                self.client = redis.from_url(
                    settings.REDIS_URL,
                    decode_responses=True,
                    socket_connect_timeout=1
                )
                self.client.ping()
                logger.info("Connected to Redis cache.")
            except Exception as e:
                logger.info(f"Redis unavailable, operating with in-memory caching: {e}")
                self.client = None

    def get(self, key: str) -> Optional[Any]:
        try:
            if self.client:
                data = self.client.get(key)
                if data:
                    return json.loads(data)
            return self._memory_cache.get(key)
        except Exception:
            return None

    def set(self, key: str, value: Any, expire_seconds: int = 60) -> None:
        try:
            serialized = json.dumps(value, default=str)
            if self.client:
                self.client.setex(key, expire_seconds, serialized)
            self._memory_cache[key] = value
        except Exception:
            pass

    def invalidate_pattern(self, pattern: str = "customers:*") -> None:
        try:
            if self.client:
                keys = self.client.keys(pattern)
                if keys:
                    self.client.delete(*keys)
            self._memory_cache.clear()
        except Exception:
            pass


cache_manager = CacheManager()
