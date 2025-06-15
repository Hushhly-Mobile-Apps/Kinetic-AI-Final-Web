from datetime import datetime, timedelta
from typing import Optional, Union
from jose import JWTError, jwt
from passlib.context import CryptContext
from fastapi import HTTPException, status, Depends
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from sqlalchemy.orm import Session
from sqlalchemy import and_

from config import settings
from database import get_db
from models import User, APIKey, AuditLog
from schemas import TokenData, UserRole

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# JWT token scheme
security = HTTPBearer()

def hash_password(password: str) -> str:
    """Hash a password using bcrypt"""
    return pwd_context.hash(password)

class AuthenticationError(HTTPException):
    def __init__(self, detail: str = "Could not validate credentials"):
        super().__init__(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail=detail,
            headers={"WWW-Authenticate": "Bearer"},
        )

class AuthorizationError(HTTPException):
    def __init__(self, detail: str = "Not enough permissions"):
        super().__init__(
            status_code=status.HTTP_403_FORBIDDEN,
            detail=detail,
        )

def verify_password(plain_password: str, hashed_password: str) -> bool:
    """Verify a password against its hash"""
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password: str) -> str:
    """Hash a password"""
    return pwd_context.hash(password)

def create_access_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT access token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    
    to_encode.update({"exp": expire, "type": "access"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def create_refresh_token(data: dict, expires_delta: Optional[timedelta] = None) -> str:
    """Create JWT refresh token"""
    to_encode = data.copy()
    if expires_delta:
        expire = datetime.utcnow() + expires_delta
    else:
        expire = datetime.utcnow() + timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    to_encode.update({"exp": expire, "type": "refresh"})
    encoded_jwt = jwt.encode(to_encode, settings.SECRET_KEY, algorithm=settings.ALGORITHM)
    return encoded_jwt

def verify_token(token: str, token_type: str = "access") -> Optional[TokenData]:
    """Verify and decode JWT token"""
    try:
        payload = jwt.decode(token, settings.SECRET_KEY, algorithms=[settings.ALGORITHM])
        user_id: str = payload.get("sub")
        token_type_payload: str = payload.get("type")
        
        if user_id is None or token_type_payload != token_type:
            return None
            
        return TokenData(user_id=int(user_id))
    except JWTError:
        return None

def authenticate_user(db: Session, email: str, password: str) -> Optional[User]:
    """Authenticate user with email and password"""
    user = db.query(User).filter(User.email == email).first()
    if not user:
        return None
    if not verify_password(password, user.hashed_password):
        return None
    return user

def get_user_by_id(db: Session, user_id: int) -> Optional[User]:
    """Get user by ID"""
    return db.query(User).filter(User.id == user_id).first()

def get_user_by_email(db: Session, email: str) -> Optional[User]:
    """Get user by email"""
    return db.query(User).filter(User.email == email).first()

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security), db: Session = Depends(get_db)) -> User:
    """Get current authenticated user"""
    token = credentials.credentials
    token_data = verify_token(token)
    
    if token_data is None:
        raise AuthenticationError()
    
    user = get_user_by_id(db, token_data.user_id)
    if user is None:
        raise AuthenticationError()
    
    if not user.is_active:
        raise AuthenticationError("Inactive user")
    
    return user

def get_current_active_user(current_user: User = Depends(get_current_user)) -> User:
    """Get current active user"""
    if not current_user.is_active:
        raise AuthenticationError("Inactive user")
    return current_user

def require_role(required_role: UserRole):
    """Decorator to require specific user role"""
    def role_checker(current_user: User = Depends(get_current_active_user)) -> User:
        if current_user.role != required_role and current_user.role != UserRole.ADMIN:
            raise AuthorizationError(f"Role {required_role.value} required")
        return current_user
    return role_checker

def require_admin(current_user: User = Depends(get_current_active_user)) -> User:
    """Require admin role"""
    if current_user.role != UserRole.ADMIN:
        raise AuthorizationError("Admin role required")
    return current_user

def require_user_or_admin(current_user: User = Depends(get_current_active_user)) -> User:
    """Require user or admin role"""
    if current_user.role not in [UserRole.USER, UserRole.ADMIN]:
        raise AuthorizationError("User or admin role required")
    return current_user

def get_current_admin_user(current_user: User = Depends(get_current_active_user)) -> User:
    """Get current admin user"""
    if current_user.role != UserRole.ADMIN:
        raise AuthorizationError("Admin role required")
    return current_user

