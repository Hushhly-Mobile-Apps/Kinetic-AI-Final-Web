export interface VideoCallProps {
  therapistName: string;
  therapistImage: string;
  onEndCall: () => void;
  isMinimized?: boolean;
  onToggleMinimize?: () => void;
  isAIAgent?: boolean;
  sessionId?: string;
}

export interface RTCConfiguration {
  iceServers: RTCIceServer[];
  iceCandidatePoolSize?: number;
}

export interface RTCIceServer {
  urls: string | string[];
  username?: string;
  credential?: string;
}

export interface VideoCallState {
  isMuted: boolean;
  isVideoOff: boolean;
  isScreenSharing: boolean;
  callDuration: number;
  isConnecting: boolean;
  aiResponse: string;
  isAiSpeaking: boolean;
  connectionStatus: string;
  noiseCancellation: boolean;
  beautyFilter: boolean;
  virtualBackground: boolean;
  isRecording: boolean;
  showSettings: boolean;
  audioLevel: number;
  videoQuality: string;
  networkQuality: number;
  participantCount: number;
  sessionRating: number;
  backendSessionId: string | null;
}

declare global {
  interface Window {
    process?: {
      env: {
        TURN_USERNAME?: string;
        TURN_PASSWORD?: string;
        NEXT_PUBLIC_API_URL?: string;
      };
    };
  }
}

export const TURN_USERNAME = process?.env?.TURN_USERNAME || '';
export const TURN_PASSWORD = process?.env?.TURN_PASSWORD || '';
