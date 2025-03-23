
import { Button } from '@/components/ui/button';

interface ReviewsErrorProps {
  onRetry: () => void;
}

const ReviewsError = ({ onRetry }: ReviewsErrorProps) => {
  return (
    <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
      <h3 className="text-lg font-medium text-gray-900 mb-2">Error loading reviews</h3>
      <p className="text-gray-600 mb-6">
        We encountered a problem while loading the reviews. Please try again.
      </p>
      <Button onClick={onRetry} className="bg-brand-teal hover:bg-brand-teal/90">
        Retry
      </Button>
    </div>
  );
};

export default ReviewsError;
