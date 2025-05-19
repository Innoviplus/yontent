
import { supabase } from '@/integrations/supabase/client';
import imageCompression from 'browser-image-compression';
import heic2any from 'heic2any';

// Compress image before upload
export const uploadReviewImage = async (userId: string, image: File): Promise<string> => {
  try {
    let processedImage = image;
    
    // Convert HEIC to JPEG if needed
    if (image.name.toLowerCase().endsWith('.heic') || image.type === 'image/heic') {
      console.log('Converting HEIC image to JPEG');
      try {
        const blob = await heic2any({
          blob: image,
          toType: 'image/jpeg',
          quality: 0.8
        });
        
        // Convert blob or blob array to a File object
        const jpegBlob = Array.isArray(blob) ? blob[0] : blob;
        processedImage = new File([jpegBlob], image.name.replace(/\.heic$/i, '.jpg'), { 
          type: 'image/jpeg' 
        });
        console.log('Successfully converted HEIC to JPEG');
      } catch (conversionError) {
        console.error('Error converting HEIC image:', conversionError);
        throw new Error('Failed to convert HEIC image format. Please upload JPG or PNG images instead.');
      }
    }
    
    // Compress the image
    const compressionOptions = {
      maxSizeMB: 1, // Max file size in MB
      maxWidthOrHeight: 1920, // Max width/height in pixels
      useWebWorker: true, // Use web workers for better performance
      fileType: processedImage.type // Keep original file type
    };
    
    console.log('Original image size:', (processedImage.size / 1024).toFixed(2), 'KB');
    const compressedImage = await imageCompression(processedImage, compressionOptions);
    console.log('Compressed image size:', (compressedImage.size / 1024).toFixed(2), 'KB');
    
    // Generate filename and path
    const fileExt = compressedImage.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload the compressed image
    const { error: uploadError } = await supabase
      .storage
      .from('review-images')
      .upload(filePath, compressedImage, {
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
  } catch (error) {
    console.error('Error in uploadReviewImage:', error);
    throw error;
  }
};

// Upload video to storage
export const uploadReviewVideo = async (userId: string, video: File): Promise<string> => {
  try {
    console.log(`Starting video upload: ${video.name} (${(video.size / (1024 * 1024)).toFixed(2)} MB)`);
    
    // Generate filename and path
    const fileExt = video.name.split('.').pop();
    const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    const filePath = `${userId}/${fileName}`;
    
    // Upload the video directly (no compression for now)
    console.log(`Uploading video to path: ${filePath}`);
    const { error: uploadError } = await supabase
      .storage
      .from('review-videos')
      .upload(filePath, video, {
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
      .getPublicUrl(filePath);
      
    if (!publicURL) {
      throw new Error('Failed to get public URL for uploaded video');
    }
    
    console.log(`Video successfully uploaded, URL: ${publicURL.publicUrl}`);
    return publicURL.publicUrl;
  } catch (error) {
    console.error('Error in uploadReviewVideo:', error);
    throw error;
  }
};
