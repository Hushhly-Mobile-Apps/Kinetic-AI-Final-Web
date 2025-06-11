import re
import uuid
import hashlib
import secrets
import string
from typing import Any, Dict, List, Optional, Union, Tuple
from datetime import datetime, timedelta, timezone
from pathlib import Path
import mimetypes
import json
import base64
from urllib.parse import urlparse
import logging
from functools import wraps
import time
from email.mime.text import MIMEText
from email.mime.multipart import MIMEMultipart
from email.mime.base import MIMEBase
from email import encoders
import smtplib

try:
    import cv2
    import numpy as np
    CV2_AVAILABLE = True
except ImportError:
    CV2_AVAILABLE = False

try:
    from PIL import Image, ImageOps
    PIL_AVAILABLE = True
except ImportError:
    PIL_AVAILABLE = False

from config import settings

logger = logging.getLogger(__name__)

# Validation utilities
def validate_email(email: str) -> bool:
    """Validate email format"""
    pattern = r'^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$'
    return bool(re.match(pattern, email))

def validate_password(password: str) -> Tuple[bool, List[str]]:
    """Validate password strength"""
    errors = []
    
    if len(password) < 8:
        errors.append("Password must be at least 8 characters long")
    
    if not re.search(r'[A-Z]', password):
        errors.append("Password must contain at least one uppercase letter")
    
    if not re.search(r'[a-z]', password):
        errors.append("Password must contain at least one lowercase letter")
    
    if not re.search(r'\d', password):
        errors.append("Password must contain at least one digit")
    
    if not re.search(r'[!@#$%^&*(),.?":{}|<>]', password):
        errors.append("Password must contain at least one special character")
    
    return len(errors) == 0, errors

def validate_phone(phone: str) -> bool:
    """Validate phone number format"""
    # Remove all non-digit characters
    digits_only = re.sub(r'\D', '', phone)
    
    # Check if it's a valid length (10-15 digits)
    return 10 <= len(digits_only) <= 15

def validate_url(url: str) -> bool:
    """Validate URL format"""
    try:
        result = urlparse(url)
        return all([result.scheme, result.netloc])
    except Exception:
        return False

def validate_file_size(file_size: int, max_size_mb: int = 100) -> bool:
    """Validate file size"""
    max_size_bytes = max_size_mb * 1024 * 1024
    return file_size <= max_size_bytes

def validate_image_file(file_path: str) -> Tuple[bool, Optional[str]]:
    """Validate image file"""
    try:
        if not PIL_AVAILABLE:
            return False, "PIL not available for image validation"
        
        with Image.open(file_path) as img:
            # Check if it's a valid image
            img.verify()
            
            # Check format
            if img.format.lower() not in ['jpeg', 'jpg', 'png', 'gif', 'bmp', 'webp']:
                return False, f"Unsupported image format: {img.format}"
            
            return True, None
    
    except Exception as e:
        return False, f"Invalid image file: {str(e)}"

def validate_video_file(file_path: str) -> Tuple[bool, Optional[str]]:
    """Validate video file"""
    try:
        if not CV2_AVAILABLE:
            return False, "OpenCV not available for video validation"
        
        cap = cv2.VideoCapture(file_path)
        
        if not cap.isOpened():
            return False, "Cannot open video file"
        
        # Check if we can read at least one frame
        ret, frame = cap.read()
        cap.release()
        
        if not ret:
            return False, "Cannot read video frames"
        
        return True, None
    
    except Exception as e:
        return False, f"Invalid video file: {str(e)}"

# String utilities
def generate_random_string(length: int = 32, include_special: bool = False) -> str:
    """Generate random string"""
    characters = string.ascii_letters + string.digits
    if include_special:
        characters += "!@#$%^&*"
    
    return ''.join(secrets.choice(characters) for _ in range(length))

def generate_uuid() -> str:
    """Generate UUID string"""
    return str(uuid.uuid4())

def generate_api_key() -> str:
    """Generate API key"""
    return f"ka_{generate_random_string(40)}"

