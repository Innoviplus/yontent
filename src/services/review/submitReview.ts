
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadReviewImage, uploadReviewVideo } from './uploadMedia';

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
  images: File[];
  videos?: File | null; 
  isDraft?: boolean;
  reviewId?: string | null;
}) => {
  try {
    // Upload and compress images
    const imageUrls: string[] = [];
    
    for (const image of images) {
      const imageUrl = await uploadReviewImage(userId, image);
      imageUrls.push(imageUrl);
    }
    
    // Upload and compress video if provided
    const videoUrls: string[] = [];
    
    if (videos) {
      const videoUrl = await uploadReviewVideo(userId, videos);
      videoUrls.push(videoUrl);
    }
    
    // Data to insert or update
    const reviewData = {
      user_id: userId,
      content,
      images: imageUrls,
      videos: videoUrls,
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
