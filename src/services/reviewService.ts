
import { supabase } from '@/integrations/supabase/client';
import { Review } from '@/lib/types';
import { toast } from 'sonner';
import { extractAvatarUrl } from '@/hooks/admin/api/types/participationTypes';

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
    
    // Extract avatar URL using the shared utility function
    const avatarUrl = extractAvatarUrl(data.profiles?.extended_data);
    
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
        avatar: avatarUrl
      } : undefined
    };
  } catch (error) {
    console.error('Unexpected error:', error);
    return null;
  }
};

export const trackReviewView = async (reviewId: string): Promise<void> => {
  try {
    const { error } = await supabase.rpc('increment_view_count', {
      review_id: reviewId
    });
    
    if (error) {
      console.error('Error tracking review view:', error);
    }
  } catch (error) {
    console.error('Unexpected error:', error);
  }
};

// Fetch multiple reviews
export const fetchReviews = async (options = {}) => {
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
      .order('created_at', { ascending: false });
    
    if (error) {
      throw error;
    }
    
    return data.map(item => {
      // Extract avatar URL using the shared utility function
      const avatarUrl = extractAvatarUrl(item.profiles?.extended_data);
      
      return {
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
          points: 0,
          createdAt: new Date(),
          avatar: avatarUrl
        } : undefined
      };
    });
  } catch (error) {
    console.error('Error fetching reviews:', error);
    return [];
  }
};
