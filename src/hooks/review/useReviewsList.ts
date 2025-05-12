
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchReviews } from '@/services/review';
import { syncAllLikesCounts } from '@/lib/api';

export type SortOption = 'recent' | 'popular' | 'trending';

export const useReviewsList = (userId?: string) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Force sync before initial data fetch
  useEffect(() => {
    console.log('useReviewsList: Running initial likes count sync');
    syncAllLikesCounts()
      .then(() => console.log('useReviewsList: Initial likes count sync complete'))
      .catch(err => 
        console.error('Error syncing likes count in useReviewsList:', err)
      );
  }, []);

  // Use a very short stale time to refresh data frequently
  const { data: allReviews = [], isLoading, error, refetch } = useQuery({
    queryKey: ['reviews', sortBy, userId],
    queryFn: async () => {
      console.log('Fetching reviews with required sync...');
      // Always sync likes counts before fetching to ensure we have fresh data
      await syncAllLikesCounts();
      return fetchReviews(sortBy, userId);
    },
    staleTime: 10 * 1000, // 10 seconds stale time for frequent refreshes
    meta: {
      onError: (err: Error) => {
        console.error('Error fetching reviews:', err);
      }
    }
  });

  // Debug log to check likes count for specific review
  useEffect(() => {
    if (allReviews.length > 0) {
      const targetReview = allReviews.find(r => r.id === 'efed29eb-34fd-461f-bbce-0d591e8110de');
      if (targetReview) {
        console.log('Target review in useReviewsList:', targetReview.id, 'likes:', targetReview.likesCount);
      }
      
      console.log('Sample reviews like counts:', 
        allReviews.slice(0, 5).map(r => ({ id: r.id.substring(0, 8), likes: r.likesCount }))
      );
    }
  }, [allReviews]);

  // Memoize the paginated reviews to avoid unnecessary recalculations
  const paginatedReviews = allReviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);
  
  const totalPages = Math.ceil(allReviews.length / itemsPerPage);
  const hasMore = (page * itemsPerPage) < allReviews.length;
  
  const loadMore = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  // Force a sync and refetch when sorting changes
  const handleSortChange = (newSort: SortOption) => {
    setSortBy(newSort);
    // Sync likes and refresh data when sort changes
    console.log('Sort changed, syncing likes count and refreshing data...');
    syncAllLikesCounts()
      .then(() => refetch())
      .catch(err => console.error('Error syncing likes count during sort change:', err));
  };

  return {
    reviews: paginatedReviews,
    allReviewsCount: allReviews.length,
    isLoading,
    error,
    refetch: async () => {
      console.log('Manual refetch requested, syncing likes count first...');
      await syncAllLikesCounts();
      return refetch();
    },
    sortBy,
    setSortBy: handleSortChange,
    page,
    setPage,
    totalPages,
    itemsPerPage,
    hasMore,
    loadMore
  };
};
