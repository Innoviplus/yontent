
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { likeReview, checkIfLiked } from '@/services/review';
import { toast } from 'sonner';

export const useLikeAction = (reviewId: string | undefined, initialLikesCount = 0) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  
  // Check if the user has already liked this review
  useEffect(() => {
    if (!reviewId || !user) return;
    
    const checkLikeStatus = async () => {
      const liked = await checkIfLiked(reviewId, user.id);
      setIsLiked(liked);
    };
    
    checkLikeStatus();
  }, [reviewId, user]);
  
  const handleLike = async () => {
    if (!reviewId || !user) {
      toast.error('You must be logged in to like reviews');
      return;
    }
    
    setIsLoading(true);
    
    try {
      const newLikedState = await likeReview(reviewId, user.id);
      setIsLiked(newLikedState);
      
      // Optimistically update the likes count
      setLikesCount(prevCount => newLikedState ? prevCount + 1 : Math.max(0, prevCount - 1));
    } catch (error) {
      console.error('Error handling like action:', error);
      toast.error('Failed to process like action');
    } finally {
      setIsLoading(false);
    }
  };
  
  return {
    isLiked,
    likesCount,
    handleLike,
    isLoading
  };
};
