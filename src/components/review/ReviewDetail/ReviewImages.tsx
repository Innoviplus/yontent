
import { useState } from 'react';
import { ChevronLeft, ChevronRight, Play } from 'lucide-react';

interface ReviewImagesProps {
  images: string[];
  videos?: string[];
}

const ReviewImages = ({ images, videos = [] }: ReviewImagesProps) => {
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const [showVideo, setShowVideo] = useState(false);
  
  const hasMedia = images.length > 0 || videos.length > 0;
  const mediaCount = images.length + videos.length;
  
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

  return (
    <div className="relative overflow-hidden">
      {/* Main Image or Video */}
      <div className="relative h-[300px] md:h-[400px] bg-gray-100">
        {showVideo && videos.length > 0 ? (
          <video 
            src={videos[0]} 
            controls 
            className="w-full h-full object-contain"
          />
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
              className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              aria-label="Previous image"
            >
              <ChevronLeft className="h-5 w-5" />
            </button>
            
            <button 
              onClick={() => navigateMedia('next')} 
              className="bg-white/80 hover:bg-white rounded-full p-2 shadow-md"
              aria-label="Next image"
            >
              <ChevronRight className="h-5 w-5" />
            </button>
          </div>
        )}
        
        {/* Media Counter */}
        {mediaCount > 1 && (
          <div className="absolute bottom-4 right-4 bg-black/60 text-white text-xs py-1 px-2 rounded-full">
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
              }}
              className={`relative flex-shrink-0 w-16 h-16 rounded overflow-hidden ${showVideo ? 'ring-2 ring-brand-teal' : ''}`}
            >
              <video 
                src={videos[0]} 
                className="w-full h-full object-cover"
                muted 
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <Play className="h-8 w-8 text-white" />
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
              className={`flex-shrink-0 w-16 h-16 rounded overflow-hidden ${!showVideo && index === currentImageIndex ? 'ring-2 ring-brand-teal' : ''}`}
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
