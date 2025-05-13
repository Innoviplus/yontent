
import { supabase } from "@/integrations/supabase/client";

/**
 * Fetch top users ranked by points
 */
export const getTopUsers = async () => {
  const { data, error } = await supabase
    .from('profiles')
    .select('id, username, points, avatar')
    .not('username', 'is', null)  // Filter out profiles without usernames
    .neq('username', 'Anonymous')  // Filter out Anonymous users
    .gt('points', 0)  // Filter out users with 0 points
    .order('points', { ascending: false })
    .limit(50);
    
  if (error) {
    throw new Error(error.message);
  }
  
  return data;
};

/**
 * Sync likes count for a single review
 */
export const syncLikesCount = async (reviewId: string) => {
  console.log(`Syncing likes count for review: ${reviewId}`);
  
  try {
    // First get review likes using RPC which has proper type definitions
    const { data: syncResult, error: syncError } = await supabase
      .rpc('sync_review_likes_count', { review_id_param: reviewId });
    
    if (syncError) {
      console.error('Error syncing likes count:', syncError);
      throw syncError;
    }
    
    console.log(`Successfully updated likes count for review ${reviewId}: ${syncResult}`);
    return syncResult;
  } catch (error) {
    console.error('Unexpected error in syncLikesCount:', error);
    throw error;
  }
};

/**
 * Sync likes count for all reviews
 * This is useful for ensuring all reviews have accurate likes counts
 */
export const syncAllLikesCounts = async () => {
  console.log("Starting to sync all reviews likes counts");
  
  try {
    // First get all review IDs
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id');
    
    if (reviewsError) {
      console.error('Error fetching reviews for sync:', reviewsError);
      throw new Error(reviewsError.message);
    }
    
    if (!reviews || reviews.length === 0) {
      console.log("No reviews found to sync");
      return;
    }
    
    console.log(`Found ${reviews.length} reviews to sync`);
    
    // Update each review with the correct count using our RPC function
    const updatePromises = reviews.map(async review => {
      try {
        const { data: syncResult, error: syncError } = await supabase
          .rpc('sync_review_likes_count', { review_id_param: review.id });
          
        if (syncError) {
          console.error(`Error syncing review ${review.id}:`, syncError);
          return { id: review.id, success: false, error: syncError };
        }
        
        console.log(`Synced review ${review.id} likes count: ${syncResult}`);
        return { id: review.id, likes: syncResult, success: true };
      } catch (error) {
        console.error(`Error syncing review ${review.id}:`, error);
        return { id: review.id, success: false, error };
      }
    });
    
    const results = await Promise.all(updatePromises);
    console.log(`Sync results summary:`, 
      results.reduce((acc, curr) => {
        acc[curr.success ? 'success' : 'failed']++;
        return acc;
      }, { success: 0, failed: 0 })
    );
    
    // Check for specific review we're interested in
    const targetReview = results.find(r => r.id === 'efed29eb-34fd-461f-bbce-0d591e8110de');
    if (targetReview) {
      console.log('Target review sync result:', targetReview);
    }
    
    return results;
  } catch (error) {
    console.error('Error syncing all likes counts:', error);
    throw error;
  }
};
