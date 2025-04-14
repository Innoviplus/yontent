
import { Play } from 'lucide-react';
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { trackReviewView } from '@/services/review/trackViews';
import { useIsMobile } from '@/hooks/use-mobile';

interface ReviewsGridProps {
  reviews: Review[];
}

const ReviewsGrid = ({ reviews }: ReviewsGridProps) => {
  const isMobile = useIsMobile();
  
  const handleReviewClick = (reviewId: string) => {
    trackReviewView(reviewId);
  };

  return (
    <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 gap-2 sm:gap-4">
      {reviews.map((review) => (
        <div 
          key={review.id} 
          onClick={() => handleReviewClick(review.id)} 
          className="cursor-pointer"
        >
          <ReviewCard review={review} />
        </div>
      ))}
    </div>
  );
};

export default ReviewsGrid;
