
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { likeReview, checkIfLiked } from '@/services/review';
import { clearReviewsCache } from '@/services/review';
import { toast } from 'sonner';

export const useLikeAction = (reviewId: string | undefined, initialLikesCount = 0) => {
  const { user } = useAuth();
  const [isLiked, setIsLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(initialLikesCount);
  const [isLoading, setIsLoading] = useState(false);
  
  console.log(`useLikeAction initialized for review ${reviewId} with initial count:`, initialLikesCount);
  
  // Check if the user has already liked this review
  useEffect(() => {
    if (!reviewId || !user) return;
    
    const checkLikeStatus = async () => {
      try {
        const liked = await checkIfLiked(reviewId, user.id);
        console.log(`User ${user.id} has liked review ${reviewId}:`, liked);
        setIsLiked(liked);
      } catch (error) {
        console.error('Error checking like status:', error);
      }
    };
    
    checkLikeStatus();
  }, [reviewId, user]);
  
  // Initialize likesCount from props when it changes
  useEffect(() => {
    if (initialLikesCount !== undefined) {
      console.log(`Updating likes count state from props:`, initialLikesCount);
      setLikesCount(initialLikesCount);
    }
  }, [initialLikesCount]);
  
  const handleLike = async () => {
    if (!reviewId || !user) {
      toast.error('You must be logged in to like reviews');
      return;
    }
    
    setIsLoading(true);
    
    try {
      // The likeReview function toggles the like status and returns the new state
      const newLikedState = await likeReview(reviewId, user.id);
      
      // Update the local like state
      setIsLiked(newLikedState);
      
      // Optimistically update the likes count
      setLikesCount(prevCount => {
        const newCount = newLikedState ? prevCount + 1 : Math.max(0, prevCount - 1);
        console.log(`Updated likes count from ${prevCount} to ${newCount} for review ${reviewId}`);
        return newCount;
      });
      
      // Clear the cache to ensure fresh data is fetched next time
      clearReviewsCache();
      
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
