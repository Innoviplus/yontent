
import { useNavigate } from 'react-router-dom';
import { Review } from '@/lib/types';
import { useRelatedReviews } from './useRelatedReviews';

export const useReviewNavigation = (review: Review | null) => {
  const navigate = useNavigate();
  const { relatedReviews, loading } = useRelatedReviews(review);
  
  const navigateToUserProfile = () => {
    if (review?.user?.username) {
      navigate(`/user/${review.user.username}`);
    }
  };
  
  return {
    navigateToUserProfile,
    relatedReviews
  };
};
