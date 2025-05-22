
import { supabase } from "@/integrations/supabase/client";
import { toast } from "sonner";

// Add a like to a review
export const likeReview = async (reviewId: string, userId: string): Promise<boolean> => {
  try {
    // Check if the user already liked this review
    const { data: existingLike, error: checkError } = await supabase
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id_likes', userId)
      .single();
    
    if (checkError && checkError.code !== 'PGRST116') {
      console.error('Error checking like status:', checkError);
      return false;
    }
    
    // If like already exists, remove it (unlike)
    if (existingLike) {
      const { error: deleteError } = await supabase
        .from('review_likes')
        .delete()
        .eq('review_id', reviewId)
        .eq('user_id_likes', userId);
      
      if (deleteError) {
        console.error('Error removing like:', deleteError);
        toast.error('Failed to unlike review');
        return false;
      }
      
      // Call the function to update the likes count
      const { error: decrementError } = await supabase.rpc('decrement_review_likes', { review_id_param: reviewId });
      
      if (decrementError) {
        console.error('Error decrementing like count:', decrementError);
      }
      
      return false; // Return false to indicate the review is now unliked
      
    } else {
      // Like doesn't exist, so create it
      const { error: insertError } = await supabase
        .from('review_likes')
        .insert({
          review_id: reviewId,
          user_id_likes: userId
        });
      
      if (insertError) {
        console.error('Error adding like:', insertError);
        toast.error('Failed to like review');
        return false;
      }
      
      // Call the function to update the likes count
      const { error: incrementError } = await supabase.rpc('increment_review_likes', { review_id_param: reviewId });
      
      if (incrementError) {
        console.error('Error incrementing like count:', incrementError);
      }
      
      return true; // Return true to indicate the review is now liked
    }
  } catch (error) {
    console.error('Unexpected error in likeReview:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Check if the current user has liked a review
export const checkIfLiked = async (reviewId: string, userId: string | undefined): Promise<boolean> => {
  if (!userId) return false;
  
  try {
    const { data, error } = await supabase
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId)
      .eq('user_id_likes', userId)
      .single();
    
    if (error && error.code !== 'PGRST116') {
      console.error('Error checking like status:', error);
      return false;
    }
    
    return !!data;
  } catch (error) {
    console.error('Unexpected error in checkIfLiked:', error);
    return false;
  }
};
