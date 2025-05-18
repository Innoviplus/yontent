
import { useNavigate } from 'react-router-dom';
import { User, Camera, Eye, Play } from 'lucide-react';
import { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { memo, useState, useEffect } from 'react';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

// Memoize the card component to prevent unnecessary re-renders
const ReviewCard = memo(({ review, className }: ReviewCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasVideo = review.videos && review.videos.length > 0;
  const [imageLoaded, setImageLoaded] = useState(false);

  // Function to strip HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  
  // Generate consistent seed-based aspect ratio to improve masonry layout
  const getAspectRatio = () => {
    if (review.images.length === 0 && (!review.videos || review.videos.length === 0)) {
      return null; // No aspect ratio if no media
    }
    
    // Use review ID to generate a consistent pseudo-random aspect ratio
    const seed = review.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    const baseRatio = 0.75; // Default 4:3
    const variation = (seed % 50) / 100; // +/- 25% variation
    return baseRatio + variation - 0.25;
  };

  const aspectRatio = getAspectRatio();
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg overflow-hidden shadow-sm w-full card-hover h-full",
        "hover:shadow-md transition-all duration-200",
        className
      )}
    >
      {/* Review images/video with optimized loading */}
      {(review.images.length > 0 || hasVideo) && (
        <div 
          className="relative bg-gray-100 overflow-hidden"
          style={aspectRatio ? { paddingBottom: `${aspectRatio * 100}%` } : undefined}
        >
          {hasVideo ? (
            <>
              <img 
                src={review.videos[0] || review.images[0]} 
                alt="Video thumbnail" 
                className={cn(
                  "absolute top-0 left-0 w-full h-full object-cover",
                  !imageLoaded && "opacity-0"
                )}
                loading="lazy"
                onLoad={handleImageLoad}
              />
              {!imageLoaded && <div className="absolute inset-0 bg-gray-200 animate-pulse" />}
              <div className="absolute inset-0 flex items-center justify-center z-10">
                <div className="bg-black/50 rounded-full p-1.5 backdrop-blur-sm">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
            </>
          ) : (
            <>
              <img 
                src={review.images[0]} 
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
          
          {/* Image count badge */}
          {(review.images.length > 1 || (review.videos && review.videos.length > 0)) && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <Camera className="h-3 w-3" />
              <span>{review.images.length + (review.videos?.length || 0)}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-2">
        {/* User info at the top */}
        <div className="flex items-center mb-1.5">
          <Avatar className="h-5 w-5 mr-1.5">
            <AvatarImage src={review.user?.avatar || ''} alt={review.user?.username || 'User'} />
            <AvatarFallback>
              <User className="h-2.5 w-2.5" />
            </AvatarFallback>
          </Avatar>
          <span className="text-xs text-gray-500 truncate max-w-[100px]">
            {review.user?.username || 'Anonymous'}
          </span>
        </div>
        
        {/* Content - with HTML tags stripped */}
        <div className="text-gray-600 text-xs mb-1.5">
          <p className="line-clamp-2">
            {stripHtml(review.content)}
          </p>
        </div>
        
        {/* Stats: Views only */}
        <div className="flex items-center">
          <div className="flex items-center text-xs text-gray-500">
            <Eye className="h-3 w-3 mr-0.5" />
            <span>{review.viewsCount || 0}</span>
          </div>
        </div>
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;
