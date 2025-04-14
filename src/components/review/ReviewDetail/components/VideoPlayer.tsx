
import { useVideoPlayer } from './video/useVideoPlayer';
import VideoDisplay from './video/VideoDisplay';
import VideoControls from './video/VideoControls';

interface VideoPlayerProps {
  videoUrl: string;
}

const VideoPlayer = ({ videoUrl }: VideoPlayerProps) => {
  const {
    videoRef,
    isPlaying,
    isMuted,
    currentTime,
    duration,
    isControlsVisible,
    isBuffering,
    showControls,
    togglePlayPause,
    toggleMute,
    handleSeek,
    enterFullscreen
  } = useVideoPlayer(videoUrl);

  return (
    <div 
      className="relative w-full h-full flex flex-col"
      onMouseMove={showControls}
      onTouchStart={showControls}
    >
      {/* Video display with centered play button */}
      <VideoDisplay 
        videoUrl={videoUrl}
        isPlaying={isPlaying}
        isBuffering={isBuffering}
        isControlsVisible={isControlsVisible}
        videoRef={videoRef}
        onClick={togglePlayPause}
      />
      
      {/* Video controls positioned BELOW the video */}
      {isControlsVisible && (
        <VideoControls 
          isPlaying={isPlaying}
          isBuffering={isBuffering}
          isMuted={isMuted}
          currentTime={currentTime}
          duration={duration}
          onPlayPause={togglePlayPause}
          onMuteToggle={toggleMute}
          onSeek={handleSeek}
          onFullscreen={enterFullscreen}
        />
      )}
    </div>
  );
};

export default VideoPlayer;
