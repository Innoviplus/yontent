
import { useState, useRef, useEffect } from 'react';
import VideoPlayButton from './VideoPlayButton';

interface VideoDisplayProps {
  videoUrl: string;
  isPlaying: boolean;
  isBuffering: boolean;
  isControlsVisible: boolean;
  videoRef: React.RefObject<HTMLVideoElement>;
  onClick: () => void;
}

const VideoDisplay = ({ 
  videoUrl, 
  isPlaying, 
  isBuffering,
  isControlsVisible,
  videoRef,
  onClick
}: VideoDisplayProps) => {
  return (
    <div className="flex-grow relative">
      <video
        ref={videoRef}
        src={videoUrl}
        className="w-full h-full object-contain bg-black"
        playsInline
        preload="metadata"
        onClick={onClick}
      />
      
      {/* Play/Pause center overlay */}
      {isControlsVisible && (
        <div className="absolute inset-0 flex items-center justify-center">
          <VideoPlayButton 
            isPlaying={isPlaying} 
            isBuffering={isBuffering} 
            onClick={onClick} 
            size="lg"
          />
        </div>
      )}
    </div>
  );
};

export default VideoDisplay;
