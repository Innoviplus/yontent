
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Eye, Heart } from 'lucide-react';
import { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { trackReviewView } from '@/services/review/trackViews';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

const ReviewCard = ({ review, className }: ReviewCardProps) => {
  const navigate = useNavigate();
  const isMobile = useIsMobile();

  const handleCardClick = () => {
    trackReviewView(review.id);
    navigate(`/review/${review.id}`);
  };
  
  const handleUserClick = (e: React.MouseEvent) => {
    e.stopPropagation();
    if (review.user?.username) {
      navigate(`/user/${review.user.username}`);
    }
  };

  // Function to strip HTML tags from content
  const stripHtml = (html: string) => {
    const doc = new DOMParser().parseFromString(html, 'text/html');
    return doc.body.textContent || '';
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
      {/* Review images - Show only first image */}
      {review.images.length > 0 && (
        <div className={`relative overflow-hidden bg-gray-100 ${isMobile ? 'h-60' : 'h-80'}`}>
          <img 
            src={review.images[0]} 
            alt="Review image" 
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          
          {/* Image count badge - only show if there are multiple images or videos */}
          {(review.images.length > 1 || (review.videos && review.videos.length > 0)) && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <Camera className="h-3 w-3" />
              <span>{review.images.length + (review.videos?.length || 0)}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-3">
        {/* Content - max 2 lines with truncation, with HTML tags stripped */}
        <div className="text-gray-600 text-sm mb-3">
          <p className={`line-clamp-${isMobile ? '2' : '3'}`}>
            {stripHtml(review.content)}
          </p>
        </div>
        
        {/* User Info and Stats */}
        <div className="flex items-center justify-between">
          {/* Author with Avatar */}
          <div onClick={handleUserClick} className="flex items-center cursor-pointer hover:underline">
            <Avatar className="h-6 w-6 mr-2">
              <AvatarImage src={review.user?.avatar || ''} alt={review.user?.username || 'User'} />
              <AvatarFallback>
                <User className="h-3 w-3" />
              </AvatarFallback>
            </Avatar>
            <span className="text-xs text-gray-500 truncate max-w-[100px]">
              {review.user?.username || 'Anonymous'}
            </span>
          </div>
          
          {/* Stats: Views and Likes */}
          <div className="flex items-center gap-3">
            <div className="flex items-center text-xs text-gray-500">
              <Eye className="h-4 w-4 mr-1" />
              <span>{review.viewsCount || 0}</span>
            </div>
            <div className="flex items-center text-xs text-gray-500">
              <Heart className="h-4 w-4 mr-1 text-red-500" />
              <span>{review.likesCount || 0}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ReviewCard;
