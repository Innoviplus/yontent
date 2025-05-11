
import { useAuth } from '@/contexts/AuthContext';
import { useFetchReview } from './review/useFetchReview';
import { useReviewNavigation } from './review/useReviewNavigation';
import { useEffect, useRef } from 'react';
import { syncLikesCount } from '@/lib/api';

export const useReviewDetail = (id: string | undefined) => {
  const { user } = useAuth();
  const initialLoadRef = useRef(false);
  
  const { review, loading, setReview, refetchReview } = useFetchReview(id);
  const { navigateToUserProfile, relatedReviews } = useReviewNavigation(review);
  
  // Sync likes count when the component mounts
  useEffect(() => {
    if (id && !initialLoadRef.current) {
      initialLoadRef.current = true;
      
      // Sync likes count for this review
      syncLikesCount(id).catch(err => console.error('Error syncing likes count:', err));
    }
  }, [id]);
  
  return {
    review,
    loading,
    navigateToUserProfile,
    relatedReviews,
    refetchReview: (skipViewTracking = false) => refetchReview(skipViewTracking)
  };
};