def sanitize_filename(filename: str) -> str:
    """Sanitize filename for safe storage"""
    # Remove or replace unsafe characters
    filename = re.sub(r'[<>:"/\\|?*]', '_', filename)
    
    # Remove leading/trailing spaces and dots
    filename = filename.strip(' .')
    
    # Ensure it's not empty
    if not filename:
        filename = f"file_{generate_random_string(8)}"
    
    return filename

def slugify(text: str) -> str:
    """Convert text to URL-friendly slug"""
    # Convert to lowercase and replace spaces with hyphens
    text = text.lower().strip()
    text = re.sub(r'[^a-z0-9\s-]', '', text)
    text = re.sub(r'[\s-]+', '-', text)
    return text.strip('-')

def truncate_text(text: str, max_length: int = 100, suffix: str = "...") -> str:
    """Truncate text to specified length"""
    if len(text) <= max_length:
        return text
    return text[:max_length - len(suffix)] + suffix

# Hash utilities
def hash_password(password: str) -> str:
    """Hash password using bcrypt"""
    import bcrypt
    return bcrypt.hashpw(password.encode('utf-8'), bcrypt.gensalt()).decode('utf-8')

def verify_password(password: str, hashed: str) -> bool:
    """Verify password against hash"""
    import bcrypt
    return bcrypt.checkpw(password.encode('utf-8'), hashed.encode('utf-8'))

def calculate_file_hash(file_path: str, algorithm: str = 'md5') -> str:
    """Calculate file hash"""
    hash_func = getattr(hashlib, algorithm)()
    
    try:
        with open(file_path, 'rb') as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_func.update(chunk)
        return hash_func.hexdigest()
    except Exception as e:
        logger.error(f"Error calculating file hash: {e}")
        return ""

def calculate_string_hash(text: str, algorithm: str = 'md5') -> str:
    """Calculate string hash"""
    hash_func = getattr(hashlib, algorithm)()
    hash_func.update(text.encode('utf-8'))
    return hash_func.hexdigest()

# Date/time utilities
def get_utc_now() -> datetime:
    """Get current UTC datetime"""
    return datetime.now(timezone.utc)

def format_datetime(dt: datetime, format_str: str = "%Y-%m-%d %H:%M:%S") -> str:
    """Format datetime to string"""
    return dt.strftime(format_str)

def parse_datetime(date_str: str, format_str: str = "%Y-%m-%d %H:%M:%S") -> Optional[datetime]:
    """Parse datetime from string"""
    try:
        return datetime.strptime(date_str, format_str)
    except ValueError:
        return None

def get_time_ago(dt: datetime) -> str:
    """Get human-readable time ago string"""
    now = get_utc_now()
    if dt.tzinfo is None:
        dt = dt.replace(tzinfo=timezone.utc)
    
    diff = now - dt
    
    if diff.days > 0:
        return f"{diff.days} day{'s' if diff.days != 1 else ''} ago"
    
    hours = diff.seconds // 3600
    if hours > 0:
        return f"{hours} hour{'s' if hours != 1 else ''} ago"
    
    minutes = diff.seconds // 60
    if minutes > 0:
        return f"{minutes} minute{'s' if minutes != 1 else ''} ago"
    
    return "Just now"

def add_timezone(dt: datetime, tz_offset: int = 0) -> datetime:
    """Add timezone to datetime"""
    tz = timezone(timedelta(hours=tz_offset))
    return dt.replace(tzinfo=tz)

# File utilities
def get_file_extension(filename: str) -> str:
    """Get file extension"""
    return Path(filename).suffix.lower().lstrip('.')

def get_file_size_human(size_bytes: int) -> str:
    """Convert file size to human readable format"""
    for unit in ['B', 'KB', 'MB', 'GB', 'TB']:
        if size_bytes < 1024.0:
            return f"{size_bytes:.1f} {unit}"
        size_bytes /= 1024.0
    return f"{size_bytes:.1f} PB"

