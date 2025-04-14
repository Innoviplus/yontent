
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { trackReviewView } from '@/services/review/trackViews';

interface ReviewsGridProps {
  reviews: Review[];
}

const ReviewsGrid = ({ reviews }: ReviewsGridProps) => {
  const handleReviewClick = (reviewId: string) => {
    trackReviewView(reviewId);
  };

  return (
    <div className="masonry-grid columns-2 sm:columns-2 md:columns-3 lg:columns-4 xl:columns-5 gap-3">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          onClick={() => handleReviewClick(review.id)} 
          className="mb-3 break-inside-avoid"
        >
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
};

export default ReviewsGrid;
