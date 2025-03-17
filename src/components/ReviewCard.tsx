
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, ChevronDown, ChevronUp, Camera, Eye, Heart } from 'lucide-react';
import { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { trackReviewView } from '@/services/reviewService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

const ReviewCard = ({ review, className }: ReviewCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);
  const navigate = useNavigate();

  const toggleExpand = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when expanding content
    setExpanded(!expanded);
  };
  
  const nextImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when changing image
    setCurrentImageIndex((current) => 
      current === review.images.length - 1 ? 0 : current + 1
    );
  };
  
  const prevImage = (e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent card click when changing image
    setCurrentImageIndex((current) => 
      current === 0 ? review.images.length - 1 : current - 1
    );
  };

  const handleCardClick = () => {
    // Track the view
    trackReviewView(review.id);
    // Navigate to the detail page
    navigate(`/reviews/${review.id}`);
  };

  return (
    <div 
      onClick={handleCardClick}
      className={cn(
        "bg-white rounded-xl overflow-hidden shadow-card card-hover transition-all cursor-pointer",
        "hover:shadow-lg transform hover:-translate-y-1 transition-all duration-200",
        className
      )}
    >
      {/* Review images - More vertical rectangle format */}
      {review.images.length > 0 && (
        <div className="relative h-80 overflow-hidden bg-gray-100">
          <img 
            src={review.images[currentImageIndex]} 
            alt={`Review image ${currentImageIndex + 1}`} 
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          
          {/* Image nav buttons (only if more than 1 image) */}
          {review.images.length > 1 && (
            <>
              <button 
                onClick={prevImage}
                className="absolute left-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1.5 backdrop-blur-sm transition-colors"
              >
                <ChevronDown className="h-4 w-4 rotate-90" />
              </button>
              <button 
                onClick={nextImage}
                className="absolute right-2 top-1/2 -translate-y-1/2 bg-white/70 hover:bg-white/90 rounded-full p-1.5 backdrop-blur-sm transition-colors"
              >
                <ChevronDown className="h-4 w-4 -rotate-90" />
              </button>
              
              {/* Image indicator */}
              <div className="absolute bottom-2 left-1/2 -translate-x-1/2 bg-black/50 text-white text-xs px-2 py-0.5 rounded-full backdrop-blur-sm">
                {currentImageIndex + 1} / {review.images.length}
              </div>
            </>
          )}
          
          {/* Image count badge */}
          <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
            <Camera className="h-3 w-3" />
            <span>{review.images.length}</span>
          </div>
        </div>
      )}
      
      <div className="p-4">
        {/* Content */}
        <div className={cn(
          "text-gray-600 text-sm overflow-hidden transition-all duration-300",
          !expanded && !review.images.length ? "max-h-20" : ""
        )}>
          <p className={!expanded && review.content.length > 150 ? "line-clamp-3" : ""}>
            {review.content}
          </p>
        </div>
        
        {/* Expand button (only for long content) */}
        {review.content.length > 150 && (
          <button 
            onClick={toggleExpand}
            className="text-brand-teal hover:text-brand-teal/80 text-sm font-medium flex items-center mt-2 transition-colors"
          >
            {expanded ? (
              <>
                <span>Show less</span>
                <ChevronUp className="h-4 w-4 ml-1" />
              </>
            ) : (
              <>
                <span>Read more</span>
                <ChevronDown className="h-4 w-4 ml-1" />
              </>
            )}
          </button>
        )}
        
        {/* Stats and Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 space-y-3">
          {/* Stats: Views and Likes (with Heart icon) */}
          <div className="flex items-center gap-4">
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="h-4 w-4 mr-1.5" />
              <span>{review.viewsCount || 0}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
              <Heart className="h-4 w-4 mr-1.5 text-red-500" />
              <span>{review.likesCount || 0}</span>
            </div>
          </div>
          
          {/* Author with Avatar (no date) */}
          <div className="flex items-center">
            {review.user?.avatar ? (
              <Avatar className="h-6 w-6 mr-2">
                <AvatarImage src={review.user.avatar} alt={review.user?.username || 'User'} />
                <AvatarFallback>
                  <User className="h-3 w-3" />
                </AvatarFallback>
              </Avatar>
            ) : (
              <div className="h-6 w-6 rounded-full bg-gray-200 flex items-center justify-center mr-2">
                <User className="h-3 w-3" />
              </div>
            )}
            <span className="text-sm text-gray-500">{review.user?.username || 'Anonymous'}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
