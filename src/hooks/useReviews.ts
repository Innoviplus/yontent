
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { syncAllLikesCounts } from '@/lib/api';

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
      // First sync all likes counts to ensure we have accurate data
      await syncAllLikesCounts();
      
      let query = supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          content,
          images,
          videos,
          views_count,
          likes_count,
          created_at,
          profiles:user_id (
            id,
            username,
            avatar,
            points,
            created_at
          )
        `)
        .eq('status', 'PUBLISHED'); // Only fetch PUBLISHED reviews

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
        
      query = query.range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);
      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching reviews:', error);
        toast.error('Failed to load reviews');
        return;
      }
      
      const transformedReviews: Review[] = data.map(review => {
        // Log to debug likes count
        console.log(`Review ${review.id} has ${review.likes_count || 0} likes`);
        
        return {
          id: review.id,
          userId: review.user_id,
          content: review.content,
          images: review.images || [],
          videos: review.videos || [],
          viewsCount: review.views_count || 0,
          likesCount: review.likes_count || 0, // Ensure we're using the count from the database
          createdAt: new Date(review.created_at),
          productName: 'Review',
          rating: 5,
          user: {
            id: review.profiles?.id || review.user_id,
            username: review.profiles?.username || 'Anonymous',
            email: '',
            points: review.profiles?.points || 0,
            createdAt: review.profiles?.created_at ? new Date(review.profiles.created_at) : new Date(),
            avatar: review.profiles?.avatar
          }
        };
      });

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
  
  // Run a background sync when component mounts
  useEffect(() => {
    syncAllLikesCounts().catch(console.error);
  }, []);
  
  useEffect(() => {
    setPage(0);
    fetchReviews(0, sortBy);
  }, [sortBy]);
  
  useEffect(() => {
    if (page > 0) {
      fetchReviews(page, sortBy);
    }
  }, [page]);
  
  const loadMore = () => {
    setPage(prevPage => prevPage + 1);
  };
  
  return {
    reviews,
    loading,
    sortBy,
    setSortBy,
    setPage,
    hasMore,
    loadMore
  };
};