def get_mime_type(filename: str) -> str:
    """Get MIME type for file"""
    mime_type, _ = mimetypes.guess_type(filename)
    return mime_type or 'application/octet-stream'

def is_image_file(filename: str) -> bool:
    """Check if file is an image"""
    image_extensions = {'jpg', 'jpeg', 'png', 'gif', 'bmp', 'webp', 'tiff', 'svg'}
    return get_file_extension(filename) in image_extensions

def is_video_file(filename: str) -> bool:
    """Check if file is a video"""
    video_extensions = {'mp4', 'avi', 'mov', 'wmv', 'flv', 'webm', 'mkv', '3gp'}
    return get_file_extension(filename) in video_extensions

def create_directory(path: str) -> bool:
    """Create directory if it doesn't exist"""
    try:
        Path(path).mkdir(parents=True, exist_ok=True)
        return True
    except Exception as e:
        logger.error(f"Error creating directory {path}: {e}")
        return False

# Data utilities
def safe_json_loads(json_str: str, default: Any = None) -> Any:
    """Safely load JSON string"""
    try:
        return json.loads(json_str)
    except (json.JSONDecodeError, TypeError):
        return default

def safe_json_dumps(obj: Any, default: str = "{}") -> str:
    """Safely dump object to JSON string"""
    try:
        return json.dumps(obj, default=str, ensure_ascii=False)
    except (TypeError, ValueError):
        return default

def flatten_dict(d: Dict[str, Any], parent_key: str = '', sep: str = '.') -> Dict[str, Any]:
    """Flatten nested dictionary"""
    items = []
    for k, v in d.items():
        new_key = f"{parent_key}{sep}{k}" if parent_key else k
        if isinstance(v, dict):
            items.extend(flatten_dict(v, new_key, sep=sep).items())
        else:
            items.append((new_key, v))
    return dict(items)

def deep_merge_dicts(dict1: Dict[str, Any], dict2: Dict[str, Any]) -> Dict[str, Any]:
    """Deep merge two dictionaries"""
    result = dict1.copy()
    
    for key, value in dict2.items():
        if key in result and isinstance(result[key], dict) and isinstance(value, dict):
            result[key] = deep_merge_dicts(result[key], value)
        else:
            result[key] = value
    
    return result

def paginate_list(items: List[Any], page: int = 1, per_page: int = 20) -> Dict[str, Any]:
    """Paginate list of items"""
    total = len(items)
    start = (page - 1) * per_page
    end = start + per_page
    
    return {
        "items": items[start:end],
        "total": total,
        "page": page,
        "per_page": per_page,
        "pages": (total + per_page - 1) // per_page,
        "has_prev": page > 1,
        "has_next": end < total
    }

# Image utilities
def resize_image(input_path: str, output_path: str, max_width: int = 1920, max_height: int = 1080, quality: int = 85) -> bool:
    """Resize image while maintaining aspect ratio"""
    try:
        if not PIL_AVAILABLE:
            return False
        
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Calculate new size
            img.thumbnail((max_width, max_height), Image.Resampling.LANCZOS)
            
            # Save with optimization
            img.save(output_path, optimize=True, quality=quality)
            
        return True
    
    except Exception as e:
        logger.error(f"Error resizing image: {e}")
        return False

def create_thumbnail(input_path: str, output_path: str, size: Tuple[int, int] = (200, 200)) -> bool:
    """Create thumbnail image"""
    try:
        if not PIL_AVAILABLE:
            return False
        
        with Image.open(input_path) as img:
            # Convert to RGB if necessary
            if img.mode in ('RGBA', 'LA', 'P'):
                img = img.convert('RGB')
            
            # Create thumbnail
            img.thumbnail(size, Image.Resampling.LANCZOS)
            
            # Save thumbnail
            img.save(output_path, optimize=True, quality=80)
            
        return True
    
    except Exception as e:
        logger.error(f"Error creating thumbnail: {e}")
        return False

