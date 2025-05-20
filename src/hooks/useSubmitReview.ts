
import { useReviewForm } from './review/useReviewForm';
import { useReviewMedia } from './review/useReviewMedia';
import { useReviewFormState } from './review/useReviewFormState';
import { useReviewSubmitHandler } from './review/useReviewSubmitHandler';
import { toast } from 'sonner';
import { ReviewFormValues } from './review/useReviewForm';
import { useEffect, useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useSubmitReview = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const [isSavingDraft, setIsSavingDraft] = useState(false);
  
  // Get the review state first to access reviewContent and other draft data
  const {
    isLoading,
    isDraft,
    isEditing,
    reviewId,
    reviewContent,
    existingImages: loadedImages,
    existingVideo: loadedVideo
  } = useReviewFormState();
  
  // Create a single instance of the form hook with initial content
  const reviewForm = useReviewForm(reviewContent);
  const {
    form,
    setSelectedImages,
    setImagePreviewUrls,
    setImageError,
    setExistingImages,
    setSelectedVideo,
    setVideoPreviewUrl,
    setVideoError,
    setExistingVideo,
    setUploading
  } = reviewForm;
  
  // Initialize media with existing content from the database
  useEffect(() => {
    if (loadedImages && loadedImages.length > 0) {
      console.log('Setting existing images from database:', loadedImages);
      setExistingImages(loadedImages);
      setImagePreviewUrls(loadedImages);
    }
    
    if (loadedVideo) {
      console.log('Setting existing video from database:', loadedVideo);
      setExistingVideo(loadedVideo);
      setVideoPreviewUrl(loadedVideo);
    }
  }, [loadedImages, loadedVideo]);
  
  // Use the review media hook for handling uploads
  const {
    selectedImages,
    imagePreviewUrls,
    imageError,
    existingImages,
    handleImageSelection,
    removeImage,
    uploadImages,
    // Video related
    videoPreviewUrl,
    videoError,
    handleVideoSelection,
    removeVideo,
    uploadVideo,
    // Upload state
    uploading
  } = useReviewMedia(loadedImages, loadedVideo);
  
  // Import the handleSubmit function from useReviewSubmitHandler
  const { handleSubmit } = useReviewSubmitHandler(
    reviewId,
    uploadImages,
    uploadVideo
  );
  
  // Handle image reordering - no conditionals
  const reorderImages = (newOrder: string[]) => {
    console.log('Reordering images to:', newOrder);
    
    if (newOrder.length > 0) {
      console.log('Setting reordered images');
      setExistingImages(newOrder);
      setImagePreviewUrls(newOrder);
    }
  };
  
  // Custom image selection handler - no conditionals
  const handleImageSelectionWithValidation = (files: FileList | null) => {
    if (!files) {
      return;
    }
    
    if (files.length + imagePreviewUrls.length > 12) {
      setImageError("You can only upload up to 12 images. Please select fewer images.");
      return;
    }
    
    handleImageSelection(files);
  };
  
  // Save as draft functionality - no conditionals
  const saveDraft = async () => {
    const values = form.getValues();
    form.setValue('isDraft', true);
    
    if (!values.content && selectedImages.length === 0 && existingImages.length === 0 
        && !videoPreviewUrl) {
      toast.error('Please add some content, images, or video to save as draft');
      return;
    }
    
    setIsSavingDraft(true);
    try {
      await handleSubmit(form.getValues());
      toast.success('Draft saved successfully');
    } catch (error) {
      console.error('Error saving draft:', error);
      toast.error('Failed to save draft');
    } finally {
      setIsSavingDraft(false);
    }
  };
  
  // Form submission wrapper - no conditionals
  const onSubmit = async (data: ReviewFormValues) => {
    const totalImageCount = selectedImages.length + existingImages.length;
    if (totalImageCount > 12) {
      setImageError(`You can only upload up to 12 images. Please remove ${totalImageCount - 12} images.`);
      return;
    }
    
    if (!data.isDraft && !data.content && selectedImages.length === 0 && existingImages.length === 0 && !videoPreviewUrl) {
      setImageError("Please add some text, images, or video to your review");
      return;
    }
    
    await handleSubmit(data);
    if (onSuccess) onSuccess();
  };

  return {
    form,
    uploading,
    isLoading,
    isSavingDraft,
    selectedImages,
    imagePreviewUrls,
    imageError,
    existingImages,
    isDraft,
    isEditing,
    user,
    reviewContent,
    onSubmit,
    saveDraft,
    handleImageSelection: handleImageSelectionWithValidation,
    removeImage,
    reorderImages,
    setImageError,
    // Return videoPreviewUrl as a string array as expected by the VideoUpload component
    videoPreviewUrl: videoPreviewUrl ? [videoPreviewUrl] : [],
    videoError,
    handleVideoSelection,
    removeVideo,
    setVideoError
  };
};
