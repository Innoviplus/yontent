
import { useRef, useState, useEffect } from 'react';
import { Play, Pause, Maximize, Volume2, RotateCcw, RotateCw } from 'lucide-react';
import { Slider } from '@/components/ui/slider';
import { useIsMobile } from '@/hooks/use-mobile';

interface VideoPlayerProps {
  videoUrl: string;
  onPlay?: () => void;
  onPause?: () => void;
}

const VideoPlayer = ({ videoUrl, onPlay, onPause }: VideoPlayerProps) => {
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [currentTime, setCurrentTime] = useState(0);
  const [duration, setDuration] = useState(0);
  const [videoVolume, setVideoVolume] = useState(1);
  const [isSeeking, setIsSeeking] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const isMobile = useIsMobile();
  
  // Update video volume when videoVolume state changes
  useEffect(() => {
    if (videoRef.current) {
      videoRef.current.volume = videoVolume;
    }
  }, [videoVolume]);
  
  // Set up event listeners for video
  useEffect(() => {
    const video = videoRef.current;
    if (!video) return;
    
    const handleTimeUpdate = () => {
      if (!isSeeking && video.currentTime) {
        setCurrentTime(video.currentTime);
      }
    };
    
    const handleDurationChange = () => {
      setDuration(video.duration);
    };
    
    const handleLoadedData = () => {
      setLoaded(true);
      setDuration(video.duration);
    };
    
    const handleEnded = () => {
      setIsPlaying(false);
    };
    
    video.addEventListener('timeupdate', handleTimeUpdate);
    video.addEventListener('durationchange', handleDurationChange);
    video.addEventListener('loadeddata', handleLoadedData);
    video.addEventListener('ended', handleEnded);
    
    return () => {
      video.removeEventListener('timeupdate', handleTimeUpdate);
      video.removeEventListener('durationchange', handleDurationChange);
      video.removeEventListener('loadeddata', handleLoadedData);
      video.removeEventListener('ended', handleEnded);
    };
  }, [isSeeking]);
  
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
  
  const handleSeek = (value: number[]) => {
    if (!videoRef.current) return;
    
    const newTime = value[0];
    setCurrentTime(newTime);
    videoRef.current.currentTime = newTime;
  };
  
  const skip = (amount: number) => {
    if (!videoRef.current) return;
    
    const newTime = Math.max(0, Math.min(duration, currentTime + amount));
    videoRef.current.currentTime = newTime;
    setCurrentTime(newTime);
  };
  
  const formatTime = (timeInSeconds: number) => {
    const minutes = Math.floor(timeInSeconds / 60);
    const seconds = Math.floor(timeInSeconds % 60);
    return `${minutes}:${seconds < 10 ? '0' : ''}${seconds}`;
  };
  
  const handleFullScreen = () => {
    const videoContainer = videoRef.current?.parentElement;
    if (!videoContainer) return;
    
    if (document.fullscreenElement) {
      document.exitFullscreen().catch(err => {
        console.error("Error exiting fullscreen:", err);
      });
    } else {
      videoContainer.requestFullscreen().catch(err => {
        console.error("Error entering fullscreen:", err);
      });
    }
  };
  
  return (
    <div className="relative w-full h-full flex items-center justify-center">
      {/* Video element with poster */}
      <video 
        ref={videoRef}
        src={videoUrl} 
        className="w-full h-full object-contain"
        playsInline
        preload="metadata"
        poster={videoUrl + '#t=0.1'} // Use the video itself as a poster at 0.1 seconds
        onClick={togglePlayPause}
        onPlay={() => setIsPlaying(true)}
        onPause={() => setIsPlaying(false)}
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
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent py-2 px-4">
        {/* Timeline control */}
        <div className="w-full mb-2 flex items-center gap-2">
          <span className="text-white text-xs">{formatTime(currentTime)}</span>
          <Slider
            value={[currentTime]}
            min={0}
            max={duration || 100}
            step={0.1}
            onValueChange={handleSeek}
            onValueCommit={() => setIsSeeking(false)}
            className="flex-1"
          />
          <span className="text-white text-xs">{formatTime(duration)}</span>
        </div>
        
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            {/* Skip backward button */}
            <button 
              onClick={() => skip(-10)}
              className="text-white p-1.5 rounded-full hover:bg-white/20 transition-colors hidden md:block"
              aria-label="Skip backward 10 seconds"
              type="button"
            >
              <RotateCcw className="h-3.5 w-3.5" />
            </button>
            
            {/* Play/Pause button */}
            <button 
              onClick={togglePlayPause}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
              type="button"
            >
              {isPlaying ? (
                <Pause className="h-4 w-4" />
              ) : (
                <Play className="h-4 w-4 fill-white" />
              )}
            </button>
            
            {/* Skip forward button */}
            <button 
              onClick={() => skip(10)}
              className="text-white p-1.5 rounded-full hover:bg-white/20 transition-colors hidden md:block"
              aria-label="Skip forward 10 seconds"
              type="button"
            >
              <RotateCw className="h-3.5 w-3.5" />
            </button>
          </div>
          
          <div className="flex items-center gap-2">
            {/* Volume control */}
            <div className="hidden md:flex items-center gap-2">
              <Volume2 className="h-4 w-4 text-white" />
              <Slider 
                value={[videoVolume * 100]}
                min={0}
                max={100}
                step={5}
                className="w-24"
                onValueChange={(value) => {
                  const newVolume = value[0] / 100;
                  setVideoVolume(newVolume);
                }}
              />
            </div>
            
            {/* Fullscreen button */}
            <button 
              onClick={handleFullScreen}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label="Fullscreen"
              type="button"
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoPlayer;
