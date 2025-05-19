
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const submitReview = async ({ 
  userId, 
  content, 
  images,
  videos, 
  isDraft = false,
  reviewId = null // Add reviewId parameter to support updates
}: { 
  userId: string; 
  content: string; 
  images: string[];
  videos?: string[] | null; 
  isDraft?: boolean;
  reviewId?: string | null;
}) => {
  try {
    console.log('Submitting review with data:', {
      isDraft,
      reviewId,
      contentLength: content.length,
      imageCount: images?.length || 0,
      videoCount: videos?.length || 0
    });
    
    // Data to insert or update
    const reviewData = {
      user_id: userId,
      content,
      images,
      videos,
      status: isDraft ? 'DRAFT' : 'PUBLISHED'
    };
    
    let result;
    
    // Insert or update based on reviewId
    if (reviewId) {
      // Update existing review
      const { data, error } = await supabase
        .from('reviews')
        .update(reviewData)
        .eq('id', reviewId)
        .eq('user_id', userId)
        .select();
        
      if (error) {
        console.error('Error updating review:', error);
        throw new Error(`Failed to update review: ${error.message}`);
      }
      
      result = data;
      console.log('Review updated successfully:', result);
    } else {
      // Insert new review
      const { data, error } = await supabase
        .from('reviews')
        .insert(reviewData)
        .select();
        
      if (error) {
        console.error('Error creating review:', error);
        throw new Error(`Failed to create review: ${error.message}`);
      }
      
      result = data;
      console.log('Review created successfully:', result);
    }
    
    return result;
  } catch (error) {
    console.error('Unexpected error:', error);
    if (error instanceof Error) {
      toast.error(error.message);
    } else {
      toast.error('Failed to submit review');
    }
    throw error;
  }
};
