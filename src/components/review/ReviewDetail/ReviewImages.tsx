
import { useState, useRef, useEffect } from 'react';
import { ChevronLeft, ChevronRight, Play, Maximize, Volume2 } from 'lucide-react';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { cn } from '@/lib/utils';

interface ReviewImagesProps {
  images: string[];
  videos?: string[];
}

const ReviewImages = ({ images, videos = [] }: ReviewImagesProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  
  const hasMedia = images.length > 0 || videos.length > 0;
  const mediaCount = images.length + videos.length;
  
  // Reset video state when component unmounts or when showVideo changes
  useEffect(() => {
    return () => {
      if (videoRef.current) {
        videoRef.current.pause();
        setIsPlaying(false);
      }
    };
  }, [showVideo]);

  // If no images, display a placeholder
  if (!hasMedia) {
    return (
      <div className="h-[300px] md:h-[400px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
      </div>
    );
  }
  
  const navigateMedia = (direction: 'prev' | 'next') => {
    if (direction === 'prev') {
      if (showVideo) {
        // If showing video, go to last image
        setShowVideo(false);
        setCurrentImageIndex(images.length - 1);
      } else if (currentImageIndex > 0) {
        // Go to previous image
        setCurrentImageIndex(prev => prev - 1);
      } else if (videos.length > 0) {
        // If at first image and video exists, go to video
        setShowVideo(true);
      }
    } else {
      if (showVideo) {
        // If showing video, go to first image
        setShowVideo(false);
        setCurrentImageIndex(0);
      } else if (currentImageIndex < images.length - 1) {
        // Go to next image
        setCurrentImageIndex(prev => prev + 1);
      } else if (videos.length > 0) {
        // If at last image and video exists, go to video
        setShowVideo(true);
      }
    }
  };

  const togglePlayPause = () => {
    if (!videoRef.current) return;
    
    if (isPlaying) {
      videoRef.current.pause();
    } else {
      videoRef.current.play().catch(err => {
        console.error("Error playing video:", err);
      });
    }
    
    setIsPlaying(!isPlaying);
  };

  // Video player component with better controls
  const VideoPlayer = () => {
    if (!videos.length) return null;
    
    return (
      <div className="relative w-full h-full">
        <video 
          ref={videoRef}
          src={videos[0]} 
          className="w-full h-full object-contain"
          playsInline
          onClick={togglePlayPause}
          onPlay={() => setIsPlaying(true)}
          onPause={() => setIsPlaying(false)}
          onEnded={() => setIsPlaying(false)}
          controlsList="nodownload"
        />
        
        {/* Custom control overlay */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <div className="flex items-center justify-between">
            {/* Play/Pause button */}
            <button 
              onClick={togglePlayPause}
              className="text-white p-2 rounded-full hover:bg-white/20 transition-colors"
              aria-label={isPlaying ? "Pause" : "Play"}
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
                defaultValue="1"
                className="w-16 h-1 cursor-pointer"
                onChange={(e) => {
                  if (videoRef.current) {
                    videoRef.current.volume = parseFloat(e.target.value);
                  }
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
            >
              <Maximize className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>
    );
  };

  return (
    <div className="relative overflow-hidden">
      {/* Main Image or Video */}
      <div className="relative h-[300px] md:h-[400px] bg-gray-100">
        {showVideo && videos.length > 0 ? (
          <VideoPlayer />
        ) : (
          <img 
            src={images[currentImageIndex]} 
            alt={`Review image ${currentImageIndex + 1}`}
            className="w-full h-full object-contain"
          />
        )}
        
        {/* Navigation Arrows - Only show if there are multiple media items */}
        {mediaCount > 1 && (
          <div className="absolute top-0 left-0 right-0 bottom-0 flex items-center justify-between px-4">
            <button 
              onClick={() => navigateMedia('prev')} 
              className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button 
              onClick={() => navigateMedia('next')} 
              className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md z-10"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Media Counter */}
        {mediaCount > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs py-1 px-2 rounded-full z-10">
            {showVideo ? 'Video' : `${currentImageIndex + 1} / ${images.length}`}
          </div>
        )}
      </div>
      
      {/* Thumbnail Row */}
      {mediaCount > 1 && (
        <div className="flex overflow-x-auto gap-2 p-2 bg-gray-50 border-t border-gray-200">
          {/* Video Thumbnail */}
          {videos.length > 0 && (
            <button 
              onClick={() => {
                setShowVideo(true);
                if (videoRef.current) {
                  videoRef.current.currentTime = 0;
                  setIsPlaying(false);
                }
              }}
              className={cn(
                "relative flex-shrink-0 w-16 h-16 rounded overflow-hidden",
                showVideo ? "ring-2 ring-brand-teal" : ""
              )}
            >
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="h-8 w-8 text-white" />
              </div>
              <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                <span className="text-xs text-white bg-black/50 px-1 py-0.5 rounded">Video</span>
              </div>
            </button>
          )}
          
          {/* Image Thumbnails */}
          {images.map((image, index) => (
            <button
              key={index}
              onClick={() => {
                setShowVideo(false);
                setCurrentImageIndex(index);
              }}
              className={cn(
                "flex-shrink-0 w-16 h-16 rounded overflow-hidden",
                !showVideo && index === currentImageIndex ? "ring-2 ring-brand-teal" : ""
              )}
            >
              <img 
                src={image} 
                alt={`Thumbnail ${index + 1}`}
                className="w-full h-full object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
};

export default ReviewImages;
