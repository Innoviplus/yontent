
import { Link } from 'react-router-dom';
import { ChevronRight } from 'lucide-react';
import ReviewCard from '@/components/ReviewCard';
import { Review } from '@/lib/types';

interface FeaturedReviewsSectionProps {
  reviews: Review[];
  loading: boolean;
}

const FeaturedReviewsSection = ({ reviews, loading }: FeaturedReviewsSectionProps) => {
  return (
    <section className="py-16 md:py-24 bg-gray-50">
      <div className="container mx-auto px-4 sm:px-6">
        <div className="flex justify-between items-center mb-10">
          <div>
            <div className="chip chip-secondary mb-2">Featured</div>
            <h2 className="heading-2">Recent Reviews</h2>
          </div>
          <Link to="/reviews" className="flex items-center text-brand-slate hover:text-brand-lightSlate transition-colors">
            <span className="font-medium">View all</span>
            <ChevronRight className="h-5 w-5 ml-1" />
          </Link>
        </div>
        
        {loading ? (
          <div className="flex justify-center items-center py-12">
            <div className="animate-spin rounded-full h-12 w-12 border-t-2 border-b-2 border-brand-teal"></div>
          </div>
        ) : (
          <div className="flex overflow-x-auto pb-4 space-x-6">
            {reviews.slice(0, 5).map((review) => (
              <div key={review.id} className="min-w-[280px] w-[280px] flex-shrink-0">
                <ReviewCard review={review} />
              </div>
            ))}
            {reviews.length === 0 && (
              <div className="w-full py-8 text-center text-gray-500">
                No reviews available yet. Be the first to share your experience!
              </div>
            )}
          </div>
        )}
      </div>
    </section>
  );
};

export default FeaturedReviewsSection;
