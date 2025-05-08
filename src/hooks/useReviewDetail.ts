
import { useAuth } from '@/contexts/AuthContext';
import { useFetchReview } from './review/useFetchReview';
import { useReviewLikes } from './review/useReviewLikes';
import { useRelatedReviews } from './review/useRelatedReviews';
import { useReviewNavigation } from './review/useReviewNavigation';
import { useEffect, useRef } from 'react';

export const useReviewDetail = (id: string | undefined) => {
  const { user } = useAuth();
  const initialLoadRef = useRef(false);
  
  const { review, loading, setReview, refetchReview } = useFetchReview(id);
  const { hasLiked, likeLoading, likesCount, handleLike } = useReviewLikes(review, user?.id);
  const { relatedReviews } = useRelatedReviews(review);
  const { navigateToUserProfile } = useReviewNavigation(review);
  
  // Only refresh data periodically to update likes count, but don't track view again
  useEffect(() => {
    if (!id || !review) return;
    
    // Skip the initial refresh since useFetchReview already fetched the data
    if (!initialLoadRef.current) {
      initialLoadRef.current = true;
      return;
    }
    
    // Set up periodic refetching to ensure data is fresh, but with a longer interval
    const intervalId = setInterval(() => {
      console.log('Refreshing review data to ensure up-to-date likes count');
      
      // Use a silent refetch method that doesn't track views
      const silentRefetch = async () => {
        try {
          const { data } = await fetch(`/api/reviews/${id}/silent-refresh`).then(res => res.json());
          if (data && setReview) {
            setReview(prev => prev ? { ...prev, likesCount: data.likes_count || 0 } : null);
          }
        } catch (error) {
          console.error('Silent refresh error:', error);
        }
      };
      
      // Try the silent method first, fallback to regular refresh if needed
      silentRefetch().catch(() => {
        // If silent refresh fails (since we don't have that endpoint), use normal refetch
        // but track that it was a refresh to avoid counting views
        refetchReview(true);
      });
    }, 60000); // Refresh every minute instead of every 30 seconds
    
    return () => {
      clearInterval(intervalId);
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
