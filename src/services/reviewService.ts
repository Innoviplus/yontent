
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
  images,
  isDraft = false 
}: { 
  userId: string; 
  content: string; 
  images: File[];
  isDraft?: boolean;
}) => {
  try {
    // Upload images
    const imageUrls: string[] = [];
    
    for (const image of images) {
      const fileExt = image.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${userId}/${fileName}`;
      
      // Upload the image to the review-images bucket
      const { error: uploadError, data } = await supabase
        .storage
        .from('review-images')
        .upload(filePath, image, {
          cacheControl: '3600',
          upsert: false
        });
        
      if (uploadError) {
        console.error('Error uploading image:', uploadError);
        throw new Error(`Failed to upload image: ${uploadError.message}`);
      }
      
      // Get the public URL of the uploaded image
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
