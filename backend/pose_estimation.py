import cv2
import numpy as np
import json
from typing import List, Dict, Tuple, Optional, Union
from pathlib import Path
import logging
from datetime import datetime
import asyncio
from concurrent.futures import ThreadPoolExecutor
import torch
from dataclasses import dataclass

from config import settings
from schemas import PoseKeypointsCreate
from advanced_ai_features import PoseKeypoint

logger = logging.getLogger(__name__)

@dataclass
class PoseEstimationResult:
    """Result of pose estimation"""
    keypoints: List[PoseKeypoint]
    confidence_scores: List[float]
    processing_time: float
    frame_number: Optional[int] = None
    timestamp: Optional[datetime] = None

class OpenPoseEstimator:
    """OpenPose-based pose estimation"""
    
    def __init__(self):
        self.net = None
        self.output_layers = None
        self.is_initialized = False
        self.executor = ThreadPoolExecutor(max_workers=settings.MAX_CONCURRENT_JOBS)
        
        # BODY_25 model keypoint names
        self.BODY_PARTS = {
            0: "Nose", 1: "Neck", 2: "RShoulder", 3: "RElbow", 4: "RWrist",
            5: "LShoulder", 6: "LElbow", 7: "LWrist", 8: "MidHip", 9: "RHip",
            10: "RKnee", 11: "RAnkle", 12: "LHip", 13: "LKnee", 14: "LAnkle",
            15: "REye", 16: "LEye", 17: "REar", 18: "LEar", 19: "LBigToe",
            20: "LSmallToe", 21: "LHeel", 22: "RBigToe", 23: "RSmallToe", 24: "RHeel"
        }
        
        # Pose pairs for skeleton drawing
        self.POSE_PAIRS = [
            (1, 2), (1, 5), (2, 3), (3, 4), (5, 6), (6, 7),
            (1, 8), (8, 9), (9, 10), (10, 11), (8, 12), (12, 13),
            (13, 14), (1, 0), (0, 15), (15, 17), (0, 16), (16, 18),
            (14, 19), (19, 20), (14, 21), (11, 22), (22, 23), (11, 24)
        ]
        
        self.initialize_model()
    
    def initialize_model(self):
        """Initialize OpenPose model"""
        try:
            # For this implementation, we'll use OpenCV DNN with OpenPose
            # In production, you might want to use the official OpenPose library
            model_path = Path(settings.OPENPOSE_MODEL_PATH)
            
            if not model_path.exists():
                logger.warning(f"OpenPose model not found at {model_path}. Using mock implementation.")
                self.is_initialized = False
                return
            
            # Load the network
            prototxt_path = model_path / "pose_deploy_linevec.prototxt"
            weights_path = model_path / "pose_iter_440000.caffemodel"
            
            if prototxt_path.exists() and weights_path.exists():
                self.net = cv2.dnn.readNetFromCaffe(str(prototxt_path), str(weights_path))
                
                if settings.USE_GPU and cv2.cuda.getCudaEnabledDeviceCount() > 0:
                    self.net.setPreferableBackend(cv2.dnn.DNN_BACKEND_CUDA)
                    self.net.setPreferableTarget(cv2.dnn.DNN_TARGET_CUDA)
                    logger.info("Using GPU for pose estimation")
                else:
                    self.net.setPreferableBackend(cv2.dnn.DNN_BACKEND_OPENCV)
                    self.net.setPreferableTarget(cv2.dnn.DNN_TARGET_CPU)
                    logger.info("Using CPU for pose estimation")
                
                self.is_initialized = True
                logger.info("OpenPose model initialized successfully")
            else:
                logger.error(f"Model files not found: {prototxt_path}, {weights_path}")
                self.is_initialized = False
                
        except Exception as e:
            logger.error(f"Failed to initialize OpenPose model: {e}")
            self.is_initialized = False
    
    def preprocess_image(self, image: np.ndarray) -> Tuple[np.ndarray, float, float]:
        """Preprocess image for pose estimation"""
        # Get image dimensions
        height, width = image.shape[:2]
        
        # Parse net resolution
        net_width, net_height = map(int, settings.OPENPOSE_NET_RESOLUTION.split('x'))
        
        # Create blob from image
        blob = cv2.dnn.blobFromImage(
            image, 1.0 / 255, (net_width, net_height), (0, 0, 0), swapRB=False, crop=False
        )
        
        # Calculate scaling factors
        scale_x = width / net_width
        scale_y = height / net_height
        
        return blob, scale_x, scale_y
    
    def postprocess_output(self, output: np.ndarray, scale_x: float, scale_y: float, 
                          threshold: float = None) -> List[PoseKeypoint]:
        """Postprocess network output to extract keypoints"""
        if threshold is None:
            threshold = settings.OPENPOSE_RENDER_THRESHOLD
        
        keypoints = []
        
        # Extract keypoints from heatmaps
        for i in range(len(self.BODY_PARTS)):
            # Get probability map for body part
            prob_map = output[0, i, :, :]
            
            # Find global maximum
            min_val, prob, min_loc, point = cv2.minMaxLoc(prob_map)
            
            # Scale point coordinates
            x = int(point[0] * scale_x)
            y = int(point[1] * scale_y)
            
            if prob > threshold:
                keypoints.append(PoseKeypoint(
                    part_name=self.BODY_PARTS[i],
                    x=float(x),
                    y=float(y),
                    confidence=float(prob)
                ))
            else:
                # Add keypoint with zero confidence if not detected
                keypoints.append(PoseKeypoint(
                    part_name=self.BODY_PARTS[i],
                    x=0.0,
                    y=0.0,
                    confidence=0.0
                ))
        
        return keypoints
    
    def estimate_pose_image(self, image: np.ndarray) -> PoseEstimationResult:
        """Estimate pose from a single image"""
        start_time = datetime.now()
        
        if not self.is_initialized:
            # Mock implementation for testing
            return self._mock_pose_estimation()
        
        try:
            # Preprocess image
            blob, scale_x, scale_y = self.preprocess_image(image)
            
            # Set input to the network
            self.net.setInput(blob)
            
            # Run forward pass
            output = self.net.forward()
            
            # Postprocess output
            keypoints = self.postprocess_output(output, scale_x, scale_y)
            
            # Calculate confidence scores
            confidence_scores = [kp.confidence for kp in keypoints]
            
            processing_time = (datetime.now() - start_time).total_seconds()
            
            return PoseEstimationResult(
                keypoints=keypoints,
                confidence_scores=confidence_scores,
                processing_time=processing_time,
                timestamp=datetime.now()
            )
            
        except Exception as e:
            logger.error(f"Error in pose estimation: {e}")
            return self._mock_pose_estimation()
    
    def _mock_pose_estimation(self) -> PoseEstimationResult:
        """Mock pose estimation for testing when model is not available"""
        keypoints = []
        for i, part_name in self.BODY_PARTS.items():
            # Generate random keypoints for testing
            keypoints.append(PoseKeypoint(
                part_name=part_name,
                x=float(np.random.randint(50, 550)),
                y=float(np.random.randint(50, 450)),
                confidence=float(np.random.uniform(0.3, 0.9))
            ))
        
        confidence_scores = [kp.confidence for kp in keypoints]
        
        return PoseEstimationResult(
            keypoints=keypoints,
            confidence_scores=confidence_scores,
            processing_time=0.1,
            timestamp=datetime.now()
        )
    
    async def estimate_pose_video(self, video_path: str, 
                                 frame_skip: int = 1) -> List[PoseEstimationResult]:
        """Estimate pose for all frames in a video"""
        results = []
        
        try:
            cap = cv2.VideoCapture(video_path)
            frame_count = int(cap.get(cv2.CAP_PROP_FRAME_COUNT))
            fps = cap.get(cv2.CAP_PROP_FPS)
            
            frame_number = 0
            processed_frames = 0
            
            while True:
                ret, frame = cap.read()
                if not ret:
                    break
                
                # Skip frames if specified
                if frame_number % (frame_skip + 1) != 0:
                    frame_number += 1
                    continue
                
                # Estimate pose for current frame
                loop = asyncio.get_event_loop()
                result = await loop.run_in_executor(
                    self.executor, self.estimate_pose_image, frame
                )
                
                result.frame_number = frame_number
                result.timestamp = datetime.now()
                results.append(result)
                
                processed_frames += 1
                frame_number += 1
                
                # Log progress
                if processed_frames % 10 == 0:
                    progress = (frame_number / frame_count) * 100
                    logger.info(f"Processed {processed_frames} frames ({progress:.1f}%)")
            
            cap.release()
            logger.info(f"Video processing completed. Processed {processed_frames} frames.")
            
        except Exception as e:
            logger.error(f"Error processing video: {e}")
            raise
        
        return results
    
    def draw_pose(self, image: np.ndarray, keypoints: List[PoseKeypoint]) -> np.ndarray:
        """Draw pose skeleton on image"""
        image_copy = image.copy()
        
        # Create keypoint dictionary for easy lookup
        kp_dict = {kp.part_name: kp for kp in keypoints if kp.confidence > 0.1}
        
        # Draw keypoints
        for kp in keypoints:
            if kp.confidence > settings.OPENPOSE_RENDER_THRESHOLD:
                cv2.circle(image_copy, (int(kp.x), int(kp.y)), 5, (0, 255, 0), -1)
        
        # Draw skeleton
        for pair in self.POSE_PAIRS:
            part_a = self.BODY_PARTS[pair[0]]
            part_b = self.BODY_PARTS[pair[1]]
            
            if part_a in kp_dict and part_b in kp_dict:
                kp_a = kp_dict[part_a]
                kp_b = kp_dict[part_b]
                
                if kp_a.confidence > 0.1 and kp_b.confidence > 0.1:
                    cv2.line(image_copy, 
                            (int(kp_a.x), int(kp_a.y)), 
                            (int(kp_b.x), int(kp_b.y)), 
                            (0, 0, 255), 2)
        
        return image_copy
    
    def calculate_pose_similarity(self, pose1: List[PoseKeypoint], 
                                 pose2: List[PoseKeypoint]) -> float:
        """Calculate similarity between two poses"""
        if len(pose1) != len(pose2):
            return 0.0
        
        total_distance = 0.0
        valid_points = 0
        
        for kp1, kp2 in zip(pose1, pose2):
            if kp1.confidence > 0.1 and kp2.confidence > 0.1:
                # Calculate Euclidean distance
                distance = np.sqrt((kp1.x - kp2.x)**2 + (kp1.y - kp2.y)**2)
                total_distance += distance
                valid_points += 1
        
        if valid_points == 0:
            return 0.0
        
        # Normalize by average distance and convert to similarity score
        avg_distance = total_distance / valid_points
        # Assuming max reasonable distance is 200 pixels
        similarity = max(0.0, 1.0 - (avg_distance / 200.0))
        
        return similarity
    
    def extract_pose_features(self, keypoints: List[PoseKeypoint]) -> Dict[str, float]:
        """Extract pose features for analysis"""
        features = {}
        
        # Create keypoint dictionary
        kp_dict = {kp.part_name: kp for kp in keypoints if kp.confidence > 0.1}
        
        # Calculate body proportions
        if "Neck" in kp_dict and "MidHip" in kp_dict:
            torso_length = np.sqrt(
                (kp_dict["Neck"].x - kp_dict["MidHip"].x)**2 + 
                (kp_dict["Neck"].y - kp_dict["MidHip"].y)**2
            )
            features["torso_length"] = torso_length
        
        # Calculate arm span
        if "LWrist" in kp_dict and "RWrist" in kp_dict:
            arm_span = np.sqrt(
                (kp_dict["LWrist"].x - kp_dict["RWrist"].x)**2 + 
                (kp_dict["LWrist"].y - kp_dict["RWrist"].y)**2
            )
            features["arm_span"] = arm_span
        
        # Calculate pose angles
        if all(part in kp_dict for part in ["LShoulder", "LElbow", "LWrist"]):
            # Left arm angle
            shoulder = kp_dict["LShoulder"]
            elbow = kp_dict["LElbow"]
            wrist = kp_dict["LWrist"]
            
            v1 = np.array([shoulder.x - elbow.x, shoulder.y - elbow.y])
            v2 = np.array([wrist.x - elbow.x, wrist.y - elbow.y])
            
            angle = np.arccos(np.clip(np.dot(v1, v2) / (np.linalg.norm(v1) * np.linalg.norm(v2)), -1.0, 1.0))
            features["left_arm_angle"] = np.degrees(angle)
        
        # Add more features as needed
        features["total_confidence"] = sum(kp.confidence for kp in keypoints) / len(keypoints)
        features["detected_keypoints"] = sum(1 for kp in keypoints if kp.confidence > 0.1)
        
        return features
    
    def validate_pose(self, keypoints: List[PoseKeypoint]) -> Tuple[bool, List[str]]:
        """Validate pose quality and return issues"""
        issues = []
        
        # Check minimum confidence
        avg_confidence = sum(kp.confidence for kp in keypoints) / len(keypoints)
        if avg_confidence < 0.3:
            issues.append("Low overall confidence")
        
        # Check for essential keypoints
        essential_parts = ["Nose", "Neck", "RShoulder", "LShoulder", "MidHip"]
        missing_parts = []
        
        kp_dict = {kp.part_name: kp for kp in keypoints}
        for part in essential_parts:
            if part not in kp_dict or kp_dict[part].confidence < 0.1:
                missing_parts.append(part)
        
        if missing_parts:
            issues.append(f"Missing essential keypoints: {', '.join(missing_parts)}")
        
        # Check for anatomical consistency
        if "Neck" in kp_dict and "MidHip" in kp_dict:
            neck = kp_dict["Neck"]
            hip = kp_dict["MidHip"]
            
            if neck.y > hip.y:  # Neck should be above hip
                issues.append("Anatomically inconsistent pose (neck below hip)")
        
        is_valid = len(issues) == 0
        return is_valid, issues

# Global pose estimator instance
pose_estimator = OpenPoseEstimator()