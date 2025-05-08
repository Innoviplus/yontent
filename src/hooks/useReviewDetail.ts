
import { useAuth } from '@/contexts/AuthContext';
import { useFetchReview } from './review/useFetchReview';
import { useReviewLikes } from './review/useReviewLikes';
import { useRelatedReviews } from './review/useRelatedReviews';
import { useReviewNavigation } from './review/useReviewNavigation';
import { useEffect } from 'react';

export const useReviewDetail = (id: string | undefined) => {
  const { user } = useAuth();
  
  const { review, loading, setReview, refetchReview } = useFetchReview(id);
  const { hasLiked, likeLoading, likesCount, handleLike } = useReviewLikes(review, user?.id);
  const { relatedReviews } = useRelatedReviews(review);
  const { navigateToUserProfile } = useReviewNavigation(review);
  
  // Periodically refetch review data to ensure likes count is up-to-date
  useEffect(() => {
    if (!id) return;
    
    // Initial fetch happens in useFetchReview
    
    // Set up periodic refetching to ensure data is fresh
    const intervalId = setInterval(() => {
      console.log('Refreshing review data to ensure up-to-date likes count');
      refetchReview();
    }, 30000); // Refresh every 30 seconds
    
    return () => {
      clearInterval(intervalId);
    };
  }, [id, refetchReview]);
  
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
    refetchReview
  };
};
