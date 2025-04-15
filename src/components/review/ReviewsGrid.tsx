
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { trackReviewView } from '@/services/review/trackViews';
import { memo } from 'react';

interface ReviewsGridProps {
  reviews: Review[];
}

// Memoize the component to prevent unnecessary re-renders
const ReviewsGrid = memo(({ reviews }: ReviewsGridProps) => {
  const handleReviewClick = (reviewId: string) => {
    trackReviewView(reviewId);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-3">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          onClick={() => handleReviewClick(review.id)} 
          className="mb-3"
        >
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
});

ReviewsGrid.displayName = 'ReviewsGrid';

export default ReviewsGrid;
