
import { Link } from 'react-router-dom';
import { Star } from 'lucide-react';
import { Review } from '@/lib/types';
import ReviewCard from '@/components/ReviewCard';
import { Button } from '@/components/ui/button';

interface ReviewsTabProps {
  reviews: Review[];
}

const ReviewsTab = ({ reviews }: ReviewsTabProps) => {
  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold">Your Reviews</h2>
        <Button asChild className="bg-brand-teal hover:bg-brand-teal/90 text-white py-1.5 px-4 text-sm">
          <Link to="/submit-review">
            Add Review
          </Link>
        </Button>
      </div>
      
      {reviews.length > 0 ? (
        <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          {reviews.map((review) => (
            <ReviewCard key={review.id} review={review} />
          ))}
        </div>
      ) : (
        <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
          <Star className="h-12 w-12 text-gray-300 mx-auto mb-3" />
          <h3 className="text-lg font-semibold text-gray-900 mb-2">No reviews yet</h3>
          <p className="text-gray-600 mb-6">
            You haven't submitted any product reviews yet. 
            Share your experiences to start earning points!
          </p>
          <Button asChild className="bg-brand-teal hover:bg-brand-teal/90 text-white">
            <Link to="/submit-review">
              Submit Your First Review
            </Link>
          </Button>
        </div>
      )}
    </>
  );
};

export default ReviewsTab;
