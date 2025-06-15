import logging
import sys
from logging.handlers import RotatingFileHandler

def setup_logging():
    """Configure logging for the application"""
    # Create formatter
    formatter = logging.Formatter(
        '%(asctime)s - %(name)s - %(levelname)s - %(message)s'
    )
    
    # Setup file handler with rotation
    file_handler = RotatingFileHandler(
        'webrtc.log',
        maxBytes=10485760,  # 10MB
        backupCount=5
    )
    file_handler.setFormatter(formatter)
    
    # Setup console handler
    console_handler = logging.StreamHandler(sys.stdout)
    console_handler.setFormatter(formatter)
    
    # Get root logger
    logger = logging.getLogger()
    logger.setLevel(logging.INFO)
    
    # Add handlers
    logger.addHandler(file_handler)
    logger.addHandler(console_handler)
    
    # Set specific logger levels
    logging.getLogger('websockets').setLevel(logging.INFO)
    logging.getLogger('asyncio').setLevel(logging.INFO)
    logging.getLogger('fastapi').setLevel(logging.INFO)
    
    return logger
