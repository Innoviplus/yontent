
import { useState, useCallback, useEffect } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchReviews } from '@/services/review';

export type SortOption = 'recent' | 'popular' | 'trending';

export const useReviewsList = (userId?: string) => {
  const [sortBy, setSortBy] = useState<SortOption>('trending');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  // Use a more aggressive stale time to reduce refetches
  const { data: allReviews = [], isLoading, error, refetch } = useQuery({
    queryKey: ['reviews', sortBy, userId],
    queryFn: () => fetchReviews(sortBy, userId),
    staleTime: 60 * 1000, // 1 minute
    meta: {
      onError: (err: Error) => {
        console.error('Error fetching reviews:', err);
      }
    }
  });

  // Force a refetch on mount to ensure we have the latest data
  useEffect(() => {
    refetch();
  }, []);

  // Memoize the paginated reviews to avoid unnecessary recalculations
  const paginatedReviews = allReviews.slice(0, page * itemsPerPage);
  
  const totalPages = Math.ceil(allReviews.length / itemsPerPage);
  const hasMore = (page * itemsPerPage) < allReviews.length;
  
  const loadMore = useCallback(() => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  }, [page, totalPages]);

  return {
    reviews: paginatedReviews,
    allReviewsCount: allReviews.length,
    isLoading,
    error,
    refetch,
    sortBy,
    setSortBy,
    page,
    setPage,
    totalPages,
    itemsPerPage,
    hasMore,
    loadMore
  };
};
