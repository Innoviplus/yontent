
import { Suspense, lazy, useEffect, useMemo } from 'react';
import { Loader2, Filter } from 'lucide-react';
import Navbar from '@/components/Navbar';
import { useAuth } from '@/contexts/AuthContext';
import { useReviewsList, SortOption } from '@/hooks/review/useReviewsList';
import ReviewSorter from '@/components/review/ReviewSorter';
import EmptyReviews from '@/components/review/EmptyReviews';
import ReviewsError from '@/components/review/ReviewsError';
import ReviewsGrid from '@/components/review/ReviewsGrid';
import ReviewsPagination from '@/components/review/ReviewsPagination';
import { Sheet, SheetContent, SheetTrigger } from '@/components/ui/sheet';
import { useIsMobile } from '@/hooks/use-mobile';
import { Card, CardContent } from '@/components/ui/card';

const Reviews = () => {
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

  // Preload the next page of reviews when approaching the bottom for smoother pagination
  useEffect(() => {
    if (isMobile && page < totalPages) {
      // Prefetch next page data with low priority
      const prefetchNextPage = () => {
        const nextPage = page + 1;
        if (nextPage <= totalPages) {
          const imgElements = document.querySelectorAll('img[loading="lazy"]');
          
          // Start preloading images after current page is loaded
          if (imgElements.length > 0) {
            imgElements.forEach(img => {
              // Use Intersection Observer to load images as they approach viewport
              const observer = new IntersectionObserver(
                (entries) => {
                  entries.forEach(entry => {
                    if (entry.isIntersecting) {
                      const img = entry.target as HTMLImageElement;
                      if (img.dataset.src) {
                        img.src = img.dataset.src;
                        img.removeAttribute('data-src');
                      }
                      observer.unobserve(img);
                    }
                  });
                },
                { rootMargin: '200px' }
              );
              
              observer.observe(img);
            });
          }
        }
      };
      
      // Call prefetch when user scrolls near bottom
      const handleScroll = () => {
        if (window.innerHeight + window.scrollY >= document.body.offsetHeight - 1000) {
          prefetchNextPage();
        }
      };
      
      window.addEventListener('scroll', handleScroll);
      return () => window.removeEventListener('scroll', handleScroll);
    }
  }, [page, totalPages, isMobile]);

  const handleSortChange = (value: string) => {
    setSortBy(value as SortOption);
    setPage(1); // Reset to first page when sort changes
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-2 sm:px-4 pt-16 md:pt-24 pb-8">
        {isMobile ? (
          <div className="flex justify-between items-center mb-3 sticky top-16 z-10 bg-gray-50 pt-2 pb-2">
            <h1 className="text-xl font-bold">Reviews</h1>
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
            <h1 className="text-2xl font-bold">Reviews</h1>
            <ReviewSorter sortBy={sortBy} onSortChange={handleSortChange} />
          </div>
        )}
        
        {isLoading && reviews.length === 0 ? (
          <div className="flex justify-center items-center my-6">
            <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
          </div>
        ) : error ? (
          <ReviewsError onRetry={refetch} />
        ) : reviews.length > 0 ? (
          <>
            <p className="text-sm text-gray-500 mb-3">{allReviewsCount} reviews</p>
            <Suspense fallback={<div className="animate-pulse bg-gray-200 h-[100px] w-full"></div>}>
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
