
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
    console.log(`Adding like to review ${reviewId} by user ${userId}`);
    
    // First, add the like record
    const { error: insertLikeError } = await supabase
      .from('review_likes')
      .insert([{ user_id: userId, review_id: reviewId }]);
      
    if (insertLikeError) {
      console.error('Error adding like:', insertLikeError);
      throw insertLikeError;
    }
    
    // Update the likes count directly in the reviews table using an increment operation
    // Use .rpc with a type assertion to bypass TypeScript's type checking
    const { data, error: updateError } = await (supabase.rpc as any)(
      'increment_review_likes',
      { review_id_param: reviewId }
    );
    
    if (updateError) {
      console.error('Error updating review likes count:', updateError);
      throw updateError;
    }
    
    // Fetch the updated likes count to return
    const newLikesCount = await fetchReviewLikesCount(reviewId);
    console.log(`Updated likes count after like: ${newLikesCount}`);
    
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
    console.log(`Removing like from review ${reviewId} by user ${userId}`);
    
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
    
    // Update the likes count directly in the reviews table using a decrement operation
    // Use .rpc with a type assertion to bypass TypeScript's type checking
    const { data, error: updateError } = await (supabase.rpc as any)(
      'decrement_review_likes',
      { review_id_param: reviewId }
    );
    
    if (updateError) {
      console.error('Error updating review likes count after unlike:', updateError);
      throw updateError;
    }
    
    // Fetch the updated likes count to return
    const newLikesCount = await fetchReviewLikesCount(reviewId);
    console.log(`Updated likes count after unlike: ${newLikesCount}`);
    
    return newLikesCount;
  } catch (error) {
    toast.error('Failed to unlike review');
    throw error;
  }
};
