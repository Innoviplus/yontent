
import { useNavigate } from 'react-router-dom';
import { User, Camera, Eye, Heart, Play } from 'lucide-react';
import { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';
import { memo, useState, useEffect } from 'react';
import { useLikeAction } from '@/hooks/review/useLikeAction';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

// Memoize the card component to prevent unnecessary re-renders
const ReviewCard = memo(({ review, className }: ReviewCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const { user } = useAuth();
  const hasVideo = review.videos && review.videos.length > 0;
  const [imageLoaded, setImageLoaded] = useState(false);
  const [videoThumbnail, setVideoThumbnail] = useState<string | null>(null);
  
  // Use the useLikeAction hook
  const { isLiked, likesCount, handleLike, isLoading } = useLikeAction(review.id, review.likesCount);
  
  // Generate video thumbnail when component mounts
  useEffect(() => {
    if (hasVideo && review.videos && review.videos[0]) {
      // Create a video element to extract the thumbnail
      const videoEl = document.createElement('video');
      videoEl.crossOrigin = 'anonymous';
      videoEl.src = review.videos[0];
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
  }, [hasVideo, review.videos]);

  // Function to strip HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  
  // Generate dynamic aspect ratio based on various factors
  const getAspectRatio = () => {
    if (review.images.length === 0 && (!review.videos || review.videos.length === 0)) {
      return null; // No aspect ratio if no media
    }
    
    // Use review ID to generate a consistent aspect ratio per item
    const seed = review.id.split('').reduce((acc, char) => acc + char.charCodeAt(0), 0);
    
    // Create more variation in heights (from 1.2 to 2.0)
    // This will generate taller images like in the reference
    const baseRatio = 1.2;
    const variation = (seed % 100) / 125; // +/- 40% variation
    return baseRatio + variation;
  };

  const aspectRatio = getAspectRatio();
  
  const handleImageLoad = () => {
    setImageLoaded(true);
  };
  
  const handleCardClick = () => {
    navigate(`/review/${review.id}`);
  };
  
  const handleLikeClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    
    if (!user) {
      toast.error('You must be logged in to like reviews');
      return;
    }
    
    handleLike();
  };

  return (
    <div 
      className={cn(
        "bg-white rounded-lg overflow-hidden shadow-sm w-full card-hover h-full",
        "hover:shadow-md transition-all duration-200 cursor-pointer",
        className
      )}
      onClick={handleCardClick}
    >
      {/* Review images/video with optimized loading */}
      {(review.images.length > 0 || hasVideo) && (
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
        
        {/* Stats: Views and Likes */}
        <div className="flex items-center gap-3 justify-between">
          <div className="flex items-center text-xs text-gray-500">
            <Eye className="h-3 w-3 mr-0.5" />
            <span>{review.viewsCount || 0}</span>
          </div>
          
          {/* Like count with heart icon */}
          <div className="flex items-center text-xs">
            <button 
              className={cn(
                "flex items-center transition-colors",
                isLiked ? "text-red-500" : "text-gray-500 hover:text-red-500"
              )} 
              onClick={handleLikeClick}
              disabled={isLoading}
            >
              <Heart className={cn(
                "h-3 w-3 mr-0.5",
                isLiked ? "fill-red-500 text-red-500" : ""
              )} />
              <span>
                {likesCount || 0}
              </span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;
