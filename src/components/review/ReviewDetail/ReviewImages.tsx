
import { useState, useEffect } from 'react';
import { cn } from '@/lib/utils';
import VideoPlayer from './components/VideoPlayer';
import ImageDisplay from './components/ImageDisplay';
import ThumbnailsRow from './components/ThumbnailsRow';

interface ReviewImagesProps {
  images: string[];
  videos?: string[];
}

const ReviewImages = ({ images, videos = [] }: ReviewImagesProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  const hasMedia = images.length > 0 || videos.length > 0;
  const mediaCount = images.length + videos.length;
  
  // Reset to first image when images array changes
  useEffect(() => {
    setCurrentImageIndex(0);
  }, [images]);

  // If no images, display a placeholder
  if (!hasMedia) {
    return (
      <div className="h-[300px] md:h-[400px] bg-gray-100 flex items-center justify-center">
        <p className="text-gray-400">No images available</p>
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
      {/* Main Image or Video */}
      <div className="relative h-[300px] md:h-[400px] bg-gray-100">
        {showVideo && videos.length > 0 ? (
          <VideoPlayer videoUrl={videos[0]} />
        ) : (
          <ImageDisplay 
            imageSrc={images[currentImageIndex]} 
            imageIndex={currentImageIndex}
            totalImages={images.length}
          />
        )}
        
        {/* Media Counter for Video */}
        {showVideo && mediaCount > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs py-1 px-2 rounded-full z-10">
            Video
          </div>
        )}
      </div>
      
      {/* Thumbnail Row */}
      {mediaCount > 1 && (
        <ThumbnailsRow
          images={images}
          videos={videos}
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
