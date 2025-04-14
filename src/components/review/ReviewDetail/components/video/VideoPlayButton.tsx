
import { Play, Pause } from 'lucide-react';

interface VideoPlayButtonProps {
  isPlaying: boolean;
  isBuffering: boolean;
  onClick: () => void;
  size?: 'sm' | 'lg';
}

const VideoPlayButton = ({ 
  isPlaying, 
  isBuffering, 
  onClick,
  size = 'lg'
}: VideoPlayButtonProps) => {
  const iconSize = size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  const spinnerSize = size === 'lg' ? 'w-8 h-8' : 'w-6 h-6';
  
  return (
    <button 
      className={size === 'lg' ? "bg-black/30 rounded-full p-3 backdrop-blur-sm" : "text-white p-1"}
      onClick={onClick}
      type="button"
    >
      {isBuffering ? (
        <div className={`${spinnerSize} border-2 border-white border-t-transparent rounded-full animate-spin`} />
      ) : isPlaying ? (
        <Pause className={`${iconSize} text-white`} />
      ) : (
        <Play className={`${iconSize} text-white`} />
      )}
    </button>
  );
};

export default VideoPlayButton;
