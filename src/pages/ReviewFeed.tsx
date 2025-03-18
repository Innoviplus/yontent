
import { useEffect } from 'react';
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ReviewCard from '@/components/ReviewCard';
import FeedHeader from '@/components/review/FeedHeader';
import EmptyFeed from '@/components/review/EmptyFeed';
import { useAuth } from '@/contexts/AuthContext';
import { useReviews } from '@/hooks/useReviews';

const ReviewFeed = () => {
  const { user } = useAuth();
  const { reviews, loading, sortBy, setSortBy, setPage, hasMore } = useReviews();

  useEffect(() => {
    const handleScroll = () => {
      if (
        window.innerHeight + window.scrollY >= document.documentElement.scrollHeight - 1000 &&
        !loading &&
        hasMore
      ) {
        setPage(prev => prev + 1);
      }
    };

    window.addEventListener('scroll', handleScroll);
    return () => window.removeEventListener('scroll', handleScroll);
  }, [loading, hasMore, setPage]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <FeedHeader 
          sortBy={sortBy}
          onSortChange={setSortBy}
          isAuthenticated={!!user}
        />
        
        {loading && reviews.length === 0 ? (
          <div className="flex justify-center items-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
          </div>
        ) : reviews.length > 0 ? (
          <>
            <div className="grid gap-6 grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-5 masonry-grid">
              {reviews.map((review) => (
                <div key={review.id} className="mb-6">
                  <ReviewCard review={review} />
                </div>
              ))}
            </div>
            
            {loading && (
              <div className="flex justify-center items-center mt-8">
                <Loader2 className="h-6 w-6 animate-spin text-brand-teal" />
              </div>
            )}
          </>
        ) : (
          <EmptyFeed isAuthenticated={!!user} />
        )}
      </div>
    </div>
  );
};

export default ReviewFeed;
