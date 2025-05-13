
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
  try {
    const { data, error } = await supabase
      .rpc('sync_review_likes_count', { review_id_param: reviewId });
    
    if (error) {
      console.error('Error syncing likes count:', error);
      throw error;
    }
    
    return data;
  } catch (error) {
    console.error('Error in syncLikesCount:', error);
    throw error;
  }
};

/**
 * Sync likes count for all reviews
 * This is useful for ensuring all reviews have accurate likes counts
 */
export const syncAllLikesCounts = async () => {
  try {
    // First get all review IDs
    const { data: reviews, error: reviewsError } = await supabase
      .from('reviews')
      .select('id');
    
    if (reviewsError) {
      console.error('Error fetching reviews for sync:', reviewsError);
      throw reviewsError;
    }
    
    if (!reviews || reviews.length === 0) return;
    
    console.log(`Syncing likes counts for ${reviews.length} reviews...`);
    
    // Sync likes count for each review
    const syncPromises = reviews.map(review => 
      supabase.rpc('sync_review_likes_count', { review_id_param: review.id })
        .then(({ data, error }) => {
          if (error) {
            console.error(`Error syncing likes for review ${review.id}:`, error);
          } else {
            console.log(`Synced likes for review ${review.id}: ${data} likes`);
          }
          return { reviewId: review.id, likesCount: data, error };
        })
    );
    
    const results = await Promise.all(syncPromises);
    console.log(`Successfully synced likes counts for ${reviews.length} reviews`, 
      results.filter(r => !r.error).length, 'successful,', 
      results.filter(r => r.error).length, 'failed');
      
    return results;
  } catch (error) {
    console.error('Error syncing all likes counts:', error);
    throw error;
  }
};
