import os
import shutil
from pathlib import Path
from typing import Optional, Tuple, Dict, List
import cv2
import numpy as np
from PIL import Image, ImageOps
import ffmpeg
import hashlib
import mimetypes
from datetime import datetime
import logging
from dataclasses import dataclass
import asyncio
from concurrent.futures import ThreadPoolExecutor

from config import settings
from schemas import MediaMetadata

logger = logging.getLogger(__name__)

@dataclass
class ProcessingResult:
    """Result of media processing"""
    success: bool
    file_path: Optional[str] = None
    metadata: Optional[MediaMetadata] = None
    error_message: Optional[str] = None
    processing_time: Optional[float] = None

class MediaProcessor:
    """Handle media file processing, validation, and storage"""
    
    def __init__(self):
        self.upload_dir = settings.get_upload_path()
        self.executor = ThreadPoolExecutor(max_workers=4)
        
        # Supported formats
        self.image_formats = {".jpg", ".jpeg", ".png", ".bmp", ".tiff", ".webp"}
        self.video_formats = {".mp4", ".avi", ".mov", ".mkv", ".webm", ".flv"}
        
        # Create upload directories
        self._create_directories()
    
    def _create_directories(self):
        """Create necessary directories for file storage"""
        directories = [
            self.upload_dir,
            self.upload_dir / "images",
            self.upload_dir / "videos",
            self.upload_dir / "processed",
            self.upload_dir / "thumbnails",
            self.upload_dir / "temp"
        ]
        
        for directory in directories:
            directory.mkdir(parents=True, exist_ok=True)
    
    def validate_file(self, file_path: str, file_size: int) -> Tuple[bool, str]:
        """Validate uploaded file"""
        try:
            path = Path(file_path)
            
            # Check file extension
            if not settings.is_allowed_file(path.name):
                return False, f"File type {path.suffix} not allowed"
            
            # Check file size
            if file_size > settings.MAX_FILE_SIZE:
                return False, f"File size {file_size} exceeds maximum {settings.MAX_FILE_SIZE}"
            
            # Check if file exists and is readable
            if not path.exists():
                return False, "File does not exist"
            
            # Validate file content
            if path.suffix.lower() in self.image_formats:
                return self._validate_image(path)
            elif path.suffix.lower() in self.video_formats:
                return self._validate_video(path)
            else:
                return False, "Unsupported file format"
                
        except Exception as e:
            logger.error(f"Error validating file {file_path}: {e}")
            return False, f"Validation error: {str(e)}"
    
    def _validate_image(self, file_path: Path) -> Tuple[bool, str]:
        """Validate image file"""
        try:
            with Image.open(file_path) as img:
                # Check image format
                if img.format not in ['JPEG', 'PNG', 'BMP', 'TIFF', 'WEBP']:
                    return False, f"Unsupported image format: {img.format}"
                
                # Check image dimensions
                width, height = img.size
                if width < 64 or height < 64:
                    return False, "Image too small (minimum 64x64)"
                
                if width > 4096 or height > 4096:
                    return False, "Image too large (maximum 4096x4096)"
                
                # Check for corrupted image
                img.verify()
                
            return True, "Valid image"
            
        except Exception as e:
            return False, f"Invalid image file: {str(e)}"
    
    def _validate_video(self, file_path: Path) -> Tuple[bool, str]:
        """Validate video file"""
        try:
            # Use OpenCV to validate video
            cap = cv2.VideoCapture(str(file_path))
            
            if not cap.isOpened():
                return False, "Cannot open video file"
            
            # Get video properties
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
            height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
            
            cap.release()
            
            # Validate properties
            if frame_count <= 0:
                return False, "Video has no frames"
            
            if fps <= 0 or fps > 120:
                return False, f"Invalid frame rate: {fps}"
            
            if width < 64 or height < 64:
                return False, "Video resolution too small (minimum 64x64)"
            
            if width > 4096 or height > 4096:
                return False, "Video resolution too large (maximum 4096x4096)"
            
            # Check duration (max 10 minutes)
            duration = frame_count / fps
            if duration > 600:  # 10 minutes
                return False, "Video too long (maximum 10 minutes)"
            
            return True, "Valid video"
            
        except Exception as e:
            return False, f"Invalid video file: {str(e)}"
    
    def extract_metadata(self, file_path: str) -> MediaMetadata:
        """Extract metadata from media file"""
        try:
            path = Path(file_path)
            file_size = path.stat().st_size
            
            if path.suffix.lower() in self.image_formats:
                return self._extract_image_metadata(path, file_size)
            elif path.suffix.lower() in self.video_formats:
                return self._extract_video_metadata(path, file_size)
            else:
                raise ValueError(f"Unsupported file format: {path.suffix}")
                
        except Exception as e:
            logger.error(f"Error extracting metadata from {file_path}: {e}")
            # Return default metadata
            return MediaMetadata(
                filename=Path(file_path).name,
                file_size=0,
                mime_type="application/octet-stream",
                width=0,
                height=0
            )
    
    def _extract_image_metadata(self, file_path: Path, file_size: int) -> MediaMetadata:
        """Extract metadata from image file"""
        with Image.open(file_path) as img:
            width, height = img.size
            
            return MediaMetadata(
                filename=file_path.name,
                file_size=file_size,
                mime_type=f"image/{img.format.lower()}",
                width=width,
                height=height,
                duration=None,
                fps=None,
                format=img.format
            )
    
    def _extract_video_metadata(self, file_path: Path, file_size: int) -> MediaMetadata:
        """Extract metadata from video file"""
        cap = cv2.VideoCapture(str(file_path))
        
        frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
        fps = cap.get(cv2.CAP_PROP_FPS)
        width = int(cap.get(cv2.CAP_PROP_FRAME_WIDTH))
        height = int(cap.get(cv2.CAP_PROP_FRAME_HEIGHT))
        
        cap.release()
        
        duration = frame_count / fps if fps > 0 else 0
        mime_type = mimetypes.guess_type(str(file_path))[0] or "video/mp4"
        
        return MediaMetadata(
            filename=file_path.name,
            file_size=file_size,
            mime_type=mime_type,
            width=width,
            height=height,
            duration=duration,
            fps=fps,
            frame_count=frame_count,
            format=file_path.suffix[1:].upper()
        )
    
    def generate_file_hash(self, file_path: str) -> str:
        """Generate SHA-256 hash of file content"""
        hash_sha256 = hashlib.sha256()
        
        with open(file_path, "rb") as f:
            for chunk in iter(lambda: f.read(4096), b""):
                hash_sha256.update(chunk)
        
        return hash_sha256.hexdigest()
    
    def preprocess_image(self, file_path: str, target_size: Optional[Tuple[int, int]] = None) -> str:
        """Preprocess image for pose estimation"""
        try:
            path = Path(file_path)
            processed_dir = self.upload_dir / "processed"
            output_path = processed_dir / f"processed_{path.stem}.jpg"
            
            with Image.open(file_path) as img:
                # Convert to RGB if necessary
                if img.mode != 'RGB':
                    img = img.convert('RGB')
                
                # Resize if target size specified
                if target_size:
                    img = img.resize(target_size, Image.Resampling.LANCZOS)
                
                # Auto-orient based on EXIF data
                img = ImageOps.exif_transpose(img)
                
                # Normalize and enhance
                img = ImageOps.autocontrast(img, cutoff=1)
                
                # Save processed image
                img.save(output_path, "JPEG", quality=95, optimize=True)
            
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Error preprocessing image {file_path}: {e}")
            raise
    
    def preprocess_video(self, file_path: str, target_fps: Optional[float] = None) -> str:
        """Preprocess video for pose estimation"""
        try:
            path = Path(file_path)
            processed_dir = self.upload_dir / "processed"
            output_path = processed_dir / f"processed_{path.stem}.mp4"
            
            # Get video info
            probe = ffmpeg.probe(file_path)
            video_stream = next((stream for stream in probe['streams'] if stream['codec_type'] == 'video'), None)
            
            if not video_stream:
                raise ValueError("No video stream found")
            
            # Build ffmpeg command
            input_stream = ffmpeg.input(file_path)
            
            # Set target FPS if specified
            if target_fps:
                input_stream = ffmpeg.filter(input_stream, 'fps', fps=target_fps)
            
            # Apply video filters
            input_stream = ffmpeg.filter(input_stream, 'scale', 1280, 720)  # Standardize resolution
            
            # Output with optimized settings
            output_stream = ffmpeg.output(
                input_stream,
                str(output_path),
                vcodec='libx264',
                crf=23,
                preset='medium',
                movflags='faststart'
            )
            
            # Run ffmpeg
            ffmpeg.run(output_stream, overwrite_output=True, quiet=True)
            
            return str(output_path)
            
        except Exception as e:
            logger.error(f"Error preprocessing video {file_path}: {e}")
            raise
    
    def create_thumbnail(self, file_path: str, size: Tuple[int, int] = (200, 200)) -> str:
        """Create thumbnail for media file"""
        try:
            path = Path(file_path)
            thumbnail_dir = self.upload_dir / "thumbnails"
            thumbnail_path = thumbnail_dir / f"thumb_{path.stem}.jpg"
            
            if path.suffix.lower() in self.image_formats:
                # Create image thumbnail
                with Image.open(file_path) as img:
                    img.thumbnail(size, Image.Resampling.LANCZOS)
                    
                    # Convert to RGB if necessary
                    if img.mode != 'RGB':
                        img = img.convert('RGB')
                    
                    img.save(thumbnail_path, "JPEG", quality=85)
            
            elif path.suffix.lower() in self.video_formats:
                # Create video thumbnail from first frame
                cap = cv2.VideoCapture(file_path)
                ret, frame = cap.read()
                cap.release()
                
                if ret:
                    # Convert BGR to RGB
                    frame_rgb = cv2.cvtColor(frame, cv2.COLOR_BGR2RGB)
                    img = Image.fromarray(frame_rgb)
                    img.thumbnail(size, Image.Resampling.LANCZOS)
                    img.save(thumbnail_path, "JPEG", quality=85)
                else:
                    raise ValueError("Could not extract frame from video")
            
            return str(thumbnail_path)
            
        except Exception as e:
            logger.error(f"Error creating thumbnail for {file_path}: {e}")
            raise
    
    async def process_media_file(self, file_path: str, user_id: int) -> ProcessingResult:
        """Process uploaded media file"""
        start_time = datetime.now()
        
        try:
            # Validate file
            file_size = Path(file_path).stat().st_size
            is_valid, error_msg = self.validate_file(file_path, file_size)
            
            if not is_valid:
                return ProcessingResult(
                    success=False,
                    error_message=error_msg
                )
            
            # Extract metadata
            metadata = self.extract_metadata(file_path)
            
            # Generate file hash for deduplication
            file_hash = self.generate_file_hash(file_path)
            
            # Create organized file path
            path = Path(file_path)
            date_dir = datetime.now().strftime("%Y/%m/%d")
            
            if path.suffix.lower() in self.image_formats:
                organized_dir = self.upload_dir / "images" / date_dir
            else:
                organized_dir = self.upload_dir / "videos" / date_dir
            
            organized_dir.mkdir(parents=True, exist_ok=True)
            
            # Create unique filename
            timestamp = datetime.now().strftime("%H%M%S")
            new_filename = f"{user_id}_{timestamp}_{file_hash[:8]}{path.suffix}"
            organized_path = organized_dir / new_filename
            
            # Move file to organized location
            shutil.move(file_path, organized_path)
            
            # Create thumbnail
            loop = asyncio.get_event_loop()
            thumbnail_path = await loop.run_in_executor(
                self.executor, self.create_thumbnail, str(organized_path)
            )
            
            # Update metadata with new paths
            metadata.file_path = str(organized_path)
            metadata.thumbnail_path = thumbnail_path
            metadata.file_hash = file_hash
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return ProcessingResult(
                success=True,
                file_path=str(organized_path),
                metadata=metadata,
                processing_time=processing_time
            )
            
        except Exception as e:
            logger.error(f"Error processing media file {file_path}: {e}")
            return ProcessingResult(
                success=False,
                error_message=f"Processing error: {str(e)}"
            )
    
    def delete_media_file(self, file_path: str) -> bool:
        """Delete media file and associated files"""
        try:
            path = Path(file_path)
            
            # Delete main file
            if path.exists():
                path.unlink()
            
            # Delete thumbnail
            thumbnail_path = self.upload_dir / "thumbnails" / f"thumb_{path.stem}.jpg"
            if thumbnail_path.exists():
                thumbnail_path.unlink()
            
            # Delete processed version
            processed_path = self.upload_dir / "processed" / f"processed_{path.stem}.jpg"
            if processed_path.exists():
                processed_path.unlink()
            
            processed_video_path = self.upload_dir / "processed" / f"processed_{path.stem}.mp4"
            if processed_video_path.exists():
                processed_video_path.unlink()
            
            return True
            
        except Exception as e:
            logger.error(f"Error deleting media file {file_path}: {e}")
            return False
    
    def cleanup_temp_files(self, max_age_hours: int = 24):
        """Clean up temporary files older than specified age"""
        try:
            temp_dir = self.upload_dir / "temp"
            current_time = datetime.now()
            
            for file_path in temp_dir.iterdir():
                if file_path.is_file():
                    file_age = current_time - datetime.fromtimestamp(file_path.stat().st_mtime)
                    
                    if file_age.total_seconds() > max_age_hours * 3600:
                        file_path.unlink()
                        logger.info(f"Deleted old temp file: {file_path}")
            
        except Exception as e:
            logger.error(f"Error cleaning up temp files: {e}")
    
    def get_storage_stats(self) -> Dict[str, any]:
        """Get storage usage statistics"""
        try:
            stats = {
                "total_files": 0,
                "total_size": 0,
                "images": {"count": 0, "size": 0},
                "videos": {"count": 0, "size": 0},
                "thumbnails": {"count": 0, "size": 0},
                "processed": {"count": 0, "size": 0}
            }
            
            for category in ["images", "videos", "thumbnails", "processed"]:
                category_dir = self.upload_dir / category
                if category_dir.exists():
                    for file_path in category_dir.rglob("*"):
                        if file_path.is_file():
                            file_size = file_path.stat().st_size
                            stats[category]["count"] += 1
                            stats[category]["size"] += file_size
                            stats["total_files"] += 1
                            stats["total_size"] += file_size
            
            return stats
            
        except Exception as e:
            logger.error(f"Error getting storage stats: {e}")
            return {}

# Global media processor instance
media_processor = MediaProcessor()