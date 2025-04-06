
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type SortOption = 'recent' | 'views' | 'relevant';

const ITEMS_PER_PAGE = 20;

export const useReviews = () => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchReviews = async (pageNum: number, sort: SortOption) => {
    try {
      let query = supabase
        .from('reviews')
        .select(`
          *,
          profiles:user_id (
            id,
            username,
            points,
            created_at,
            extended_data
          )
        `)
        .eq('status', 'PUBLISHED') // Only fetch PUBLISHED reviews
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      switch (sort) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'views':
          query = query.order('views_count', { ascending: false });
          break;
        case 'relevant':
          query = query.order('views_count', { ascending: false });
          break;
      }
        
      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
        return;
      }
      
      const transformedReviews: Review[] = data.map(review => ({
        id: review.id,
        userId: review.user_id,
        content: review.content,
        images: review.images || [],
        viewsCount: review.views_count,
        likesCount: review.likes_count,
        createdAt: new Date(review.created_at),
        user: review.profiles ? {
          id: review.profiles.id,
          username: review.profiles.username || 'Anonymous',
          email: '',
          points: review.profiles.points || 0,
          createdAt: new Date(review.profiles.created_at),
          avatar: review.profiles.extended_data?.avatarUrl
        } : undefined
      }));

      if (pageNum === 0) {
        setReviews(transformedReviews);
      } else {
        setReviews(prev => [...prev, ...transformedReviews]);
      }
      
      setHasMore(transformedReviews.length === ITEMS_PER_PAGE);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setPage(0);
    fetchReviews(0, sortBy);
  }, [sortBy]);
  
  useEffect(() => {
    if (page > 0) {
      fetchReviews(page, sortBy);
    }
  }, [page]);
  
  return {
    reviews,
    loading,
    sortBy,
    setSortBy,
    setPage,
    hasMore,
  };
};
