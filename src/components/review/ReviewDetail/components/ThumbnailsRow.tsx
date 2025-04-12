
import React from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThumbnailsRowProps {
  images: string[];
  videos: string[];
  currentImageIndex: number;
  showVideo: boolean;
  onVideoSelect: () => void;
  onImageSelect: (index: number) => void;
}

const ThumbnailsRow = ({
  images,
  videos,
  currentImageIndex,
  showVideo,
  onVideoSelect,
  onImageSelect
}: ThumbnailsRowProps) => {
  return (
    <div className="flex overflow-x-auto gap-2 p-2 bg-gray-50 border-t border-gray-200">
      {/* Video Thumbnail */}
      {videos.length > 0 && (
        <button 
          onClick={onVideoSelect}
          className={cn(
            "relative flex-shrink-0 w-16 h-16 rounded overflow-hidden",
            showVideo ? "ring-2 ring-brand-teal" : ""
          )}
          type="button"
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
          onClick={() => onImageSelect(index)}
          className={cn(
            "flex-shrink-0 w-16 h-16 rounded overflow-hidden",
            !showVideo && index === currentImageIndex ? "ring-2 ring-brand-teal" : ""
          )}
          type="button"
        >
          <img 
            src={image} 
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
          />
        </button>
      ))}
    </div>
  );
};

export default ThumbnailsRow;
