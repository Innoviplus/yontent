
import { Button } from '@/components/ui/button';
import { Link } from 'react-router-dom';

interface EmptyReviewsProps {
  isLoggedIn: boolean;
}

const EmptyReviews = ({ isLoggedIn }: EmptyReviewsProps) => {
  return (
    <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
      <h3 className="text-xl font-semibold text-gray-900 mb-3">No reviews yet</h3>
      <p className="text-gray-600 mb-6">
        Be the first to share your product experience with the community!
      </p>
      {isLoggedIn ? (
        <Button asChild className="bg-brand-teal hover:bg-brand-teal/90 text-white">
          <Link to="/submit-review">
            Submit Your First Review
          </Link>
        </Button>
      ) : (
        <Button asChild className="bg-brand-teal hover:bg-brand-teal/90 text-white">
          <Link to="/login">
            Login to Submit Review
          </Link>
        </Button>
      )}
    </div>
  );
};

export default EmptyReviews;
