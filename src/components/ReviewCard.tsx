
import { useState } from 'react';
import { User, Calendar, ChevronDown, ChevronUp, Camera } from 'lucide-react';
import { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

const ReviewCard = ({ review, className }: ReviewCardProps) => {
  const [expanded, setExpanded] = useState(false);
  const [currentImageIndex, setCurrentImageIndex] = useState(0);

  const toggleExpand = () => setExpanded(!expanded);
  
  const nextImage = () => {
    setCurrentImageIndex((current) => 
      current === review.images.length - 1 ? 0 : current + 1
    );
  };
  
  const prevImage = () => {
    setCurrentImageIndex((current) => 
      current === 0 ? review.images.length - 1 : current - 1
    );
  };

  return (
    <div className={cn(
      "bg-white rounded-xl overflow-hidden shadow-card card-hover transition-all",
      className
    )}>
      {/* Review images */}
      {review.images.length > 0 && (
        <div className="relative h-48 overflow-hidden bg-gray-100">
          <img 
            src={review.images[currentImageIndex]} 
            alt={`Product: ${review.productName}`} 
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
        {/* Header */}
        <div className="mb-2">
          <h3 className="font-semibold text-lg text-brand-slate">{review.productName}</h3>
        </div>
        
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
        
        {/* Footer */}
        <div className="mt-4 pt-3 border-t border-gray-100 flex items-center justify-between">
          <div className="flex items-center text-sm text-gray-500">
            <User className="h-4 w-4 mr-1.5" />
            <span>{review.user?.username || 'Anonymous'}</span>
          </div>
          <div className="flex items-center text-sm text-gray-500">
            <Calendar className="h-4 w-4 mr-1.5" />
            <span>{format(review.createdAt, 'MMM d, yyyy')}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
