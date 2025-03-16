
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

interface SubmitReviewParams {
  userId: string;
  content: string;
  images: File[];
}

export const uploadImages = async (userId: string, images: File[]): Promise<string[]> => {
  if (!userId || images.length === 0) return [];
  
  const uploadedUrls: string[] = [];
  
  for (const image of images) {
    const fileExt = image.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    const { error: uploadError, data } = await supabase.storage
      .from('reviews')
      .upload(filePath, image);
    
    if (uploadError) {
      console.error('Error uploading image:', uploadError);
      toast.error('Failed to upload an image');
      continue;
    }
    
    // Get public URL for the uploaded image
    const { data: { publicUrl } } = supabase.storage
      .from('reviews')
      .getPublicUrl(filePath);
    
    uploadedUrls.push(publicUrl);
  }
  
  return uploadedUrls;
};

export const submitReview = async ({ userId, content, images }: SubmitReviewParams) => {
  // Upload images first
  const imageUrls = await uploadImages(userId, images);
  
  if (imageUrls.length === 0) {
    throw new Error('Failed to upload images');
  }
  
  // Insert the review into the database
  const { error } = await supabase
    .from('reviews')
    .insert({
      user_id: userId,
      product_name: "Review", // Default value since we're not collecting product name
      rating: 5, // Default value since we're not collecting rating
      content,
      images: imageUrls,
    });
    
  if (error) {
    console.error('Error submitting review:', error);
    throw new Error('Failed to submit review');
  }
  
  return { success: true };
};
