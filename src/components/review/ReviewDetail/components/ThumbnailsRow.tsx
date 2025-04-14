
import React from 'react';
import { Play } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ThumbnailsRowProps {
  images: string[];
  videos: string[];
  videoThumbnail: string | null;
  currentImageIndex: number;
  showVideo: boolean;
  onVideoSelect: () => void;
  onImageSelect: (index: number) => void;
}

const ThumbnailsRow = ({
  images,
  videos,
  videoThumbnail,
  currentImageIndex,
  showVideo,
  onVideoSelect,
  onImageSelect
}: ThumbnailsRowProps) => {
  return (
    <div className="flex overflow-x-auto gap-2 p-2 bg-gray-50 border-t border-gray-200 no-scrollbar">
      {/* Video Thumbnail */}
      {videos.length > 0 && (
        <button 
          onClick={onVideoSelect}
          className={cn(
            "relative flex-shrink-0 w-14 h-14 rounded overflow-hidden",
            showVideo ? "ring-2 ring-brand-teal" : ""
          )}
          type="button"
          aria-label="Play video"
        >
          <div className="absolute inset-0 flex items-center justify-center z-10 bg-black/30">
            <Play className="h-5 w-5 text-white fill-white" />
          </div>
          {/* Video thumbnail preview */}
          <div className="w-full h-full bg-gray-200">
            {videoThumbnail ? (
              <img 
                src={videoThumbnail} 
                alt="Video thumbnail" 
                className="w-full h-full object-cover"
                loading="eager"
              />
            ) : (
              <video 
                src={videos[0]} 
                className="w-full h-full object-cover" 
                preload="metadata"
                muted
                playsInline
              />
            )}
          </div>
        </button>
      )}
      
      {/* Image Thumbnails */}
      {images.map((image, index) => (
        <button
          key={index}
          onClick={() => onImageSelect(index)}
          className={cn(
            "flex-shrink-0 w-14 h-14 rounded overflow-hidden",
            !showVideo && index === currentImageIndex ? "ring-2 ring-brand-teal" : ""
          )}
          type="button"
          aria-label={`Thumbnail ${index + 1}`}
        >
          <img 
            src={image} 
            alt={`Thumbnail ${index + 1}`}
            className="w-full h-full object-cover"
            loading={index < 3 ? "eager" : "lazy"}
          />
        </button>
      ))}
    </div>
  );
};

export default ThumbnailsRow;
