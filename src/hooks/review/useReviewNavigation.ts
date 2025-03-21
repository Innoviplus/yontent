
import { useNavigate } from 'react-router-dom';
import { Review } from '@/lib/types';

export const useReviewNavigation = (review: Review | null) => {
  const navigate = useNavigate();
  
  const navigateToUserProfile = () => {
    if (review?.user?.username) {
      navigate(`/user/${review.user.username}`);
    }
  };
  
  return {
    navigateToUserProfile
  };
};
