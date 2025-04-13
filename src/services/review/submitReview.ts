
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { uploadReviewImage, uploadReviewVideo } from './uploadMedia';

export const submitReview = async ({ 
  userId, 
  content, 
  images,
  videos, 
  isDraft = false 
}: { 
  userId: string; 
  content: string; 
  images: File[];
  videos?: File | null; 
  isDraft?: boolean;
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
    
    // Insert review
    const { error: insertError } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        content,
        images: imageUrls,
        videos: videoUrls,
        views_count: 0,
        likes_count: 0,
        status: isDraft ? 'DRAFT' : 'PUBLISHED'
      });
      
    if (insertError) {
      console.error('Error creating review:', insertError);
      throw new Error(`Failed to create review: ${insertError.message}`);
    }
    
    return true;
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
