
import { supabase } from '@/integrations/supabase/client';

export const uploadReviewImage = async (userId: string, image: File): Promise<string> => {
  const fileExt = image.name.split('.').pop();
  const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  const filePath = `${userId}/${fileName}`;
  
  // Upload the image to the review-images bucket
  const { error: uploadError } = await supabase
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
    
  if (!publicURL) {
    throw new Error('Failed to get public URL for uploaded image');
  }
  
  return publicURL.publicUrl;
};

export const uploadReviewVideo = async (userId: string, video: File): Promise<string> => {
  const fileExt = video.name.split('.').pop();
  const fileName = `${userId}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
  
  // Upload the video to the review-videos bucket
  const { error: uploadError } = await supabase
    .storage
    .from('review-videos')
    .upload(fileName, video, {
      cacheControl: '3600',
      upsert: false
    });
    
  if (uploadError) {
    console.error('Error uploading video:', uploadError);
    throw new Error(`Failed to upload video: ${uploadError.message}`);
  }
  
  // Get the public URL of the uploaded video
  const { data: publicURL } = supabase
    .storage
    .from('review-videos')
    .getPublicUrl(fileName);
    
  if (!publicURL) {
    throw new Error('Failed to get public URL for uploaded video');
  }
  
  return publicURL.publicUrl;
};
