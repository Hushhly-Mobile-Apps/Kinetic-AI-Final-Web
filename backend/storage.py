import os
import shutil
from abc import ABC, abstractmethod
from typing import Optional, Dict, Any, BinaryIO, List
from pathlib import Path
import mimetypes
import hashlib
from datetime import datetime
import logging
from urllib.parse import urlparse

try:
    import boto3
    from botocore.exceptions import ClientError, NoCredentialsError
    BOTO3_AVAILABLE = True
except ImportError:
    BOTO3_AVAILABLE = False

try:
    from google.cloud import storage as gcs
    from google.api_core import exceptions as gcs_exceptions
    GCS_AVAILABLE = True
except ImportError:
    GCS_AVAILABLE = False

from config import settings

logger = logging.getLogger(__name__)

class StorageBackend(ABC):
    """Abstract base class for storage backends"""
    
    @abstractmethod
    def upload_file(self, file_path: str, destination: str, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Upload file to storage"""
        pass
    
    @abstractmethod
    def download_file(self, source: str, destination: str) -> bool:
        """Download file from storage"""
        pass
    
    @abstractmethod
    def delete_file(self, file_path: str) -> bool:
        """Delete file from storage"""
        pass
    
    @abstractmethod
    def file_exists(self, file_path: str) -> bool:
        """Check if file exists"""
        pass
    
    @abstractmethod
    def get_file_url(self, file_path: str, expires_in: int = 3600) -> Optional[str]:
        """Get file URL (signed URL for cloud storage)"""
        pass
    
    @abstractmethod
    def get_file_metadata(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Get file metadata"""
        pass
    
    @abstractmethod
    def list_files(self, prefix: str = "", limit: int = 100) -> List[Dict[str, Any]]:
        """List files with optional prefix"""
        pass

class LocalStorage(StorageBackend):
    """Local filesystem storage backend"""
    
    def __init__(self, base_path: str):
        self.base_path = Path(base_path)
        self.base_path.mkdir(parents=True, exist_ok=True)
        logger.info(f"Local storage initialized at {self.base_path}")
    
    def _get_full_path(self, file_path: str) -> Path:
        """Get full path for file"""
        return self.base_path / file_path.lstrip('/')
    
    def upload_file(self, file_path: str, destination: str, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Upload file to local storage"""
        try:
            source_path = Path(file_path)
            dest_path = self._get_full_path(destination)
            
            # Create destination directory
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy file
            shutil.copy2(source_path, dest_path)
            
            # Get file info
            stat = dest_path.stat()
            
            result = {
                "success": True,
                "path": destination,
                "size": stat.st_size,
                "modified_time": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "content_type": mimetypes.guess_type(str(dest_path))[0],
                "etag": self._calculate_etag(dest_path)
            }
            
            if metadata:
                result["metadata"] = metadata
            
            return result
            
        except Exception as e:
            logger.error(f"Error uploading file to local storage: {e}")
            return {"success": False, "error": str(e)}
    
    def download_file(self, source: str, destination: str) -> bool:
        """Download file from local storage"""
        try:
            source_path = self._get_full_path(source)
            dest_path = Path(destination)
            
            if not source_path.exists():
                return False
            
            # Create destination directory
            dest_path.parent.mkdir(parents=True, exist_ok=True)
            
            # Copy file
            shutil.copy2(source_path, dest_path)
            return True
            
        except Exception as e:
            logger.error(f"Error downloading file from local storage: {e}")
            return False
    
    def delete_file(self, file_path: str) -> bool:
        """Delete file from local storage"""
        try:
            full_path = self._get_full_path(file_path)
            if full_path.exists():
                full_path.unlink()
                return True
            return False
            
        except Exception as e:
            logger.error(f"Error deleting file from local storage: {e}")
            return False
    
    def file_exists(self, file_path: str) -> bool:
        """Check if file exists in local storage"""
        return self._get_full_path(file_path).exists()
    
    def get_file_url(self, file_path: str, expires_in: int = 3600) -> Optional[str]:
        """Get file URL for local storage"""
        if self.file_exists(file_path):
            # Return relative path for local files
            return f"/media/{file_path}"
        return None
    
    def get_file_metadata(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Get file metadata from local storage"""
        try:
            full_path = self._get_full_path(file_path)
            if not full_path.exists():
                return None
            
            stat = full_path.stat()
            return {
                "size": stat.st_size,
                "modified_time": datetime.fromtimestamp(stat.st_mtime).isoformat(),
                "created_time": datetime.fromtimestamp(stat.st_ctime).isoformat(),
                "content_type": mimetypes.guess_type(str(full_path))[0],
                "etag": self._calculate_etag(full_path)
            }
            
        except Exception as e:
            logger.error(f"Error getting file metadata: {e}")
            return None
    
    def list_files(self, prefix: str = "", limit: int = 100) -> List[Dict[str, Any]]:
        """List files in local storage"""
        try:
            search_path = self._get_full_path(prefix)
            files = []
            
            if search_path.is_file():
                files.append(self._file_info(search_path, prefix))
            elif search_path.is_dir():
                for file_path in search_path.rglob('*'):
                    if file_path.is_file() and len(files) < limit:
                        relative_path = file_path.relative_to(self.base_path)
                        files.append(self._file_info(file_path, str(relative_path)))
            
            return files[:limit]
            
        except Exception as e:
            logger.error(f"Error listing files: {e}")
            return []
    
    def _file_info(self, file_path: Path, key: str) -> Dict[str, Any]:
        """Get file information"""
        stat = file_path.stat()
        return {
            "key": key,
            "size": stat.st_size,
            "modified_time": datetime.fromtimestamp(stat.st_mtime).isoformat(),
            "content_type": mimetypes.guess_type(str(file_path))[0],
            "etag": self._calculate_etag(file_path)
        }
    
    def _calculate_etag(self, file_path: Path) -> str:
        """Calculate ETag for file"""
        try:
            hash_md5 = hashlib.md5()
            with open(file_path, "rb") as f:
                for chunk in iter(lambda: f.read(4096), b""):
                    hash_md5.update(chunk)
            return hash_md5.hexdigest()
        except Exception:
            return ""

class S3Storage(StorageBackend):
    """Amazon S3 storage backend"""
    
    def __init__(self, bucket_name: str, region: str = "us-east-1", 
                 access_key: Optional[str] = None, secret_key: Optional[str] = None):
        if not BOTO3_AVAILABLE:
            raise ImportError("boto3 is required for S3 storage")
        
        self.bucket_name = bucket_name
        self.region = region
        
        try:
            if access_key and secret_key:
                self.s3_client = boto3.client(
                    's3',
                    region_name=region,
                    aws_access_key_id=access_key,
                    aws_secret_access_key=secret_key
                )
            else:
                # Use default credentials (IAM role, environment variables, etc.)
                self.s3_client = boto3.client('s3', region_name=region)
            
            # Test connection
            self.s3_client.head_bucket(Bucket=bucket_name)
            logger.info(f"S3 storage initialized for bucket {bucket_name}")
            
        except (ClientError, NoCredentialsError) as e:
            logger.error(f"Failed to initialize S3 storage: {e}")
            raise
    
    def upload_file(self, file_path: str, destination: str, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Upload file to S3"""
        try:
            extra_args = {}
            
            # Add metadata
            if metadata:
                extra_args['Metadata'] = {k: str(v) for k, v in metadata.items()}
            
            # Set content type
            content_type = mimetypes.guess_type(file_path)[0]
            if content_type:
                extra_args['ContentType'] = content_type
            
            # Upload file
            self.s3_client.upload_file(file_path, self.bucket_name, destination, ExtraArgs=extra_args)
            
            # Get object info
            response = self.s3_client.head_object(Bucket=self.bucket_name, Key=destination)
            
            return {
                "success": True,
                "path": destination,
                "size": response['ContentLength'],
                "modified_time": response['LastModified'].isoformat(),
                "content_type": response.get('ContentType'),
                "etag": response['ETag'].strip('"'),
                "metadata": response.get('Metadata', {})
            }
            
        except Exception as e:
            logger.error(f"Error uploading file to S3: {e}")
            return {"success": False, "error": str(e)}
    
    def download_file(self, source: str, destination: str) -> bool:
        """Download file from S3"""
        try:
            # Create destination directory
            Path(destination).parent.mkdir(parents=True, exist_ok=True)
            
            self.s3_client.download_file(self.bucket_name, source, destination)
            return True
            
        except Exception as e:
            logger.error(f"Error downloading file from S3: {e}")
            return False
    
    def delete_file(self, file_path: str) -> bool:
        """Delete file from S3"""
        try:
            self.s3_client.delete_object(Bucket=self.bucket_name, Key=file_path)
            return True
            
        except Exception as e:
            logger.error(f"Error deleting file from S3: {e}")
            return False
    
    def file_exists(self, file_path: str) -> bool:
        """Check if file exists in S3"""
        try:
            self.s3_client.head_object(Bucket=self.bucket_name, Key=file_path)
            return True
        except ClientError:
            return False
    
    def get_file_url(self, file_path: str, expires_in: int = 3600) -> Optional[str]:
        """Get signed URL for S3 file"""
        try:
            url = self.s3_client.generate_presigned_url(
                'get_object',
                Params={'Bucket': self.bucket_name, 'Key': file_path},
                ExpiresIn=expires_in
            )
            return url
        except Exception as e:
            logger.error(f"Error generating S3 URL: {e}")
            return None
    
    def get_file_metadata(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Get file metadata from S3"""
        try:
            response = self.s3_client.head_object(Bucket=self.bucket_name, Key=file_path)
            return {
                "size": response['ContentLength'],
                "modified_time": response['LastModified'].isoformat(),
                "content_type": response.get('ContentType'),
                "etag": response['ETag'].strip('"'),
                "metadata": response.get('Metadata', {})
            }
        except Exception as e:
            logger.error(f"Error getting S3 file metadata: {e}")
            return None
    
    def list_files(self, prefix: str = "", limit: int = 100) -> List[Dict[str, Any]]:
        """List files in S3"""
        try:
            response = self.s3_client.list_objects_v2(
                Bucket=self.bucket_name,
                Prefix=prefix,
                MaxKeys=limit
            )
            
            files = []
            for obj in response.get('Contents', []):
                files.append({
                    "key": obj['Key'],
                    "size": obj['Size'],
                    "modified_time": obj['LastModified'].isoformat(),
                    "etag": obj['ETag'].strip('"')
                })
            
            return files
            
        except Exception as e:
            logger.error(f"Error listing S3 files: {e}")
            return []

class GCSStorage(StorageBackend):
    """Google Cloud Storage backend"""
    
    def __init__(self, bucket_name: str, credentials_path: Optional[str] = None):
        if not GCS_AVAILABLE:
            raise ImportError("google-cloud-storage is required for GCS storage")
        
        self.bucket_name = bucket_name
        
        try:
            if credentials_path:
                self.client = gcs.Client.from_service_account_json(credentials_path)
            else:
                # Use default credentials
                self.client = gcs.Client()
            
            self.bucket = self.client.bucket(bucket_name)
            
            # Test connection
            self.bucket.exists()
            logger.info(f"GCS storage initialized for bucket {bucket_name}")
            
        except Exception as e:
            logger.error(f"Failed to initialize GCS storage: {e}")
            raise
    
    def upload_file(self, file_path: str, destination: str, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Upload file to GCS"""
        try:
            blob = self.bucket.blob(destination)
            
            # Set metadata
            if metadata:
                blob.metadata = {k: str(v) for k, v in metadata.items()}
            
            # Set content type
            content_type = mimetypes.guess_type(file_path)[0]
            if content_type:
                blob.content_type = content_type
            
            # Upload file
            blob.upload_from_filename(file_path)
            
            return {
                "success": True,
                "path": destination,
                "size": blob.size,
                "modified_time": blob.updated.isoformat(),
                "content_type": blob.content_type,
                "etag": blob.etag,
                "metadata": blob.metadata or {}
            }
            
        except Exception as e:
            logger.error(f"Error uploading file to GCS: {e}")
            return {"success": False, "error": str(e)}
    
    def download_file(self, source: str, destination: str) -> bool:
        """Download file from GCS"""
        try:
            blob = self.bucket.blob(source)
            
            # Create destination directory
            Path(destination).parent.mkdir(parents=True, exist_ok=True)
            
            blob.download_to_filename(destination)
            return True
            
        except Exception as e:
            logger.error(f"Error downloading file from GCS: {e}")
            return False
    
    def delete_file(self, file_path: str) -> bool:
        """Delete file from GCS"""
        try:
            blob = self.bucket.blob(file_path)
            blob.delete()
            return True
            
        except Exception as e:
            logger.error(f"Error deleting file from GCS: {e}")
            return False
    
    def file_exists(self, file_path: str) -> bool:
        """Check if file exists in GCS"""
        try:
            blob = self.bucket.blob(file_path)
            return blob.exists()
        except Exception:
            return False
    
    def get_file_url(self, file_path: str, expires_in: int = 3600) -> Optional[str]:
        """Get signed URL for GCS file"""
        try:
            blob = self.bucket.blob(file_path)
            url = blob.generate_signed_url(
                expiration=datetime.utcnow() + timedelta(seconds=expires_in),
                method='GET'
            )
            return url
        except Exception as e:
            logger.error(f"Error generating GCS URL: {e}")
            return None
    
    def get_file_metadata(self, file_path: str) -> Optional[Dict[str, Any]]:
        """Get file metadata from GCS"""
        try:
            blob = self.bucket.blob(file_path)
            blob.reload()
            
            return {
                "size": blob.size,
                "modified_time": blob.updated.isoformat(),
                "content_type": blob.content_type,
                "etag": blob.etag,
                "metadata": blob.metadata or {}
            }
        except Exception as e:
            logger.error(f"Error getting GCS file metadata: {e}")
            return None
    
    def list_files(self, prefix: str = "", limit: int = 100) -> List[Dict[str, Any]]:
        """List files in GCS"""
        try:
            blobs = self.client.list_blobs(self.bucket, prefix=prefix, max_results=limit)
            
            files = []
            for blob in blobs:
                files.append({
                    "key": blob.name,
                    "size": blob.size,
                    "modified_time": blob.updated.isoformat(),
                    "content_type": blob.content_type,
                    "etag": blob.etag
                })
            
            return files
            
        except Exception as e:
            logger.error(f"Error listing GCS files: {e}")
            return []

class StorageManager:
    """Storage manager that handles multiple storage backends"""
    
    def __init__(self):
        self.backends = {}
        self.default_backend = None
        self._initialize_backends()
    
    def _initialize_backends(self):
        """Initialize storage backends based on configuration"""
        # Local storage (always available)
        local_storage = LocalStorage(settings.UPLOAD_DIR)
        self.backends['local'] = local_storage
        self.default_backend = 'local'
        
        # S3 storage
        if settings.STORAGE_TYPE == 's3' and settings.S3_BUCKET:
            try:
                s3_storage = S3Storage(
                    bucket_name=settings.S3_BUCKET,
                    region=settings.AWS_REGION,
                    access_key=settings.AWS_ACCESS_KEY_ID,
                    secret_key=settings.AWS_SECRET_ACCESS_KEY
                )
                self.backends['s3'] = s3_storage
                self.default_backend = 's3'
            except Exception as e:
                logger.error(f"Failed to initialize S3 storage: {e}")
        
        # GCS storage
        if settings.STORAGE_TYPE == 'gcs' and settings.GCP_BUCKET:
            try:
                gcs_storage = GCSStorage(
                    bucket_name=settings.GCP_BUCKET,
                    credentials_path=settings.GCP_CREDENTIALS_PATH
                )
                self.backends['gcs'] = gcs_storage
                self.default_backend = 'gcs'
            except Exception as e:
                logger.error(f"Failed to initialize GCS storage: {e}")
        
        logger.info(f"Storage manager initialized with backends: {list(self.backends.keys())}")
        logger.info(f"Default backend: {self.default_backend}")
    
    def get_backend(self, backend_name: Optional[str] = None) -> StorageBackend:
        """Get storage backend"""
        backend_name = backend_name or self.default_backend
        if backend_name not in self.backends:
            raise ValueError(f"Storage backend '{backend_name}' not available")
        return self.backends[backend_name]
    
    def upload_file(self, file_path: str, destination: str, 
                   backend: Optional[str] = None, metadata: Optional[Dict] = None) -> Dict[str, Any]:
        """Upload file using specified backend"""
        storage_backend = self.get_backend(backend)
        result = storage_backend.upload_file(file_path, destination, metadata)
        
        if result.get('success'):
            result['backend'] = backend or self.default_backend
        
        return result
    
    def download_file(self, source: str, destination: str, backend: Optional[str] = None) -> bool:
        """Download file using specified backend"""
        storage_backend = self.get_backend(backend)
        return storage_backend.download_file(source, destination)
    
    def delete_file(self, file_path: str, backend: Optional[str] = None) -> bool:
        """Delete file using specified backend"""
        storage_backend = self.get_backend(backend)
        return storage_backend.delete_file(file_path)
    
    def file_exists(self, file_path: str, backend: Optional[str] = None) -> bool:
        """Check if file exists using specified backend"""
        storage_backend = self.get_backend(backend)
        return storage_backend.file_exists(file_path)
    
    def get_file_url(self, file_path: str, expires_in: int = 3600, backend: Optional[str] = None) -> Optional[str]:
        """Get file URL using specified backend"""
        storage_backend = self.get_backend(backend)
        return storage_backend.get_file_url(file_path, expires_in)
    
    def get_file_metadata(self, file_path: str, backend: Optional[str] = None) -> Optional[Dict[str, Any]]:
        """Get file metadata using specified backend"""
        storage_backend = self.get_backend(backend)
        return storage_backend.get_file_metadata(file_path)
    
    def list_files(self, prefix: str = "", limit: int = 100, backend: Optional[str] = None) -> List[Dict[str, Any]]:
        """List files using specified backend"""
        storage_backend = self.get_backend(backend)
        return storage_backend.list_files(prefix, limit)
    
    def get_storage_stats(self) -> Dict[str, Any]:
        """Get storage statistics for all backends"""
        stats = {
            "backends": list(self.backends.keys()),
            "default_backend": self.default_backend,
            "backend_stats": {}
        }
        
        for name, backend in self.backends.items():
            try:
                if isinstance(backend, LocalStorage):
                    # Calculate local storage usage
                    total_size = 0
                    file_count = 0
                    for file_path in backend.base_path.rglob('*'):
                        if file_path.is_file():
                            total_size += file_path.stat().st_size
                            file_count += 1
                    
                    stats["backend_stats"][name] = {
                        "type": "local",
                        "total_size": total_size,
                        "file_count": file_count,
                        "base_path": str(backend.base_path)
                    }
                else:
                    # For cloud storage, we can't easily get total usage
                    stats["backend_stats"][name] = {
                        "type": "cloud",
                        "available": True
                    }
            except Exception as e:
                stats["backend_stats"][name] = {
                    "error": str(e),
                    "available": False
                }
        
        return stats

# Global storage manager instance
storage_manager = StorageManager()

# Utility functions
def generate_file_path(user_id: int, filename: str, file_type: str = "media") -> str:
    """Generate organized file path"""
    from datetime import datetime
    
    # Get file extension
    file_ext = Path(filename).suffix.lower()
    
    # Generate timestamp-based path
    now = datetime.utcnow()
    date_path = now.strftime("%Y/%m/%d")
    
    # Generate unique filename
    timestamp = now.strftime("%H%M%S")
    unique_filename = f"{user_id}_{timestamp}_{filename}"
    
    return f"{file_type}/{date_path}/{unique_filename}"

def get_file_hash(file_path: str) -> str:
    """Calculate file hash"""
    hash_md5 = hashlib.md5()
    try:
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_md5.update(chunk)
        return hash_md5.hexdigest()
    except Exception as e:
        logger.error(f"Error calculating file hash: {e}")
        return ""

def validate_file_type(filename: str, allowed_types: List[str]) -> bool:
    """Validate file type based on extension"""
    file_ext = Path(filename).suffix.lower().lstrip('.')
    return file_ext in allowed_types

def get_storage_health() -> Dict[str, Any]:
    """Get storage health status"""
    health = {
        "timestamp": datetime.utcnow().isoformat(),
        "backends": {}
    }
    
    for name, backend in storage_manager.backends.items():
        try:
            # Test basic operations
            test_key = f"health_check_{datetime.utcnow().timestamp()}"
            
            if isinstance(backend, LocalStorage):
                # Test local storage
                test_file = backend.base_path / "health_check.txt"
                test_file.write_text("health check")
                exists = test_file.exists()
                test_file.unlink(missing_ok=True)
                
                health["backends"][name] = {
                    "available": exists,
                    "type": "local",
                    "path": str(backend.base_path)
                }
            else:
                # Test cloud storage (simplified)
                health["backends"][name] = {
                    "available": True,
                    "type": "cloud"
                }
        
        except Exception as e:
            health["backends"][name] = {
                "available": False,
                "error": str(e)
            }
    
    return health