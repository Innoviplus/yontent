
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';
import { extractAvatarUrl } from '@/hooks/admin/api/types/participationTypes';

export const useReviews = (limit = 10, initialFilter = 'recent') => {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [hasMore, setHasMore] = useState(true);
  const [page, setPage] = useState(1);
  const [sortBy, setSortBy] = useState(initialFilter);
  
  const fetchReviews = async (currentPage = 1, orderBy = sortBy) => {
    try {
      setLoading(true);
      
      // Calculate pagination
      const from = (currentPage - 1) * limit;
      const to = from + limit - 1;
      
      // Determine order based on filter
      let orderColumn = 'created_at';
      let ascending = false;
      
      if (orderBy === 'popular') {
        orderColumn = 'likes_count';
        ascending = false;
      } else if (orderBy === 'oldest') {
        orderColumn = 'created_at';
        ascending = true;
      }
      
      const { data, error } = await supabase
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
            points,
            created_at,
            extended_data
          )
        `)
        .eq('status', 'PUBLISHED')
        .order(orderColumn, { ascending })
        .range(from, to);
        
      if (error) throw error;
      
      // If we got fewer items than the limit, there are no more to load
      if (data.length < limit) {
        setHasMore(false);
      }
      
      // Transform the data to match the Review type
      const transformedReviews: Review[] = data.map(item => ({
        id: item.id,
        userId: item.user_id,
        content: item.content,
        images: item.images || [],
        viewsCount: item.views_count,
        likesCount: item.likes_count,
        createdAt: new Date(item.created_at),
        user: item.profiles ? {
          id: item.profiles.id,
          username: item.profiles.username || 'Anonymous',
          email: '',
          points: item.profiles.points || 0,
          createdAt: new Date(item.profiles.created_at),
          avatar: extractAvatarUrl(item.profiles.extended_data)
        } : undefined
      }));
      
      // If it's the first page, replace the array, otherwise append
      if (currentPage === 1) {
        setReviews(transformedReviews);
      } else {
        setReviews(prev => [...prev, ...transformedReviews]);
      }
    } catch (error) {
      console.error('Error fetching reviews:', error);
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    // Reset pagination when filter changes
    setPage(1);
    setHasMore(true);
    fetchReviews(1);
  }, [sortBy]);
  
  useEffect(() => {
    if (page > 1) {
      fetchReviews(page);
    }
  }, [page]);
  
  const loadMore = () => {
    if (!loading && hasMore) {
      setPage(prevPage => prevPage + 1);
    }
  };
  
  return { 
    reviews, 
    loading, 
    hasMore, 
    loadMore,
    sortBy,
    setSortBy,
    setPage
  };
};
