
import { supabase } from '@/integrations/supabase/client';

export const trackReviewView = async (reviewId: string): Promise<void> => {
  try {
    // Use the built-in function to increment view count
    const { error } = await supabase.rpc('increment_view_count', {
      review_id: reviewId
    });
    
    if (error) {
      console.error('Error tracking view:', error);
    }
  } catch (error) {
    console.error('Unexpected error tracking view:', error);
  }
};
