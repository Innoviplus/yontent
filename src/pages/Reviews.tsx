
import { Loader2 } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useReviewsList, SortOption } from '@/hooks/review/useReviewsList';
import ReviewSorter from '@/components/review/ReviewSorter';
import EmptyReviews from '@/components/review/EmptyReviews';
import ReviewsError from '@/components/review/ReviewsError';
import ReviewsGrid from '@/components/review/ReviewsGrid';
import ReviewsPagination from '@/components/review/ReviewsPagination';

const Reviews = () => {
  const { user } = useAuth();
  const { 
    reviews, 
    isLoading, 
    error, 
    refetch, 
    sortBy, 
    setSortBy, 
    page, 
    setPage, 
    totalPages 
  } = useReviewsList(user?.id);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setPage(1);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-28 pb-16">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
          <h1 className="text-2xl font-bold">Reviews</h1>
          <ReviewSorter sortBy={sortBy} onSortChange={handleSortChange} />
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center my-12">
            <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
          </div>
        ) : error ? (
          <ReviewsError onRetry={refetch} />
        ) : reviews.length > 0 ? (
          <>
            <ReviewsGrid reviews={reviews} />
            <ReviewsPagination 
              currentPage={page} 
              totalPages={totalPages} 
              onPageChange={setPage} 
            />
          </>
        ) : (
          <EmptyReviews isLoggedIn={!!user} />
        )}
      </div>
    </div>
  );
};

export default Reviews;
