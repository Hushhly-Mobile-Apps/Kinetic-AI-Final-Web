import redis
import json
import pickle
from typing import Any, Optional, Union, List, Dict
from datetime import datetime, timedelta
import logging
from functools import wraps
import hashlib

from config import settings

logger = logging.getLogger(__name__)

class CacheManager:
    """Redis-based cache manager for pose estimation results and other data"""
    
    def __init__(self):
        try:
            self.redis_client = redis.Redis.from_url(
                settings.redis_url,
                decode_responses=False,  # We'll handle encoding manually
                socket_connect_timeout=5,
                socket_timeout=5,
                retry_on_timeout=True
            )
            # Test connection
            self.redis_client.ping()
            self.is_available = True
            logger.info("Redis cache initialized successfully")
        except Exception as e:
            logger.error(f"Failed to initialize Redis cache: {e}")
            self.redis_client = None
            self.is_available = False
    
    def _generate_key(self, prefix: str, *args, **kwargs) -> str:
        """Generate cache key from prefix and arguments"""
        key_parts = [prefix]
        
        # Add positional arguments
        for arg in args:
            key_parts.append(str(arg))
        
        # Add keyword arguments (sorted for consistency)
        for k, v in sorted(kwargs.items()):
            key_parts.append(f"{k}:{v}")
        
        key = ":".join(key_parts)
        
        # Hash long keys to avoid Redis key length limits
        if len(key) > 200:
            key_hash = hashlib.md5(key.encode()).hexdigest()
            key = f"{prefix}:hash:{key_hash}"
        
        return key
    
    def set(self, key: str, value: Any, ttl: Optional[int] = None) -> bool:
        """Set value in cache with optional TTL"""
        if not self.is_available:
            return False
        
        try:
            # Serialize value
            if isinstance(value, (dict, list)):
                serialized_value = json.dumps(value, default=str)
            else:
                serialized_value = pickle.dumps(value)
            
            # Set with TTL
            if ttl:
                return self.redis_client.setex(key, ttl, serialized_value)
            else:
                return self.redis_client.set(key, serialized_value)
        
        except Exception as e:
            logger.error(f"Error setting cache key {key}: {e}")
            return False
    
    def get(self, key: str) -> Optional[Any]:
        """Get value from cache"""
        if not self.is_available:
            return None
        
        try:
            value = self.redis_client.get(key)
            if value is None:
                return None
            
            # Try JSON first, then pickle
            try:
                return json.loads(value)
            except (json.JSONDecodeError, UnicodeDecodeError):
                return pickle.loads(value)
        
        except Exception as e:
            logger.error(f"Error getting cache key {key}: {e}")
            return None
    
    def delete(self, key: str) -> bool:
        """Delete key from cache"""
        if not self.is_available:
            return False
        
        try:
            return bool(self.redis_client.delete(key))
        except Exception as e:
            logger.error(f"Error deleting cache key {key}: {e}")
            return False
    
    def exists(self, key: str) -> bool:
        """Check if key exists in cache"""
        if not self.is_available:
            return False
        
        try:
            return bool(self.redis_client.exists(key))
        except Exception as e:
            logger.error(f"Error checking cache key {key}: {e}")
            return False
    
    def expire(self, key: str, ttl: int) -> bool:
        """Set TTL for existing key"""
        if not self.is_available:
            return False
        
        try:
            return bool(self.redis_client.expire(key, ttl))
        except Exception as e:
            logger.error(f"Error setting TTL for cache key {key}: {e}")
            return False
    
    def increment(self, key: str, amount: int = 1) -> Optional[int]:
        """Increment numeric value"""
        if not self.is_available:
            return None
        
        try:
            return self.redis_client.incr(key, amount)
        except Exception as e:
            logger.error(f"Error incrementing cache key {key}: {e}")
            return None
    
    def get_ttl(self, key: str) -> Optional[int]:
        """Get TTL for key"""
        if not self.is_available:
            return None
        
        try:
            ttl = self.redis_client.ttl(key)
            return ttl if ttl >= 0 else None
        except Exception as e:
            logger.error(f"Error getting TTL for cache key {key}: {e}")
            return None
    
    def clear_pattern(self, pattern: str) -> int:
        """Clear all keys matching pattern"""
        if not self.is_available:
            return 0
        
        try:
            keys = self.redis_client.keys(pattern)
            if keys:
                return self.redis_client.delete(*keys)
            return 0
        except Exception as e:
            logger.error(f"Error clearing cache pattern {pattern}: {e}")
            return 0
    
    def get_stats(self) -> Dict[str, Any]:
        """Get cache statistics"""
        if not self.is_available:
            return {"available": False}
        
        try:
            info = self.redis_client.info()
            return {
                "available": True,
                "used_memory": info.get("used_memory_human"),
                "connected_clients": info.get("connected_clients"),
                "total_commands_processed": info.get("total_commands_processed"),
                "keyspace_hits": info.get("keyspace_hits"),
                "keyspace_misses": info.get("keyspace_misses"),
                "hit_rate": info.get("keyspace_hits", 0) / max(info.get("keyspace_hits", 0) + info.get("keyspace_misses", 0), 1)
            }
        except Exception as e:
            logger.error(f"Error getting cache stats: {e}")
            return {"available": False, "error": str(e)}

