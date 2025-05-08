
import { supabase } from '@/integrations/supabase/client';

// Track unique views to prevent view count inflation
const viewedReviews = new Set<string>();

export const trackReviewView = async (reviewId: string): Promise<void> => {
  // Check if this review has already been viewed in this session
  if (viewedReviews.has(reviewId)) {
    console.log('Review already viewed in this session, skipping view count increment');
    return;
  }
  
  try {
    // Add to viewed set first to prevent multiple rapid calls
    viewedReviews.add(reviewId);
    
    // Use the built-in function to increment view count
    const { error } = await supabase.rpc('increment_view_count', {
      review_id: reviewId
    });
    
    if (error) {
      console.error('Error tracking view:', error);
      // If there's an error, remove from the viewed set to allow retry
      viewedReviews.delete(reviewId);
    }
  } catch (error) {
    console.error('Unexpected error tracking view:', error);
    // If there's an error, remove from the viewed set to allow retry
    viewedReviews.delete(reviewId);
  }
};
