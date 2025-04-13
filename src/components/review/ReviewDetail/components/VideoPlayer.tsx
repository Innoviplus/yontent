
import { useRef, useState, useEffect } from 'react';
import { Play, Maximize, Volume2 } from 'lucide-react';

interface VideoPlayerProps {
  videoUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
}

const VideoPlayer = ({ videoUrl, onPlay, onPause }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [videoVolume, setVideoVolume] = useState(1);
  const [thumbnailLoaded, setThumbnailLoaded] = useState(false);
  
  // Update video volume when videoVolume state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = videoVolume;
    }
  }, [videoVolume]);
  
  // Load video metadata to get thumbnail
  useEffect(() => {
    if (videoRef.current) {
      const handleMetadataLoaded = () => {
        setThumbnailLoaded(true);
      };
      
      videoRef.current.addEventListener('loadedmetadata', handleMetadataLoaded);
      
      return () => {
        if (videoRef.current) {
          videoRef.current.removeEventListener('loadedmetadata', handleMetadataLoaded);
        }
      };
    }
  }, []);
  
  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
      if (onPause) onPause();
    } else {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
      if (onPlay) onPlay();
    }
    
    setIsPlaying(!isPlaying);
  };
  
  return (
    <div className="relative w-full h-full">
      <video 
        ref={videoRef}
        src={videoUrl} 
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
        poster={thumbnailLoaded ? undefined : undefined}
        onClick={togglePlayPause}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
        controlsList="nodownload"
      />
      
      {/* Play overlay for thumbnail */}
      {!isPlaying && (
        <div className="absolute inset-0 bg-black/20 flex items-center justify-center cursor-pointer"
             onClick={togglePlayPause}>
          <div className="bg-black/50 rounded-full p-4">
            <Play fill="white" className="h-8 w-8 text-white" />
          </div>
        </div>
      )}
      
      {/* Custom control overlay */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
        <div className="flex items-center justify-between">
          {/* Play/Pause button */}
          <button 
            onClick={togglePlayPause}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label={isPlaying ? "Pause" : "Play"}
            type="button"
          >
            {isPlaying ? (
              <div className="w-4 h-4 relative">
                <div className="absolute bg-white w-1 h-4 rounded-sm"></div>
                <div className="absolute bg-white w-1 h-4 rounded-sm ml-3"></div>
              </div>
            ) : (
              <Play className="h-4 w-4 fill-white" />
            )}
          </button>
          
          {/* Volume control */}
          <div className="hidden sm:flex items-center">
            <Volume2 className="h-4 w-4 text-white mr-2" />
            <input 
              type="range" 
              min="0" 
              max="1" 
              step="0.1" 
              value={videoVolume}
              className="w-16 h-1 cursor-pointer"
              onChange={(e) => {
                const newVolume = parseFloat(e.target.value);
                setVideoVolume(newVolume);
              }}
            />
          </div>
          
          {/* Fullscreen button */}
          <button 
            onClick={() => {
              if (videoRef.current) {
                videoRef.current.requestFullscreen();
              }
            }}
            className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
            aria-label="Fullscreen"
            type="button"
          >
            <Maximize className="h-4 w-4" />
          </button>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
