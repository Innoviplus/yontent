
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';
import { toast } from 'sonner';

export const fetchReviews = async (sortBy: string, userId?: string): Promise<Review[]> => {
  try {
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
          avatar
        )
      `)
      .eq('status', 'PUBLISHED'); // Only fetch PUBLISHED reviews

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
    
    if (data) {
      const transformedReviews: Review[] = data.map(review => ({
        id: review.id,
        userId: review.user_id,
        productName: "Review",
        rating: 5,
        content: review.content,
        images: review.images || [],
        videos: review.videos || [],
        viewsCount: review.views_count || 0, // Ensure it's never undefined
        likesCount: review.likes_count || 0, // Ensure it's never undefined
        createdAt: new Date(review.created_at),
        user: review.profiles ? {
          id: review.profiles.id || review.user_id,
          username: review.profiles.username || 'Anonymous',
          email: '',
          points: 0,
          createdAt: new Date(),
          avatar: review.profiles.avatar
        } : undefined
      }));
      
      return transformedReviews;
    }
    
    return [];
  } catch (error) {
    console.error('Unexpected error:', error);
    throw new Error('An unexpected error occurred');
  }
};
