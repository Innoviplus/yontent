
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { trackReviewView } from '@/services/review';

export const useFetchReview = (id: string | undefined) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  const [isRefetching, setIsRefetching] = useState(false);
  
  const fetchReview = async (skipViewTracking = false) => {
    if (!id) return;
    
    try {
      // Only show loading state on initial fetch, not refreshes
      if (!isRefetching) {
        setLoading(true);
      }
      
      console.log(`Fetching review data for ID: ${id}`);
      
      // Get the review data with actual likes count from reviews table
      const { data, error } = await supabase
        .from('reviews')
        .select(`
          id,
          user_id,
          content,
          images,
          videos,
          views_count,
          likes_count,
          status,
          created_at,
          profiles:user_id (
            id,
            username,
            avatar
          )
        `)
        .eq('id', id)
        .single();
      
      if (error) {
        console.error('Error fetching review:', error);
        toast.error('Failed to load review');
        return;
      }
      
      if (data) {
        // Log the raw data for debugging
        console.log('Raw review data from DB:', data);
        
        // Explicitly verify likes_count is present in the data
        if (data.likes_count === undefined || data.likes_count === null) {
          console.warn('Likes count is undefined or null in fetched data');
          
          // If missing, manually fetch the likes count from the review_likes table
          const { count, error: countError } = await supabase
            .from('review_likes')
            .select('*', { count: 'exact', head: false })
            .eq('review_id', id);
            
          if (!countError && count !== null) {
            console.log(`Manually counted ${count} likes for review ${id}`);
            data.likes_count = count;
          }
        }
        
        const transformedReview: Review = {
          id: data.id,
          userId: data.user_id,
          productName: "Review",
          rating: 5,
          content: data.content,
          images: data.images || [],
          videos: data.videos || [],
          viewsCount: data.views_count,
          // Make sure to use the likes_count from the database and default to 0 if not present
          likesCount: data.likes_count || 0,
          status: data.status || 'PUBLISHED',
          createdAt: new Date(data.created_at),
          user: data.profiles ? {
            id: data.profiles.id || data.user_id,
            username: data.profiles.username || 'Anonymous',
            email: '',
            points: 0,
            createdAt: new Date(),
            avatar: data.profiles.avatar
          } : undefined
        };
        
        setReview(transformedReview);
        
        // Log the transformed review data for debugging
        console.log('Transformed review data:', transformedReview);
        console.log('Likes count:', transformedReview.likesCount);
        
        // Only track the view if this is not a refresh operation
        if (!skipViewTracking && !isRefetching) {
          trackReviewView(id);
        }
      }
    } catch (error) {
      console.error('Unexpected error in fetchReview:', error);
      toast.error('An unexpected error occurred while loading the review');
    } finally {
      setLoading(false);
      setIsRefetching(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchReview();
    } else {
      setLoading(false);
    }
  }, [id]);
  
  const refetchWithState = (skipViewTracking = false) => {
    setIsRefetching(true);
    return fetchReview(skipViewTracking);
  };
  
  return { review, loading, setReview, refetchReview: refetchWithState };
};
