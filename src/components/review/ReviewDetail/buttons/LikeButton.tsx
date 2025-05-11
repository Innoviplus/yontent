
import { Heart } from 'lucide-react';
import { useLikeReview } from '@/hooks/review/useLikeReview';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { cn } from '@/lib/utils';

interface LikeButtonProps {
  reviewId: string;
  initialLikesCount: number;
}

const LikeButton = ({ reviewId, initialLikesCount }: LikeButtonProps) => {
  const { user } = useAuth();
  const { 
    isLiking, 
    likesCount, 
    userHasLiked, 
    toggleLike, 
    checkUserLike,
    syncLikesCount,
    setLikesCount
  } = useLikeReview(reviewId, initialLikesCount);

  useEffect(() => {
    // Initialize likes count from props
    setLikesCount(initialLikesCount);
    
    // Check if user has liked this review
    if (user?.id) {
      checkUserLike();
    }
    
    // Sync the likes count from the database on initial load
    syncLikesCount();
    
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [user?.id, reviewId, initialLikesCount, checkUserLike, setLikesCount]);

  const handleLikeClick = async () => {
    if (!user) {
      // If user is not logged in, inform them they need to log in
      return;
    }
    
    await toggleLike();
  };

  return (
    <button
      type="button"
      onClick={handleLikeClick}
      disabled={isLiking}
      className={cn(
        "flex items-center space-x-1 text-sm text-gray-600 hover:text-red-500 transition-colors",
        userHasLiked && "text-red-500",
        isLiking && "opacity-70 cursor-not-allowed"
      )}
      aria-label={userHasLiked ? "Unlike this review" : "Like this review"}
    >
      <Heart 
        size={18} 
        className={cn(
          "transition-all", 
          userHasLiked && "fill-red-500 text-red-500",
          isLiking && "animate-pulse"
        )}
      />
      <span>{likesCount}</span>
    </button>
  );
};

export default LikeButton;
