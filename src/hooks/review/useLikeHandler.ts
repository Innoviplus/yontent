
import { useState } from 'react';
import { toast } from 'sonner';
import { likeReview, unlikeReview } from '@/services/review/likeService';
import { Review } from '@/lib/types';

type SetReviewFunction = React.Dispatch<React.SetStateAction<Review | null>>;

/**
 * Hook for handling like/unlike interactions
 */
export const useLikeHandler = (
  reviewId: string | undefined,
  userId: string | undefined,
  hasLiked: boolean,
  setHasLiked: (value: boolean) => void,
  setLikesCount: (value: number) => void,
  setIsLoading: (value: boolean) => void
) => {
  const [isProcessing, setIsProcessing] = useState(false);
  
  const handleLikeAction = async (setReview?: SetReviewFunction) => {
    if (!userId || !reviewId) {
      if (!userId) toast.error('Please login to like reviews');
      return;
    }
    
    // Prevent multiple clicks
    if (isProcessing) return;
    
    setIsProcessing(true);
    setIsLoading(true);
    
    try {
      console.log(`Processing ${hasLiked ? 'unlike' : 'like'} action for review: ${reviewId}`);
      
      let newLikesCount: number;
      
      if (hasLiked) {
        // Unlike the review
        console.log('Removing like...');
        newLikesCount = await unlikeReview(userId, reviewId);
        setHasLiked(false);
        toast.success('Review unliked');
      } else {
        // Like the review
        console.log('Adding like...');
        newLikesCount = await likeReview(userId, reviewId);
        setHasLiked(true);
        toast.success('Review liked!');
      }
      
      // Update the likes count in our local state
      setLikesCount(newLikesCount);
      console.log('Updated likes count to:', newLikesCount);
      
      // If a setReview function is provided, update the review object
      if (setReview) {
        setReview(prev => {
          if (!prev) return null;
          return {
            ...prev,
            likesCount: newLikesCount
          };
        });
      }
    } catch (error) {
      console.error('Error processing like action:', error);
      toast.error('Failed to update like status');
    } finally {
      setIsProcessing(false);
      setIsLoading(false);
    }
  };
  
  return {
    isProcessing,
    handleLikeAction
  };
};
