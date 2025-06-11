"use client"

import React, { useRef, useEffect, useState } from 'react';
import * as tf from '@tensorflow/tfjs';
import * as poseDetection from '@tensorflow-models/pose-detection';
import '@tensorflow/tfjs-backend-webgl';
import { useAuthApi } from '@/hooks/use-auth-api';

type PoseEstimationProps = {
  onPoseDetected: (pose: any) => void;
  onAnalysisReceived?: (analysis: any) => void;
  sessionId?: string;
  width?: number;
  height?: number;
  enableBackendAnalysis?: boolean;
};

export const PoseEstimation: React.FC<PoseEstimationProps> = ({
  onPoseDetected,
  onAnalysisReceived,
  sessionId,
  width = 640,
  height = 480,
  enableBackendAnalysis = false,
}) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const animationRef = useRef<number>();
  const detectorRef = useRef<poseDetection.PoseDetector>();
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const { analyzePoseData } = useAuthApi();
  const lastAnalysisTime = useRef<number>(0);

  useEffect(() => {
    async function setupDetector() {
      await tf.ready();
      await tf.setBackend('webgl');
      
      const model = poseDetection.SupportedModels.MoveNet;
      const detector = await poseDetection.createDetector(model, {
        modelType: poseDetection.movenet.modelType.SINGLEPOSE_THUNDER,
      });
      
      detectorRef.current = detector;
      
      if (navigator.mediaDevices && navigator.mediaDevices.getUserMedia) {
        const stream = await navigator.mediaDevices.getUserMedia({
          video: true,
        });
        
        if (videoRef.current) {
          videoRef.current.srcObject = stream;
          videoRef.current.play();
          detectPose();
        }
      }
    }
    
    setupDetector();
    
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current);
      }
      
      if (detectorRef.current) {
        detectorRef.current.dispose();
      }
    };
  }, []);

  async function detectPose() {
    if (!videoRef.current || !detectorRef.current || !canvasRef.current) return;
    
    const poses = await detectorRef.current.estimatePoses(videoRef.current);
    
    if (poses.length > 0) {
      const pose = poses[0];
      onPoseDetected(pose);
      
      const ctx = canvasRef.current.getContext('2d');
      if (ctx) {
        ctx.clearRect(0, 0, width, height);
        drawPose(pose, ctx);
      }
      
      // Send pose data to backend for analysis (throttled to avoid overwhelming the server)
      if (enableBackendAnalysis && !isAnalyzing) {
        const now = Date.now();
        if (now - lastAnalysisTime.current > 2000) { // Analyze every 2 seconds
          lastAnalysisTime.current = now;
          analyzePoseInBackground(pose);
        }
      }
    }
    
    animationRef.current = requestAnimationFrame(detectPose);
  }
  
  async function analyzePoseInBackground(pose: any) {
    if (isAnalyzing) return;
    
    setIsAnalyzing(true);
    try {
      // Convert video frame to base64 for analysis
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      if (ctx && videoRef.current) {
        canvas.width = videoRef.current.videoWidth;
        canvas.height = videoRef.current.videoHeight;
        ctx.drawImage(videoRef.current, 0, 0);
        const videoFrame = canvas.toDataURL('image/jpeg', 0.8);
        
        const analysis = await analyzePoseData(pose, videoFrame, sessionId);
        if (onAnalysisReceived && analysis.success) {
          onAnalysisReceived(analysis);
        }
      }
    } catch (error) {
      console.error('Pose analysis failed:', error);
    } finally {
      setIsAnalyzing(false);
    }
  }

  function drawPose(pose: any, ctx: CanvasRenderingContext2D) {
    if (!pose.keypoints) return;
    
    pose.keypoints.forEach((keypoint: any) => {
      if (keypoint.score > 0.3) {
        ctx.beginPath();
        ctx.arc(keypoint.x, keypoint.y, 5, 0, 2 * Math.PI);
        ctx.fillStyle = 'red';
        ctx.fill();
      }
    });
  }

  return (
    <div className="relative w-full">
      <video
        ref={videoRef}
        width={width}
        height={height}
        className="hidden"
      />
      <canvas
        ref={canvasRef}
        width={width}
        height={height}
        className="bg-black rounded-lg shadow-lg w-full h-auto max-w-full max-h-[80vh] object-contain mx-auto"
      />
      {isAnalyzing && (
        <div className="absolute top-2 right-2 bg-blue-500 text-white px-2 py-1 rounded-md text-xs font-medium animate-pulse">
          Analyzing...
        </div>
      )}
    </div>
  );
};