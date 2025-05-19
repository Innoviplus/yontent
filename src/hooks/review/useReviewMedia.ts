
import { useState } from 'react';
import { uploadReviewImage, uploadReviewVideo } from '@/services/review/uploadMedia';

export const useReviewMedia = () => {
  // Image state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Video state
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);
  
  // Upload state
  const [uploading, setUploading] = useState(false);
  
  // Handle image selection
  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    
    // Check for maximum image count (12 total)
    if (selectedImages.length + existingImages.length + files.length > 12) {
      setImageError('You can only upload up to 12 images in total');
      return;
    }
    
    const newFiles = Array.from(files);
    setSelectedImages(prev => [...prev, ...newFiles]);
    
    // Create preview URLs for each new image
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    setImageError(null);
  };

  // Remove image (either from selected or existing)
  const removeImage = (index: number) => {
    // Get total count of all images
    const totalImageUrls = [...imagePreviewUrls];
    
    if (index >= 0 && index < totalImageUrls.length) {
      // Check if we're removing from existing images
      if (index < existingImages.length) {
        const newExistingImages = [...existingImages];
        newExistingImages.splice(index, 1);
        setExistingImages(newExistingImages);
      } else {
        // Removing from newly selected images
        const selectedIndex = index - existingImages.length;
        const newSelectedImages = [...selectedImages];
        newSelectedImages.splice(selectedIndex, 1);
        setSelectedImages(newSelectedImages);
      }
      
      // Update the preview URLs
      const newImagePreviewUrls = [...imagePreviewUrls];
      newImagePreviewUrls.splice(index, 1);
      setImagePreviewUrls(newImagePreviewUrls);
    }
  };

  // Handle video selection
  const handleVideoSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // Only allow one video
    const videoFile = files[0];
    
    // Create preview URL
    const videoUrl = URL.createObjectURL(videoFile);
    
    setSelectedVideo(videoFile);
    setVideoPreviewUrl(videoUrl);
    setVideoError(null);
    
    // Clear existing video if there was one
    if (existingVideo) {
      setExistingVideo(null);
    }
  };

  // Remove video
  const removeVideo = () => {
    if (videoPreviewUrl && !existingVideo) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    
    setSelectedVideo(null);
    setVideoPreviewUrl('');
    setExistingVideo(null);
  };

  // Upload images to storage
  const uploadImages = async (userId: string) => {
    let imagePaths = [...existingImages];
    
    if (selectedImages.length > 0) {
      for (const image of selectedImages) {
        try {
          const imageUrl = await uploadReviewImage(userId, image);
          imagePaths.push(imageUrl);
        } catch (error) {
          console.error("Error uploading image:", error);
          throw error;
        }
      }
    }
    
    return imagePaths;
  };

  // Upload video to storage
  const uploadVideo = async (userId: string) => {
    let videoPaths: string[] = [];
    
    if (existingVideo) {
      videoPaths.push(existingVideo);
    }
    
    if (selectedVideo) {
      try {
        const videoUrl = await uploadReviewVideo(userId, selectedVideo);
        videoPaths = [videoUrl]; // Replace existing video path if any
      } catch (error) {
        console.error("Error uploading video:", error);
        throw error;
      }
    }
    
    return videoPaths;
  };

  return {
    // Image related
    selectedImages,
    existingImages,
    setExistingImages,
    imagePreviewUrls,
    setImagePreviewUrls,
    imageError,
    setImageError,
    handleImageSelection,
    removeImage,
    // Video related
    selectedVideo,
    existingVideo,
    setExistingVideo,
    videoPreviewUrl,
    setVideoPreviewUrl,
    videoError,
    setVideoError,
    handleVideoSelection,
    removeVideo,
    // Upload related
    uploading,
    setUploading,
    uploadImages,
    uploadVideo
  };
};
