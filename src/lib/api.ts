
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
    // Use a properly typed approach to count likes
    // First get all likes for this review
    const { data: likes, error: likesError } = await supabase
      .from('review_likes')
      .select('id')
      .eq('review_id', reviewId);
      
    if (likesError) {
      console.error('Error fetching likes:', likesError);
      throw likesError;
    }
    
    // Count the likes manually
    const actualCount = likes ? likes.length : 0;
    console.log(`Direct count for review ${reviewId}: ${actualCount} likes`);
    
    // Update the reviews table with the correct count using normal update
    const { data, error } = await supabase
      .from('reviews')
      .update({ likes_count: actualCount })
      .eq('id', reviewId)
      .select('likes_count');
    
    if (error) {
      console.error('Error updating likes count:', error);
      throw error;
    }
    
    console.log(`Successfully updated likes count for review ${reviewId}: ${data?.[0]?.likes_count || actualCount}`);
    return actualCount;
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
    
    // Get all likes grouped by review_id
    const { data: likesCounts, error: countError } = await supabase
      .from('review_likes')
      .select('review_id')
      .is('review_id', 'not.null');
      
    if (countError) {
      console.error('Error fetching likes counts:', countError);
      throw countError;
    }
    
    // Group likes by review_id
    const likesMap = new Map<string, number>();
    if (likesCounts) {
      likesCounts.forEach(like => {
        const reviewId = like.review_id;
        if (reviewId) {
          likesMap.set(reviewId, (likesMap.get(reviewId) || 0) + 1);
        }
      });
    }
    
    // Update each review with the correct count
    const updatePromises = reviews.map(async review => {
      const likesCount = likesMap.get(review.id) || 0;
      
      const { data: updateResult, error: updateError } = await supabase
        .from('reviews')
        .update({ likes_count: likesCount })
        .eq('id', review.id)
        .select('id, likes_count');
        
      if (updateError) {
        console.error(`Error updating review ${review.id}:`, updateError);
        return { id: review.id, success: false, error: updateError };
      }
      
      console.log(`Synced review ${review.id} likes count: ${likesCount}`);
      return { id: review.id, likes: likesCount, success: true };
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
