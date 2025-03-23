
import { useState } from 'react';
import { useQuery } from '@tanstack/react-query';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';

const fetchReviews = async (sortBy: string, userId?: string) => {
  try {
    let query = supabase
      .from('reviews')
      .select(`
        id,
        user_id,
        content,
        images,
        views_count,
        likes_count,
        created_at,
        profiles:user_id (
          id,
          username,
          avatar
        )
      `);

    if (sortBy === 'recent') {
      query = query.order('created_at', { ascending: false });
    } else if (sortBy === 'relevant' && userId) {
      query = query.order('created_at', { ascending: false });
    }

    const { data, error } = await query;
    
    if (error) {
      console.error('Error fetching reviews:', error);
      throw new Error('Failed to load reviews');
    }
    
    const transformedReviews: Review[] = data.map(review => ({
      id: review.id,
      userId: review.user_id,
      productName: "Review",
      rating: 5,
      content: review.content,
      images: review.images || [],
      viewsCount: review.views_count,
      likesCount: review.likes_count,
      createdAt: new Date(review.created_at),
      user: review.profiles ? {
        id: review.profiles.id,
        username: review.profiles.username || 'Anonymous',
        email: '',
        points: 0,
        createdAt: new Date(),
        avatar: review.profiles.avatar
      } : undefined
    }));
    
    return transformedReviews;
  } catch (error) {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
};

export const useReviewsList = (userId?: string) => {
  const [sortBy, setSortBy] = useState<string>('recent');
  const [page, setPage] = useState(1);
  const itemsPerPage = 10;

  const { data: reviews, isLoading, error, refetch } = useQuery({
    queryKey: ['reviews', sortBy, userId],
    queryFn: () => fetchReviews(sortBy, userId),
  });
  
  const totalPages = reviews ? Math.ceil(reviews.length / itemsPerPage) : 0;
  const paginatedReviews = reviews ? 
    reviews.slice((page - 1) * itemsPerPage, page * itemsPerPage) : 
    [];

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
    itemsPerPage
  };
};
