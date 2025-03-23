
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { User, Camera, Eye, Heart } from 'lucide-react';
import { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { trackReviewView } from '@/services/reviewService';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

const ReviewCard = ({ review, className }: ReviewCardProps) => {
  const navigate = useNavigate();

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
        <div className="relative h-80 overflow-hidden bg-gray-100">
          <img 
            src={review.images[0]} 
            alt="Review image" 
            className="w-full h-full object-cover transition-opacity duration-300"
          />
          
          {/* Image count badge - only show if there are multiple images */}
          {review.images.length > 1 && (
            <div className="absolute top-2 right-2 bg-black/50 text-white text-xs px-2 py-1 rounded-full backdrop-blur-sm flex items-center gap-1">
              <Camera className="h-3 w-3" />
              <span>{review.images.length}</span>
            </div>
          )}
        </div>
      )}
      
      <div className="p-4">
        {/* Content - max 2 lines with truncation */}
        <div className="text-gray-600 text-sm mb-4">
          <p className="line-clamp-2">
            {review.content}
          </p>
        </div>
        
        {/* User Info and Stats */}
        <div className="space-y-2">
          {/* Author with Avatar */}
          <div className="flex items-center">
            <div onClick={handleUserClick} className="flex items-center cursor-pointer hover:underline">
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
          
          {/* Stats: Views and Likes */}
          <div className="flex items-center gap-3">
            <div className="flex items-center text-sm text-gray-500">
              <Eye className="h-4 w-4 mr-1" />
              <span>{review.viewsCount || 0}</span>
            </div>
            <div className="flex items-center text-sm text-gray-500">
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
