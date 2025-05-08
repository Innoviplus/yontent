
import { useAuth } from '@/contexts/AuthContext';
import { useFetchReview } from './review/useFetchReview';
import { useReviewNavigation } from './review/useReviewNavigation';
import { useEffect, useRef } from 'react';

export const useReviewDetail = (id: string | undefined) => {
  const { user } = useAuth();
  const initialLoadRef = useRef(false);
  
  const { review, loading, setReview, refetchReview } = useFetchReview(id);
  const { navigateToUserProfile, relatedReviews } = useReviewNavigation(review);
  
  // Only refresh data periodically to update data, but don't track view again
  useEffect(() => {
    if (!id || !review) return;
    
    // Skip the initial refresh since useFetchReview already fetched the data
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      return;
    }
    
    // Disable periodic refreshes
    
    return () => {
      // Nothing to clean up
    };
  }, [id, review, refetchReview]);
  
  return {
    review,
    loading,
    navigateToUserProfile,
    relatedReviews,
    refetchReview: (skipViewTracking = false) => refetchReview(skipViewTracking)
  };
};
