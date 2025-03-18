
import { Link } from 'react-router-dom';
import { Button } from '@/components/ui/button';

interface EmptyFeedProps {
  isAuthenticated: boolean;
}

const EmptyFeed = ({ isAuthenticated }: EmptyFeedProps) => {
  return (
    <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
      <h3 className="text-lg font-medium text-gray-900 mb-2">No reviews yet</h3>
      <p className="text-gray-600 mb-6">
        Be the first to share your product experience with the community!
      </p>
      {isAuthenticated ? (
        <Link to="/submit-review">
          <Button className="bg-brand-teal hover:bg-brand-teal/90">
            Submit Your First Review
          </Button>
        </Link>
      ) : (
        <Link to="/login">
          <Button className="bg-brand-teal hover:bg-brand-teal/90">
            Login to Submit Review
          </Button>
        </Link>
      )}
    </div>
  );
};

export default EmptyFeed;
