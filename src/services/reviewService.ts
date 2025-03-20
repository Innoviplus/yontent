
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const trackReviewView = async (reviewId: string) => {
  try {
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

export const submitReview = async ({ 
  userId, 
  content, 
  images 
}: { 
  userId: string; 
  content: string; 
  images: File[] 
}) => {
  try {
    // Upload images
    const imageUrls: string[] = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      const { error: uploadError } = await supabase
        .storage
        .from('review-images')
        .upload(filePath, image);
        
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error('Failed to upload image');
      }
      
      const { data: publicURL } = supabase
        .storage
        .from('review-images')
        .getPublicUrl(filePath);
        
      if (publicURL) {
        imageUrls.push(publicURL.publicUrl);
      }
    }
    
    // Insert review
    const { error: insertError } = await supabase
      .from('reviews')
      .insert({
        user_id: userId,
        content,
        images: imageUrls,
        views_count: 0,
        likes_count: 0
      });
      
    if (insertError) {
      console.error('Error creating review:', insertError);
      throw new Error('Failed to create review');
    }
    
    return true;
  } catch (error) {
    console.error('Unexpected error:', error);
    toast.error('Failed to submit review');
    throw error;
  }
};