def get_image_info(file_path: str) -> Optional[Dict[str, Any]]:
    """Get image information"""
    try:
        if not PIL_AVAILABLE:
            return None
        
        with Image.open(file_path) as img:
            return {
                "width": img.width,
                "height": img.height,
                "format": img.format,
                "mode": img.mode,
                "size": img.size,
                "has_transparency": img.mode in ('RGBA', 'LA') or 'transparency' in img.info
            }
    
    except Exception as e:
        logger.error(f"Error getting image info: {e}")
        return None

# Video utilities
def get_video_info(file_path: str) -> Optional[Dict[str, Any]]:
    """Get video information"""
    try:
        if not CV2_AVAILABLE:
            return None
        
        cap = cv2.VideoCapture(file_path)
        
        if not cap.isOpened():
            return None
        
        fps = cap.get(cv2.CAP_PROP_FPS)
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        duration = frame_count / fps if fps > 0 else 0
        
        cap.release()
        
        return {
            "width": width,
            "height": height,
            "fps": fps,
            "frame_count": frame_count,
            "duration": duration,
            "resolution": f"{width}x{height}"
        }
    
    except Exception as e:
        logger.error(f"Error getting video info: {e}")
        return None

def extract_video_frame(video_path: str, output_path: str, frame_number: int = 0) -> bool:
    """Extract frame from video"""
    try:
        if not CV2_AVAILABLE:
            return False
        
        cap = cv2.VideoCapture(video_path)
        
        if not cap.isOpened():
            return False
        
        # Set frame position
        cap.set(cv2.CAP_PROP_POS_FRAMES, frame_number)
        
        # Read frame
        ret, frame = cap.read()
        cap.release()
        
        if ret:
            cv2.imwrite(output_path, frame)
            return True
        
        return False
    
    except Exception as e:
        logger.error(f"Error extracting video frame: {e}")
        return False

# Email utilities
def send_email(to_email: str, subject: str, body: str, 
               from_email: Optional[str] = None, 
               attachments: Optional[List[str]] = None,
               is_html: bool = False) -> bool:
    """Send email"""
    try:
        if not all([settings.SMTP_HOST, settings.SMTP_PORT, settings.SMTP_USERNAME, settings.SMTP_PASSWORD]):
            logger.error("SMTP configuration not complete")
            return False
        
        from_email = from_email or settings.SMTP_USERNAME
        
        # Create message
        msg = MIMEMultipart()
        msg['From'] = from_email
        msg['To'] = to_email
        msg['Subject'] = subject
        
        # Add body
        if is_html:
            msg.attach(MIMEText(body, 'html'))
        else:
            msg.attach(MIMEText(body, 'plain'))
        
        # Add attachments
        if attachments:
            for file_path in attachments:
                if Path(file_path).exists():
                    with open(file_path, 'rb') as attachment:
                        part = MIMEBase('application', 'octet-stream')
                        part.set_payload(attachment.read())
                    
                    encoders.encode_base64(part)
                    part.add_header(
                        'Content-Disposition',
                        f'attachment; filename= {Path(file_path).name}'
                    )
                    msg.attach(part)
        
        # Send email
        with smtplib.SMTP(settings.SMTP_HOST, settings.SMTP_PORT) as server:
            if settings.SMTP_USE_TLS:
                server.starttls()
            
            server.login(settings.SMTP_USERNAME, settings.SMTP_PASSWORD)
            server.send_message(msg)
        
        return True
    
    except Exception as e:
        logger.error(f"Error sending email: {e}")
        return False

# Performance utilities
def timing_decorator(func):
    """Decorator to measure function execution time"""
    @wraps(func)
    def wrapper(*args, **kwargs):
        start_time = time.time()
        result = func(*args, **kwargs)
        end_time = time.time()
        
        execution_time = end_time - start_time
        logger.info(f"{func.__name__} executed in {execution_time:.4f} seconds")
        
        return result
    return wrapper

