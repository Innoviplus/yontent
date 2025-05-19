
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import VideoPlayer from './components/VideoPlayer';
import ImageDisplay from './components/ImageDisplay';
import ThumbnailsRow from './components/ThumbnailsRow';
import { AspectRatio } from '@/components/ui/aspect-ratio';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReviewImagesProps {
  images: string[];
  videos?: string[];
}

const ReviewImages = ({ images = [], videos = [] }: ReviewImagesProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  const isMobile = useIsMobile();
  
  const hasMedia = images.length > 0 || videos.length > 0;
  const mediaCount = images.length + videos.length;
  
  // Log for debugging
  console.log('ReviewImages - videos:', videos);
  console.log('ReviewImages - images:', images);
  
  // Reset to first image when images array changes
  useEffect(() => {
    setCurrentImageIndex(0);
    setShowVideo(videos.length > 0);
  }, [images, videos]);
  
  // Generate a thumbnail for the video if it exists
  useEffect(() => {
    if (videos && videos.length > 0 && videos[0]) {
      console.log('Creating video thumbnail for:', videos[0]);
      const videoEl = document.createElement('video');
      videoEl.crossOrigin = 'anonymous';
      videoEl.src = videos[0];
      videoEl.preload = 'metadata';
      
      // When the video metadata is loaded, seek to a frame and create a thumbnail
      videoEl.onloadedmetadata = () => {
        // Set to a slight offset from the beginning for better thumbnails
        videoEl.currentTime = 0.5;
        
        videoEl.onseeked = () => {
          try {
            // Create a canvas and draw the video frame
            const canvas = document.createElement('canvas');
            canvas.width = videoEl.videoWidth;
            canvas.height = videoEl.videoHeight;
            const ctx = canvas.getContext('2d');
            
            if (ctx) {
              ctx.drawImage(videoEl, 0, 0, canvas.width, canvas.height);
              const thumbnail = canvas.toDataURL('image/jpeg');
              console.log('Video thumbnail created successfully');
              setVideoThumbnail(thumbnail);
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
  }, [videos]);

  // If no images or videos, display a placeholder
  if (!hasMedia) {
    return (
      <div className="h-[400px] md:h-[500px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No images or videos available</p>
      </div>
    );
  }
  
  const handleImageSelect = (index: number) => {
    setShowVideo(false);
    setCurrentImageIndex(index);
  };
  
  const handleVideoSelect = () => {
    setShowVideo(true);
  };

  return (
    <div className="relative overflow-hidden">
      {/* Main Image or Video - with increased height */}
      <AspectRatio ratio={isMobile ? 4/5 : 16/9} className="bg-gray-100">
        {showVideo && videos.length > 0 && videos[0] ? (
          <VideoPlayer videoUrl={videos[0]} />
        ) : (
          <ImageDisplay 
            imageSrc={images[currentImageIndex]} 
            imageIndex={currentImageIndex}
            totalImages={images.length}
          />
        )}
      </AspectRatio>
      
      {/* Thumbnail Row */}
      {mediaCount > 1 && (
        <ThumbnailsRow
          images={images}
          videos={videos}
          videoThumbnail={videoThumbnail}
          currentImageIndex={currentImageIndex}
          showVideo={showVideo}
          onVideoSelect={handleVideoSelect}
          onImageSelect={handleImageSelect}
        />
      )}
    </div>
  );
};

export default ReviewImages;
