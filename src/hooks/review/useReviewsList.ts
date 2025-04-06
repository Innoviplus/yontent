
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { fetchReviews } from '@/services/reviewService';

export type SortOption = 'recent' | 'popular' | 'trending';

export const useReviewsList = (userId?: string) => {
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: reviews = [], isLoading, error, refetch } = useQuery({
    queryKey: ['reviews', sortBy, userId],
    queryFn: () => fetchReviews(sortBy, userId),
    onError: (err) => {
      console.error('Error fetching reviews:', err);
    }
  });
  
  const totalPages = Math.ceil(reviews.length / itemsPerPage);
  const paginatedReviews = reviews.slice((page - 1) * itemsPerPage, page * itemsPerPage);
    
  const hasMore = (page * itemsPerPage) < reviews.length;
  
  const loadMore = () => {
    if (page < totalPages) {
      setPage(page + 1);
    }
  };

  return {
    reviews: paginatedReviews,
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
