
import { useState } from 'react';

interface VideoTimelineProps {
  currentTime: number;
  duration: number;
  onSeek: (time: number) => void;
}

const VideoTimeline = ({ currentTime, duration, onSeek }: VideoTimelineProps) => {
  // Format time in MM:SS
  const formatTime = (time: number) => {
    const minutes = Math.floor(time / 60);
    const seconds = Math.floor(time % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleSeek = (e: React.ChangeEvent<HTMLInputElement>) => {
    const newTime = parseFloat(e.target.value);
    onSeek(newTime);
  };

  return (
    <div className="flex items-center w-full mb-2">
      <span className="text-white text-xs mr-2">{formatTime(currentTime)}</span>
      <input
        type="range"
        className="w-full h-1 rounded-full bg-gray-200 appearance-none cursor-pointer accent-white"
        min="0"
        max={duration || 100}
        step="0.1"
        value={currentTime}
        onChange={handleSeek}
      />
      <span className="text-white text-xs ml-2">{formatTime(duration)}</span>
    </div>
  );
};

export default VideoTimeline;
