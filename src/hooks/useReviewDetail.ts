
import { useAuth } from '@/contexts/AuthContext';
import { useFetchReview } from './review/useFetchReview';
import { useReviewLikes } from './review/useReviewLikes';
import { useRelatedReviews } from './review/useRelatedReviews';
import { useReviewNavigation } from './review/useReviewNavigation';

export const useReviewDetail = (id: string | undefined) => {
  const { user } = useAuth();
  
  const { review, loading, setReview } = useFetchReview(id);
  const { hasLiked, likeLoading, handleLike } = useReviewLikes(review, user?.id);
  const { relatedReviews } = useRelatedReviews(review);
  const { navigateToUserProfile } = useReviewNavigation(review);
  
  const handleLikeAction = () => {
    handleLike(setReview);
  };
  
  return {
    review,
    loading,
    likeLoading,
    hasLiked,
    handleLike: handleLikeAction,
    navigateToUserProfile,
    relatedReviews
  };
};