def retry_decorator(max_retries: int = 3, delay: float = 1.0, backoff: float = 2.0):
    """Decorator to retry function on failure"""
    def decorator(func):
        @wraps(func)
        def wrapper(*args, **kwargs):
            retries = 0
            current_delay = delay
            
            while retries < max_retries:
                try:
                    return func(*args, **kwargs)
                except Exception as e:
                    retries += 1
                    if retries >= max_retries:
                        logger.error(f"{func.__name__} failed after {max_retries} retries: {e}")
                        raise
                    
                    logger.warning(f"{func.__name__} failed (attempt {retries}/{max_retries}): {e}")
                    time.sleep(current_delay)
                    current_delay *= backoff
            
            return None
        return wrapper
    return decorator

# Security utilities
def generate_csrf_token() -> str:
    """Generate CSRF token"""
    return secrets.token_urlsafe(32)

def encode_base64(data: Union[str, bytes]) -> str:
    """Encode data to base64"""
    if isinstance(data, str):
        data = data.encode('utf-8')
    return base64.b64encode(data).decode('utf-8')

def decode_base64(encoded_data: str) -> bytes:
    """Decode base64 data"""
    return base64.b64decode(encoded_data)

def mask_sensitive_data(data: str, mask_char: str = '*', visible_chars: int = 4) -> str:
    """Mask sensitive data (e.g., API keys, passwords)"""
    if len(data) <= visible_chars:
        return mask_char * len(data)
    
    return data[:visible_chars] + mask_char * (len(data) - visible_chars)

# Logging utilities
def setup_logging(log_level: str = "INFO", log_file: Optional[str] = None) -> None:
    """Setup logging configuration"""
    import logging.config
    
    config = {
        'version': 1,
        'disable_existing_loggers': False,
        'formatters': {
            'standard': {
                'format': '%(asctime)s [%(levelname)s] %(name)s: %(message)s'
            },
            'detailed': {
                'format': '%(asctime)s [%(levelname)s] %(name)s:%(lineno)d: %(message)s'
            }
        },
        'handlers': {
            'console': {
                'level': log_level,
                'class': 'logging.StreamHandler',
                'formatter': 'standard'
            }
        },
        'loggers': {
            '': {
                'handlers': ['console'],
                'level': log_level,
                'propagate': False
            }
        }
    }
    
    if log_file:
        config['handlers']['file'] = {
            'level': log_level,
            'class': 'logging.FileHandler',
            'filename': log_file,
            'formatter': 'detailed'
        }
        config['loggers']['']['handlers'].append('file')
    
    logging.config.dictConfig(config)

# Health check utilities
def check_system_health() -> Dict[str, Any]:
    """Check system health"""
    import psutil
    
    try:
        return {
            "timestamp": get_utc_now().isoformat(),
            "cpu_percent": psutil.cpu_percent(interval=1),
            "memory_percent": psutil.virtual_memory().percent,
            "disk_percent": psutil.disk_usage('/').percent,
            "load_average": psutil.getloadavg() if hasattr(psutil, 'getloadavg') else None,
            "uptime": time.time() - psutil.boot_time()
        }
    except Exception as e:
        logger.error(f"Error checking system health: {e}")
        return {
            "timestamp": get_utc_now().isoformat(),
            "error": str(e)
        }

# Export utilities
def export_to_csv(data: List[Dict[str, Any]], filename: str, fieldnames: Optional[List[str]] = None) -> bool:
    """Export data to CSV file"""
    try:
        import csv
        
        if not data:
            return False
        
        fieldnames = fieldnames or list(data[0].keys())
        
        with open(filename, 'w', newline='', encoding='utf-8') as csvfile:
            writer = csv.DictWriter(csvfile, fieldnames=fieldnames)
            writer.writeheader()
            writer.writerows(data)
        
        return True
    
    except Exception as e:
        logger.error(f"Error exporting to CSV: {e}")
        return False

def export_to_json(data: Any, filename: str, indent: int = 2) -> bool:
    """Export data to JSON file"""
    try:
        with open(filename, 'w', encoding='utf-8') as jsonfile:
            json.dump(data, jsonfile, indent=indent, default=str, ensure_ascii=False)
        
        return True
    
    except Exception as e:
        logger.error(f"Error exporting to JSON: {e}")
        return False