def verify_api_key(api_key: str, db: Session) -> Optional[User]:
    """Verify API key and return associated user"""
    api_key_obj = db.query(APIKey).filter(
        and_(
            APIKey.key == api_key,
            APIKey.is_active == True,
            APIKey.expires_at > datetime.utcnow()
        )
    ).first()
    
    if not api_key_obj:
        return None
    
    # Update last used timestamp
    api_key_obj.last_used_at = datetime.utcnow()
    db.commit()
    
    return api_key_obj.user

def get_user_from_api_key(api_key: str = None, db: Session = Depends(get_db)) -> Optional[User]:
    """Get user from API key (optional authentication)"""
    if not api_key:
        return None
    
    return verify_api_key(api_key, db)

def create_api_key(db: Session, user_id: int, name: str, expires_days: int = 365) -> APIKey:
    """Create new API key for user"""
    import secrets
    
    api_key = APIKey(
        user_id=user_id,
        name=name,
        key=f"pk_{secrets.token_urlsafe(32)}",
        expires_at=datetime.utcnow() + timedelta(days=expires_days)
    )
    
    db.add(api_key)
    db.commit()
    db.refresh(api_key)
    
    return api_key

def revoke_api_key(db: Session, api_key_id: int, user_id: int) -> bool:
    """Revoke API key"""
    api_key = db.query(APIKey).filter(
        and_(
            APIKey.id == api_key_id,
            APIKey.user_id == user_id
        )
    ).first()
    
    if not api_key:
        return False
    
    api_key.is_active = False
    db.commit()
    
    return True

def log_security_event(db: Session, user_id: int, action: str, details: dict = None, ip_address: str = None):
    """Log security-related events"""
    audit_log = AuditLog(
        user_id=user_id,
        action=action,
        details=details or {},
        ip_address=ip_address,
        timestamp=datetime.utcnow()
    )
    
    db.add(audit_log)
    db.commit()

def check_password_strength(password: str) -> tuple[bool, list[str]]:
    """Check password strength and return validation result"""
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not any(c.isupper() for c in password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not any(c.islower() for c in password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not any(c.isdigit() for c in password):
        errors.append("Password must contain at least one digit")
    
    if not any(c in "!@#$%^&*()_+-=[]{}|;:,.<>?" for c in password):
        errors.append("Password must contain at least one special character")
    
    return len(errors) == 0, errors

def create_user_tokens(user: User) -> dict:
    """Create access and refresh tokens for user"""
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    refresh_token_expires = timedelta(days=settings.REFRESH_TOKEN_EXPIRE_DAYS)
    
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    refresh_token = create_refresh_token(
        data={"sub": str(user.id)}, expires_delta=refresh_token_expires
    )
    
    return {
        "access_token": access_token,
        "refresh_token": refresh_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

def refresh_access_token(refresh_token: str, db: Session) -> Optional[dict]:
    """Refresh access token using refresh token"""
    token_data = verify_token(refresh_token, token_type="refresh")
    
    if token_data is None:
        return None
    
    user = get_user_by_id(db, token_data.user_id)
    if user is None or not user.is_active:
        return None
    
    # Create new access token
    access_token_expires = timedelta(minutes=settings.ACCESS_TOKEN_EXPIRE_MINUTES)
    access_token = create_access_token(
        data={"sub": str(user.id)}, expires_delta=access_token_expires
    )
    
    return {
        "access_token": access_token,
        "token_type": "bearer",
        "expires_in": settings.ACCESS_TOKEN_EXPIRE_MINUTES * 60
    }

class RateLimiter:
    """Simple rate limiter for API endpoints"""
    
    def __init__(self, redis_client=None):
        self.redis_client = redis_client
    
    def is_allowed(self, key: str, limit: int, window: int) -> bool:
        """Check if request is allowed based on rate limit"""
        if not self.redis_client:
            return True  # No rate limiting if Redis is not available
        
        try:
            current = self.redis_client.get(key)
            if current is None:
                self.redis_client.setex(key, window, 1)
                return True
            
            if int(current) >= limit:
                return False
            
            self.redis_client.incr(key)
            return True
        except Exception:
            return True  # Allow request if Redis fails
    
    def get_remaining(self, key: str, limit: int) -> int:
        """Get remaining requests for the key"""
        if not self.redis_client:
            return limit
        
        try:
            current = self.redis_client.get(key)
            if current is None:
                return limit
            return max(0, limit - int(current))
        except Exception:
            return limit