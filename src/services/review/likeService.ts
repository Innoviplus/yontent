
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

/**
 * Checks if a user has already liked a review
 */
export const checkUserLikedReview = async (userId: string, reviewId: string) => {
  try {
    const { data, error } = await supabase
      .from('review_likes')
      .select('id')
      .eq('user_id', userId)
      .eq('review_id', reviewId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking if user liked review:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Unexpected error checking like status:', error);
    return false;
  }
};

/**
 * Fetches the current likes count for a review
 */
export const fetchReviewLikesCount = async (reviewId: string) => {
  try {
    const { data, error } = await supabase
      .from('reviews')
      .select('likes_count')
      .eq('id', reviewId)
      .single();
      
    if (error) {
      console.error('Error fetching current likes count:', error);
      return 0;
    }
    
    return data?.likes_count || 0;
  } catch (error) {
    console.error('Unexpected error fetching likes count:', error);
    return 0;
  }
};

/**
 * Adds a like to a review
 */
export const likeReview = async (userId: string, reviewId: string) => {
  try {
    // First, add the like record
    const { error: insertLikeError } = await supabase
      .from('review_likes')
      .insert([{ user_id: userId, review_id: reviewId }]);
      
    if (insertLikeError) {
      console.error('Error adding like:', insertLikeError);
      throw insertLikeError;
    }
    
    // Get the current likes count
    const currentCount = await fetchReviewLikesCount(reviewId);
    const newLikesCount = currentCount + 1;
    
    // Update the likes count in the reviews table
    const { error: updateError } = await supabase
      .from('reviews')
      .update({ likes_count: newLikesCount })
      .eq('id', reviewId);
      
    if (updateError) {
      console.error('Error updating review likes count:', updateError);
      throw updateError;
    }
    
    return newLikesCount;
  } catch (error) {
    toast.error('Failed to like review');
    throw error;
  }
};

/**
 * Removes a like from a review
 */
export const unlikeReview = async (userId: string, reviewId: string) => {
  try {
    // First, remove the like record
    const { error: deleteLikeError } = await supabase
      .from('review_likes')
      .delete()
      .eq('user_id', userId)
      .eq('review_id', reviewId);
      
    if (deleteLikeError) {
      console.error('Error removing like:', deleteLikeError);
      throw deleteLikeError;
    }
    
    // Get the current likes count
    const currentCount = await fetchReviewLikesCount(reviewId);
    const newLikesCount = Math.max(0, currentCount - 1);
    
    // Update the likes count in the reviews table
    const { error: updateError } = await supabase
      .from('reviews')
      .update({ likes_count: newLikesCount })
      .eq('id', reviewId);
      
    if (updateError) {
      console.error('Error updating review likes count after unlike:', updateError);
      throw updateError;
    }
    
    return newLikesCount;
  } catch (error) {
    toast.error('Failed to unlike review');
    throw error;
  }
};
