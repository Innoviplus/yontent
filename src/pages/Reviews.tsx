
import { Suspense, lazy, useEffect } from 'react';
import { Loader2, Filter, Star } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { useReviewsList, SortOption } from '@/hooks/review/useReviewsList';
import { usePageTitle } from '@/hooks/usePageTitle';
import Navbar from '@/components/Navbar';
import ReviewSorter from '@/components/review/ReviewSorter';
import EmptyReviews from '@/components/review/EmptyReviews';
import ReviewsError from '@/components/review/ReviewsError';
import ReviewsGrid from '@/components/review/ReviewsGrid';
import ReviewsPagination from '@/components/review/ReviewsPagination';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';
import { syncAllLikesCounts } from '@/lib/api';

const Reviews = () => {
  usePageTitle('Reviews');
  
  const { user } = useAuth();
  const isMobile = useIsMobile();
  const { 
    reviews, 
    allReviewsCount,
    isLoading, 
    error, 
    refetch, 
    sortBy, 
    setSortBy, 
    page, 
    setPage, 
    totalPages 
  } = useReviewsList(user?.id);

  // On initial load, sync all likes counts and refresh data
  useEffect(() => {
    console.log('Reviews page: Initial likes sync');
    syncAllLikesCounts()
      .then(() => {
        console.log('Reviews page: Refreshing data after sync');
        refetch();
      })
      .catch(err => console.error('Error syncing likes on Reviews page:', err));
      
    // Set an interval to refresh likes count every 30 seconds
    const intervalId = setInterval(() => {
      console.log('Reviews page: Periodic refresh');
      refetch();
    }, 30000);
    
    return () => clearInterval(intervalId);
  }, [refetch]);

  // Debug likes count for reviews
  useEffect(() => {
    if (reviews && reviews.length > 0) {
      console.log('Reviews in Reviews page:', reviews.map(r => ({ 
        id: r.id.substring(0, 8), 
        likes: r.likesCount 
      })));
      
      const targetReview = reviews.find(r => r.id === 'efed29eb-34fd-461f-bbce-0d591e8110de');
      if (targetReview) {
        console.log('Target review in Reviews page:', targetReview.id, 'likes:', targetReview.likesCount);
      }
    }
  }, [reviews]);

  useEffect(() => {
    if (isMobile && page < totalPages) {
      const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
          // This is intentionally left empty as noted in the original code
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [page, totalPages, isMobile]);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setPage(1);
  };

  // Force an immediate refresh when the component mounts
  useEffect(() => {
    const loadData = async () => {
      await syncAllLikesCounts();
      refetch();
    };
    
    loadData();
  }, [refetch]);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        {isMobile ? (
          <div className="flex justify-between items-center mb-4 sticky top-16 z-10 bg-gray-50 pt-2 pb-2">
            <div className="flex items-center gap-2">
              <Star className="h-5 w-5 text-brand-teal" />
              <h1 className="text-xl font-bold">Reviews</h1>
            </div>
            <div className="flex items-center gap-2">
              <Sheet>
                <SheetTrigger asChild>
                  <button className="flex items-center justify-center p-2 bg-white rounded-lg shadow-sm">
                    <Filter className="h-5 w-5 text-gray-500" />
                  </button>
                </SheetTrigger>
                <SheetContent side="bottom" className="rounded-t-xl">
                  <div className="pt-4">
                    <h3 className="text-lg font-medium mb-4">Sort Reviews</h3>
                    <ReviewSorter sortBy={sortBy} onSortChange={handleSortChange} />
                  </div>
                </SheetContent>
              </Sheet>
              <div className="text-sm font-medium text-gray-500 bg-white px-3 py-2 rounded-lg shadow-sm">
                {sortBy === 'recent' ? 'Recent' : sortBy === 'popular' ? 'Popular' : 'Trending'}
              </div>
            </div>
          </div>
        ) : (
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-8 gap-4">
            <div className="flex items-center gap-3">
              <Star className="h-6 w-6 text-brand-teal" />
              <h1 className="text-2xl font-bold">Reviews</h1>
            </div>
            <ReviewSorter sortBy={sortBy} onSortChange={handleSortChange} />
          </div>
        )}
        
        {isLoading ? (
          <div className="flex justify-center items-center my-8">
            <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
          </div>
        ) : error ? (
          <ReviewsError onRetry={refetch} />
        ) : reviews.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-3">
              {allReviewsCount} {allReviewsCount === 1 ? 'review' : 'reviews'}
            </p>
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-screen w-full"></div>}>
              <ReviewsGrid reviews={reviews} />
            </Suspense>
            
            {!isMobile && (
              <ReviewsPagination 
                currentPage={page} 
                totalPages={totalPages} 
                onPageChange={setPage} 
              />
            )}
            
            {isMobile && totalPages > 1 && (
              <Card className="mt-6 mb-2 shadow-sm">
                <CardContent className="p-4">
                  <ReviewsPagination 
                    currentPage={page} 
                    totalPages={totalPages} 
                    onPageChange={setPage} 
                  />
                </CardContent>
              </Card>
            )}
          </>
        ) : (
          <EmptyReviews isLoggedIn={!!user} />
        )}
      </div>
    </div>
  );
};

export default Reviews;
