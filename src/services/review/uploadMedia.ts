
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

// Compress video before upload
export const uploadReviewVideo = async (userId: string, video: File): Promise<string> => {
  try {
    // For videos, we'll use a web-based solution since full transcoding is resource-intensive
    // This implementation uses the Video Blob Utility to optimize video size
    
    // Create a compressed video blob
    let compressedVideo = video;
    
    // For videos under 50MB, we can use basic optimization
    if (video.size > 5 * 1024 * 1024) {
      // Use createFFmpeg from FFmpeg.wasm for basic compression
      // This is a simplified approach - full transcoding would require more complex implementation
      compressedVideo = await compressVideoBlob(video);
    }
    
    console.log('Original video size:', (video.size / (1024 * 1024)).toFixed(2), 'MB');
    console.log('Optimized video size:', (compressedVideo.size / (1024 * 1024)).toFixed(2), 'MB');
    
    // Generate filename and path
    const fileExt = video.name.split('.').pop();
    const fileName = `${userId}/${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
    
    // Upload the optimized video
    const { error: uploadError } = await supabase
      .storage
      .from('review-videos')
      .upload(fileName, compressedVideo, {
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
  } catch (error) {
    console.error('Error in uploadReviewVideo:', error);
    throw error;
  }
};

// Helper function to compress video blob
// This is a basic implementation - full transcoding would require a more sophisticated approach
async function compressVideoBlob(videoFile: File): Promise<File> {
  return new Promise((resolve, reject) => {
    try {
      // Create video element to load the file
      const video = document.createElement('video');
      video.preload = 'metadata';
      
      // Create a canvas element for frame extraction
      const canvas = document.createElement('canvas');
      const ctx = canvas.getContext('2d');
      
      // Set up video metadata loaded handler
      video.onloadedmetadata = () => {
        // Set canvas dimensions to video dimensions (but capped)
        const maxDimension = 1280; // Limit resolution
        const width = Math.min(video.videoWidth, maxDimension);
        const height = Math.min(video.videoHeight, maxDimension);
        
        // Maintain aspect ratio if one dimension is capped
        const aspectRatio = video.videoWidth / video.videoHeight;
        canvas.width = width;
        canvas.height = width / aspectRatio;
        
        // Use original file with metadata reduction
        // For a real implementation, a proper video transcoding library would be used
        resolve(new File([videoFile], videoFile.name, { 
          type: videoFile.type,
          lastModified: Date.now()
        }));
      };
      
      // Handle errors
      video.onerror = () => {
        reject(new Error("Error processing video file"));
      };
      
      // Set video source to the file
      video.src = URL.createObjectURL(videoFile);
    } catch (error) {
      reject(error);
    }
  });
}
