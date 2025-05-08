
import { useAuth } from '@/contexts/AuthContext';
import { useFetchReview } from './review/useFetchReview';
import { useReviewLikes } from './review/useReviewLikes';
import { useReviewNavigation } from './review/useReviewNavigation';
import { useEffect, useRef } from 'react';

export const useReviewDetail = (id: string | undefined) => {
  const { user } = useAuth();
  const initialLoadRef = useRef(false);
  
  const { review, loading, setReview, refetchReview } = useFetchReview(id);
  const { hasLiked, likeLoading, likesCount, handleLike } = useReviewLikes(review, user?.id);
  const { navigateToUserProfile, relatedReviews } = useReviewNavigation(review);
  
  // Only refresh data periodically to update likes count, but don't track view again
  useEffect(() => {
    if (!id || !review) return;
    
    // Skip the initial refresh since useFetchReview already fetched the data
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      return;
    }
    
    // Disable periodic refreshes to prevent the like count from resetting
    // This prevents interference with the like count updates
    
    // This entire refresh logic is disabled to preserve like counts
    // Users can manually reload the page if they want fresh data
    
    return () => {
      // Nothing to clean up
    };
  }, [id, review, refetchReview]);
  
  const handleLikeAction = () => {
    handleLike(setReview);
  };
  
  return {
    review,
    loading,
    likeLoading,
    hasLiked,
    likesCount,
    handleLike: handleLikeAction,
    navigateToUserProfile,
    relatedReviews,
    refetchReview: (skipViewTracking = false) => refetchReview(skipViewTracking)
  };
};
