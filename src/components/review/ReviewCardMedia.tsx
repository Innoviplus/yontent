
import { useState, useEffect } from 'react';
import { Camera, Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ReviewCardMediaProps {
  images: string[];
  videos?: string[];
  aspectRatio: number | null;
}

const ReviewCardMedia = ({ images, videos = [], aspectRatio }: ReviewCardMediaProps) => {
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const hasVideo = videos && videos.length > 0;
  
  // Generate video thumbnail when component mounts
  useEffect(() => {
    if (hasVideo && videos[0]) {
      // Create a video element to extract the thumbnail
      const videoEl = document.createElement('video');
      videoEl.crossOrigin = 'anonymous';
      videoEl.src = videos[0];
      videoEl.preload = 'metadata';
      
      videoEl.onloadedmetadata = () => {
        // Set to a slight offset from the beginning for better thumbnails
        videoEl.currentTime = 0.5;
        
        videoEl.onseeked = () => {
          try {
            // Create a canvas and draw the video frame
            const canvas = document.createElement('canvas');
            canvas.width = videoEl.videoWidth || 320;
            canvas.height = videoEl.videoHeight || 240;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
              const thumbnail = canvas.toDataURL('image/jpeg');
              setVideoThumbnail(thumbnail);
              setImageLoaded(true);
            }
          } catch (err) {
            console.error('Error generating video thumbnail:', err);
          }
        };
      };
      
      videoEl.onerror = (e) => {
        console.error('Error loading video for thumbnail generation:', e);
      };
    }
  }, [hasVideo, videos]);

  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  if (images.length === 0 && videos.length === 0) {
    return null;
  }

  return (
    <div 
      className="relative bg-gray-100 overflow-hidden"
      style={aspectRatio ? { paddingBottom: `${aspectRatio * 100}%` } : undefined}
    >
      {hasVideo ? (
        <>
          {videoThumbnail ? (
            <img 
              src={videoThumbnail} 
              alt="Video thumbnail" 
              className={cn(
                "absolute top-0 left-0 w-full h-full object-cover",
                !imageLoaded && "opacity-0"
              )}
              onLoad={handleImageLoad}
            />
          ) : (
            <div className="absolute inset-0 bg-gray-200" />
          )}
          
          <div className="absolute inset-0 flex items-center justify-center z-10">
            <div className="bg-black/50 rounded-full p-1.5 backdrop-blur-sm">
              <Play className="h-6 w-6 text-white" fill="white" />
            </div>
          </div>
        </>
      ) : (
        <>
          <img 
            src={images[0]} 
            alt="Review image" 
            className={cn(
              "absolute top-0 left-0 w-full h-full object-cover",
              !imageLoaded && "opacity-0"
            )}
            loading="lazy"
            onLoad={handleImageLoad}
          />
          {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
        </>
      )}
      
      {/* Image/video count badge */}
      {(images.length > 1 || (videos && videos.length > 0)) && (
        <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
          <Camera className="h-3 w-3" />
          <span>{images.length + (videos?.length || 0)}</span>
        </div>
      )}
    </div>
  );
};

export default ReviewCardMedia;
