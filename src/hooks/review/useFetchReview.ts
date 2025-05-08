
import { useState, useEffect } from 'react';
import { Review } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { trackReviewView } from '@/services/review';

export const useFetchReview = (id: string | undefined) => {
  const [review, setReview] = useState<Review | null>(null);
  const [loading, setLoading] = useState(true);
  
  const fetchReview = async () => {
    if (!id) return;
    
    try {
      setLoading(true);
      
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
        const transformedReview: Review = {
          id: data.id,
          userId: data.user_id,
          productName: "Review",
          rating: 5,
          content: data.content,
          images: data.images || [],
          videos: data.videos || [],
          viewsCount: data.views_count,
          // Make sure to use the likes_count from the database
          likesCount: data.likes_count || 0,
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
        
        // Log the review data for debugging
        console.log('Fetched review data:', transformedReview);
        console.log('Like count from database:', data.likes_count);
        
        // Track the view
        trackReviewView(id);
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    if (id) {
      fetchReview();
    } else {
      setLoading(false);
    }
  }, [id]);
  
  return { review, loading, setReview };
};
