
import { supabase } from '@/integrations/supabase/client';

// Track viewed reviews in session storage to avoid counting multiple views
const viewedReviews = new Set<string>(); 

export const trackReviewView = async (reviewId: string) => {
  try {
    // Only count a view once per session for each review
    if (viewedReviews.has(reviewId)) {
      return;
    }
    
    // Add to viewed reviews set
    viewedReviews.add(reviewId);
    
    const { error } = await supabase.rpc('increment_view_count', {
      review_id: reviewId
    });
    
    if (error) {
      console.error('Error tracking review view:', error);
    }
  } catch (error) {
    console.error('Unexpected error tracking view:', error);
  }
};
