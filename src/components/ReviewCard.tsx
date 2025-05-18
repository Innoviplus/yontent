
import { useNavigate } from 'react-router-dom';
import { User, Camera, Eye, Play } from 'lucide-react';
import { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

const ReviewCard = ({ review, className }: ReviewCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();
  const hasVideo = review.videos && review.videos.length > 0;

  const handleCardClick = () => {
    navigate(`/review/${review.id}`);
  };

  // Function to strip HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
  };
  
  // Calculate aspect ratio for images to maintain consistent width but variable height
  const getAspectRatio = () => {
    // Default to 1:1 if no images
    if (review.images.length === 0 && (!review.videos || review.videos.length === 0)) {
      return "100%"; // Square
    }
    
    // Random aspect ratios for visual variety in the masonry layout
    const options = ["56.25%", "75%", "100%", "125%"];
    const randomIndex = Math.floor(review.id.charCodeAt(0) % options.length);
    return options[randomIndex];
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "bg-white rounded-lg overflow-hidden shadow-sm w-full card-hover h-full",
        "hover:shadow-md transform hover:-translate-y-1 transition-all duration-200",
        className
      )}
    >
      {/* Review images - Show only first image or video thumbnail */}
      {(review.images.length > 0 || hasVideo) && (
        <div 
          className="relative overflow-hidden bg-gray-100"
          style={{ paddingBottom: getAspectRatio() }}
        >
          {hasVideo ? (
            <>
              <img 
                src={review.images[0] || review.videos[0]} 
                alt="Video thumbnail" 
                className="absolute top-0 left-0 w-full h-full object-cover"
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className="bg-black/50 rounded-full p-1.5 backdrop-blur-sm">
                  <Play className="h-6 w-6 text-white" fill="white" />
                </div>
              </div>
            </>
          ) : (
            <img 
              src={review.images[0]} 
              alt="Review image" 
              className="absolute top-0 left-0 w-full h-full object-cover"
            />
          )}
          
          {/* Image count badge - only show if there are multiple images or videos */}
          {(review.images.length > 1 || (review.videos && review.videos.length > 0)) && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <Camera className="h-3 w-3" />
              <span>{review.images.length + (review.videos?.length || 0)}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-2">
        {/* User info at the top - No longer clickable */}
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
        
        {/* Content - max 2 lines with truncation, with HTML tags stripped */}
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
};

export default ReviewCard;
