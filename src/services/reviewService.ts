import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';
import { toast } from 'sonner';

export const fetchReview = async (id: string): Promise<Review | null> => {
  try {
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
          extended_data
        )
      `)
      .eq('id', id)
      .single();
    
    if (error) {
      console.error('Error fetching review:', error);
      return null;
    }
    
    return {
      id: data.id,
      userId: data.user_id,
      content: data.content,
      images: data.images || [],
      viewsCount: data.views_count,
      likesCount: data.likes_count,
      createdAt: new Date(data.created_at),
      user: data.profiles ? {
        id: data.profiles.id,
        username: data.profiles.username || 'Anonymous',
        email: '',
        points: 0,
        createdAt: new Date(),
        avatar: data.profiles.extended_data?.avatarUrl
      } : undefined
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

export const trackReviewView = async (reviewId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_review_views', {
      review_id: reviewId
    });
    
    if (error) {
      console.error('Error tracking review view:', error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Additional functions can be added here for other review-related operations