# Global cache manager instance
cache = CacheManager()

class PoseCache:
    """Specialized cache for pose estimation results"""
    
    def __init__(self, cache_manager: CacheManager):
        self.cache = cache_manager
        self.default_ttl = settings.CACHE_TTL_SECONDS
    
    def get_pose_keypoints(self, media_id: int, frame_number: int = 0) -> Optional[Dict[str, Any]]:
        """Get cached pose keypoints for media"""
        key = self.cache._generate_key("pose_keypoints", media_id, frame_number)
        return self.cache.get(key)
    
    def set_pose_keypoints(self, media_id: int, keypoints_data: Dict[str, Any], 
                          frame_number: int = 0, ttl: Optional[int] = None) -> bool:
        """Cache pose keypoints for media"""
        key = self.cache._generate_key("pose_keypoints", media_id, frame_number)
        return self.cache.set(key, keypoints_data, ttl or self.default_ttl)
    
    def get_pose_comparison(self, media_id_1: int, media_id_2: int) -> Optional[Dict[str, Any]]:
        """Get cached pose comparison result"""
        # Ensure consistent ordering
        id1, id2 = sorted([media_id_1, media_id_2])
        key = self.cache._generate_key("pose_comparison", id1, id2)
        return self.cache.get(key)
    
    def set_pose_comparison(self, media_id_1: int, media_id_2: int, 
                           comparison_data: Dict[str, Any], ttl: Optional[int] = None) -> bool:
        """Cache pose comparison result"""
        # Ensure consistent ordering
        id1, id2 = sorted([media_id_1, media_id_2])
        key = self.cache._generate_key("pose_comparison", id1, id2)
        return self.cache.set(key, comparison_data, ttl or self.default_ttl)
    
    def get_user_poses(self, user_id: int, limit: int = 50) -> Optional[List[Dict[str, Any]]]:
        """Get cached user poses"""
        key = self.cache._generate_key("user_poses", user_id, limit)
        return self.cache.get(key)
    
    def set_user_poses(self, user_id: int, poses_data: List[Dict[str, Any]], 
                      limit: int = 50, ttl: Optional[int] = None) -> bool:
        """Cache user poses"""
        key = self.cache._generate_key("user_poses", user_id, limit)
        return self.cache.set(key, poses_data, ttl or self.default_ttl)
    
    def invalidate_user_cache(self, user_id: int):
        """Invalidate all cached data for a user"""
        pattern = f"*user*{user_id}*"
        return self.cache.clear_pattern(pattern)
    
    def invalidate_media_cache(self, media_id: int):
        """Invalidate all cached data for a media file"""
        pattern = f"*{media_id}*"
        return self.cache.clear_pattern(pattern)

class RateLimitCache:
    """Rate limiting using Redis"""
    
    def __init__(self, cache_manager: CacheManager):
        self.cache = cache_manager
    
    def is_rate_limited(self, identifier: str, limit: int, window: int) -> tuple[bool, Dict[str, Any]]:
        """Check if identifier is rate limited"""
        key = self.cache._generate_key("rate_limit", identifier)
        
        try:
            current_count = self.cache.redis_client.get(key)
            
            if current_count is None:
                # First request in window
                self.cache.redis_client.setex(key, window, 1)
                return False, {
                    "remaining": limit - 1,
                    "reset_time": datetime.utcnow() + timedelta(seconds=window),
                    "limit": limit
                }
            
            current_count = int(current_count)
            
            if current_count >= limit:
                # Rate limited
                ttl = self.cache.redis_client.ttl(key)
                return True, {
                    "remaining": 0,
                    "reset_time": datetime.utcnow() + timedelta(seconds=ttl),
                    "limit": limit
                }
            
            # Increment counter
            new_count = self.cache.redis_client.incr(key)
            ttl = self.cache.redis_client.ttl(key)
            
            return False, {
                "remaining": limit - new_count,
                "reset_time": datetime.utcnow() + timedelta(seconds=ttl),
                "limit": limit
            }
        
        except Exception as e:
            logger.error(f"Error checking rate limit for {identifier}: {e}")
            # Allow request if cache fails
            return False, {"remaining": limit, "limit": limit}

