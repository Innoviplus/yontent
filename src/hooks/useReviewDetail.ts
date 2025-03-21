
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useFetchReview } from './review/useFetchReview';
import { useReviewLikes } from './review/useReviewLikes';
import { useRelatedReviews } from './review/useRelatedReviews';

export const useReviewDetail = (id: string | undefined) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  const { review, loading, setReview } = useFetchReview(id);
  const { hasLiked, likeLoading, handleLike } = useReviewLikes(review, user?.id);
  const { relatedReviews } = useRelatedReviews(review);
  
  const navigateToUserProfile = () => {
    if (review?.user?.username) {
      navigate(`/user/${review.user.username}`);
    }
  };
  
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
