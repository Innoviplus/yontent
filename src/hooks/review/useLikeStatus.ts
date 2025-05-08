
import { useState, useEffect } from 'react';
import { checkUserLikedReview, fetchReviewLikesCount } from '@/services/review/likeService';

/**
 * Hook to track whether a user has liked a review and the current likes count
 */
export const useLikeStatus = (reviewId: string | undefined, userId: string | undefined) => {
  const [hasLiked, setHasLiked] = useState(false);
  const [likesCount, setLikesCount] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  
  // Fetch initial like status and count
  useEffect(() => {
    const fetchLikeStatus = async () => {
      if (!reviewId || !userId) return;
      
      setIsLoading(true);
      try {
        // Check if user has liked the review
        const userHasLiked = await checkUserLikedReview(userId, reviewId);
        setHasLiked(userHasLiked);
        
        // Get current likes count
        const currentLikesCount = await fetchReviewLikesCount(reviewId);
        setLikesCount(currentLikesCount);
        
        console.log(`Initial like status: hasLiked=${userHasLiked}, count=${currentLikesCount}`);
      } catch (error) {
        console.error('Error fetching like status:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchLikeStatus();
  }, [reviewId, userId]);
  
  return {
    hasLiked,
    setHasLiked,
    likesCount,
    setLikesCount,
    isLoading,
    setIsLoading
  };
};
