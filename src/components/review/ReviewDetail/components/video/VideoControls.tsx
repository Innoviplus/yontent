
import { Volume2, VolumeX, Maximize } from 'lucide-react';
import VideoPlayButton from './VideoPlayButton';
import VideoTimeline from './VideoTimeline';

interface VideoControlsProps {
  isPlaying: boolean;
  isBuffering: boolean;
  isMuted: boolean;
  currentTime: number;
  duration: number;
  onPlayPause: () => void;
  onMuteToggle: () => void;
  onSeek: (time: number) => void;
  onFullscreen: () => void;
}

const VideoControls = ({
  isPlaying,
  isBuffering,
  isMuted,
  currentTime,
  duration,
  onPlayPause,
  onMuteToggle,
  onSeek,
  onFullscreen
}: VideoControlsProps) => {
  return (
    <div className="bg-black/70 p-3 transition-opacity">
      {/* Timeline slider */}
      <VideoTimeline 
        currentTime={currentTime} 
        duration={duration} 
        onSeek={onSeek} 
      />
      
      {/* Control buttons */}
      <div className="flex items-center justify-between">
        <VideoPlayButton 
          isPlaying={isPlaying} 
          isBuffering={isBuffering} 
          onClick={onPlayPause} 
          size="sm" 
        />
        
        <div className="flex items-center">
          <button 
            className="text-white p-1"
            onClick={onMuteToggle}
            type="button"
          >
            {isMuted ? (
              <VolumeX className="w-5 h-5" />
            ) : (
              <Volume2 className="w-5 h-5" />
            )}
          </button>
          
          <button 
            className="text-white p-1"
            onClick={onFullscreen}
            type="button"
          >
            <Maximize className="w-5 h-5" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoControls;