class SessionCache:
    """Session management using Redis"""
    
    def __init__(self, cache_manager: CacheManager):
        self.cache = cache_manager
        self.session_ttl = 3600  # 1 hour
    
    def create_session(self, user_id: int, session_data: Dict[str, Any]) -> str:
        """Create new session"""
        import uuid
        session_id = str(uuid.uuid4())
        key = self.cache._generate_key("session", session_id)
        
        session_data.update({
            "user_id": user_id,
            "created_at": datetime.utcnow().isoformat(),
            "last_accessed": datetime.utcnow().isoformat()
        })
        
        self.cache.set(key, session_data, self.session_ttl)
        return session_id
    
    def get_session(self, session_id: str) -> Optional[Dict[str, Any]]:
        """Get session data"""
        key = self.cache._generate_key("session", session_id)
        session_data = self.cache.get(key)
        
        if session_data:
            # Update last accessed time
            session_data["last_accessed"] = datetime.utcnow().isoformat()
            self.cache.set(key, session_data, self.session_ttl)
        
        return session_data
    
    def update_session(self, session_id: str, data: Dict[str, Any]) -> bool:
        """Update session data"""
        key = self.cache._generate_key("session", session_id)
        session_data = self.cache.get(key)
        
        if session_data:
            session_data.update(data)
            session_data["last_accessed"] = datetime.utcnow().isoformat()
            return self.cache.set(key, session_data, self.session_ttl)
        
        return False
    
    def delete_session(self, session_id: str) -> bool:
        """Delete session"""
        key = self.cache._generate_key("session", session_id)
        return self.cache.delete(key)
    
    def cleanup_expired_sessions(self):
        """Clean up expired sessions (handled automatically by Redis TTL)"""
        pass

# Cache decorators
def cached(ttl: int = None, key_prefix: str = "cached"):
    """Decorator to cache function results"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            # Generate cache key
            key = cache._generate_key(key_prefix, func.__name__, *args, **kwargs)
            
            # Try to get from cache
            result = cache.get(key)
            if result is not None:
                return result
            
            # Execute function and cache result
            result = func(*args, **kwargs)
            cache.set(key, result, ttl or settings.CACHE_TTL_SECONDS)
            
            return result
        return wrapper
    return decorator

def cache_invalidate(key_pattern: str):
    """Decorator to invalidate cache after function execution"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            result = func(*args, **kwargs)
            cache.clear_pattern(key_pattern)
            return result
        return wrapper
    return decorator

# Specialized cache instances
pose_cache = PoseCache(cache)
rate_limit_cache = RateLimitCache(cache)
session_cache = SessionCache(cache)

# Cache warming functions
def warm_user_cache(user_id: int, db_session):
    """Pre-populate cache with user data"""
    try:
        from .models import Media, PoseKeypoints
        
        # Cache recent user media
        recent_media = db_session.query(Media).filter(
            Media.user_id == user_id
        ).order_by(Media.created_at.desc()).limit(10).all()
        
        for media in recent_media:
            # Cache pose keypoints if available
            keypoints = db_session.query(PoseKeypoints).filter(
                PoseKeypoints.media_id == media.id
            ).first()
            
            if keypoints:
                pose_cache.set_pose_keypoints(
                    media.id,
                    {
                        "keypoints": keypoints.keypoints,
                        "confidence_scores": keypoints.confidence_scores,
                        "processing_time": keypoints.processing_time
                    }
                )
        
        logger.info(f"Warmed cache for user {user_id}")
        
    except Exception as e:
        logger.error(f"Error warming cache for user {user_id}: {e}")

def get_cache_health() -> Dict[str, Any]:
    """Get cache health status"""
    return {
        "cache_available": cache.is_available,
        "cache_stats": cache.get_stats(),
        "timestamp": datetime.utcnow().isoformat()
    }