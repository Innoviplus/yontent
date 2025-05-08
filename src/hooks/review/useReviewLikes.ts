
import { Review } from '@/lib/types';
import { useLikeStatus } from './useLikeStatus';
import { useLikeHandler } from './useLikeHandler';

/**
 * Main hook that provides like functionality for reviews
 */
export const useReviewLikes = (review: Review | null, userId: string | undefined) => {
  // Get the current like status and count
  const {
    hasLiked,
    setHasLiked,
    likesCount,
    setLikesCount,
    isLoading: likeStatusLoading,
    setIsLoading
  } = useLikeStatus(review?.id, userId);
  
  // Get the like action handler
  const {
    isProcessing,
    handleLikeAction
  } = useLikeHandler(
    review?.id,
    userId,
    hasLiked,
    setHasLiked,
    setLikesCount,
    setIsLoading
  );
  
  // Combine loading states
  const likeLoading = likeStatusLoading || isProcessing;
  
  return {
    hasLiked,
    likeLoading,
    likesCount,
    handleLike: handleLikeAction
  };
};
