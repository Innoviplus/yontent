
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { trackReviewView } from '@/services/review/trackViews';
import { memo, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';

interface ReviewsGridProps {
  reviews: Review[];
}

// Memoize the component to prevent unnecessary re-renders
const ReviewsGrid = memo(({ reviews }: ReviewsGridProps) => {
  const navigate = useNavigate();
  const [loadedReviews, setLoadedReviews] = useState<Review[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    // Only set reviews when the data is available
    if (reviews.length > 0) {
      setLoadedReviews(reviews);
      setIsLoading(false);
    }
  }, [reviews]);

  const handleReviewClick = (reviewId: string) => {
    trackReviewView(reviewId);
    navigate(`/review/${reviewId}`);
  };

  if (isLoading && reviews.length === 0) {
    return (
      <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
        {Array(10).fill(0).map((_, index) => (
          <div key={index} className="mb-3 animate-pulse">
            <div className="bg-gray-200 h-40 rounded-lg mb-2"></div>
            <div className="bg-gray-200 h-4 rounded mb-2 w-3/4"></div>
            <div className="bg-gray-200 h-3 rounded w-1/2"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {loadedReviews.map((review) => (
        <div 
          key={review.id} 
          onClick={() => handleReviewClick(review.id)} 
          className="mb-3 cursor-pointer"
        >
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
});

ReviewsGrid.displayName = 'ReviewsGrid';

export default ReviewsGrid;
