
import { useNavigate } from 'react-router-dom';
import { Review } from '@/lib/types';
import { cn } from '@/lib/utils';
import { memo } from 'react';
import { useLikeAction } from '@/hooks/review/useLikeAction';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import ReviewCardMedia from './review/ReviewCardMedia';
import ReviewCardUserInfo from './review/ReviewCardUserInfo';
import ReviewCardContent from './review/ReviewCardContent';
import ReviewCardStats from './review/ReviewCardStats';
import useReviewCardAspectRatio from '@/hooks/review/useReviewCardAspectRatio';

interface ReviewCardProps {
  review: Review;
  className?: string;
}

// Memoize the card component to prevent unnecessary re-renders
const ReviewCard = memo(({ review, className }: ReviewCardProps) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const hasImages = review.images && review.images.length > 0;
  const hasVideos = review.videos && review.videos.length > 0;
  
  console.log(`ReviewCard: rendering review ${review.id} with likes count:`, review.likesCount);
  
  // Use the useLikeAction hook
  const { isLiked, likesCount, handleLike, isLoading } = useLikeAction(review.id, review.likesCount);
  
  // Get dynamic aspect ratio
  const aspectRatio = useReviewCardAspectRatio(
    review.id, 
    hasImages, 
    hasVideos
  );
  
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
      {/* Media content (images/videos) */}
      <ReviewCardMedia 
        images={review.images} 
        videos={review.videos} 
        aspectRatio={aspectRatio} 
      />
      
      <div className="p-2">
        {/* User info */}
        <ReviewCardUserInfo user={review.user} />
        
        {/* Content */}
        <ReviewCardContent content={review.content} />
        
        {/* Stats: Views and Likes */}
        <ReviewCardStats 
          viewsCount={review.viewsCount || 0}
          likesCount={likesCount || 0}
          isLiked={isLiked}
          isLoading={isLoading}
          onLikeClick={handleLikeClick}
          reviewId={review.id}
        />
      </div>
    </div>
  );
});

ReviewCard.displayName = 'ReviewCard';

export default ReviewCard;
