
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
    const { data, error } = await supabase
      .rpc('sync_review_likes_count', { review_id_param: reviewId });
    
    if (error) {
      console.error('Error syncing likes count:', error);
      throw new Error(error.message);
    }
    
    console.log(`Successfully synced likes count for review ${reviewId}: ${data}`);
    return data;
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
    
    // Sync likes count for each review
    const syncPromises = reviews.map(review => 
      supabase.rpc('sync_review_likes_count', { review_id_param: review.id })
        .then(({ data, error }) => {
          if (error) {
            console.error(`Error syncing review ${review.id}:`, error);
            return { id: review.id, success: false, error };
          }
          console.log(`Synced review ${review.id} likes count: ${data}`);
          return { id: review.id, likes: data, success: true };
        })
    );
    
    const results = await Promise.all(syncPromises);
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
