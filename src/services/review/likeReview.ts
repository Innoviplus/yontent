
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
      const { error: decrementError } = await supabase.rpc('sync_review_likes_count', { review_id_param: reviewId });
      
      if (decrementError) {
        console.error('Error syncing like count:', decrementError);
        
        // Fallback: manually update the likes count in the reviews table
        await updateLikesCountManually(reviewId);
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
      const { error: incrementError } = await supabase.rpc('sync_review_likes_count', { review_id_param: reviewId });
      
      if (incrementError) {
        console.error('Error syncing like count:', incrementError);
        
        // Fallback: manually update the likes count in the reviews table
        await updateLikesCountManually(reviewId);
      }
      
      return true; // Return true to indicate the review is now liked
    }
  } catch (error) {
    console.error('Unexpected error in likeReview:', error);
    toast.error('An unexpected error occurred');
    return false;
  }
};

// Helper function to manually count and update the likes count
const updateLikesCountManually = async (reviewId: string) => {
  try {
    // Count likes for this review
    const { count, error: countError } = await supabase
      .from('review_likes')
      .select('*', { count: 'exact', head: false })
      .eq('review_id', reviewId);
      
    if (countError) {
      console.error('Error counting likes:', countError);
      return;
    }
    
    if (count !== null) {
      // Update the reviews table with the correct count
      const { error: updateError } = await supabase
        .from('reviews')
        .update({ likes_count: count })
        .eq('id', reviewId);
        
      if (updateError) {
        console.error('Error manually updating likes count:', updateError);
      } else {
        console.log(`Manually updated likes count for review ${reviewId} to ${count}`);
      }
    }
  } catch (error) {
    console.error('Error in manual likes count update:', error);
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
