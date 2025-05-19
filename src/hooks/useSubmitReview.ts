
import { useReviewForm } from './review/useReviewForm';
import { useReviewMedia } from './review/useReviewMedia';
import { useReviewFormState } from './review/useReviewFormState';
import { useReviewSubmitHandler } from './review/useReviewSubmitHandler';
import { toast } from 'sonner';
import { ReviewFormValues } from './review/useReviewForm';
import { useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';

export const useSubmitReview = (onSuccess?: () => void) => {
  const { user } = useAuth();
  
  // Get the review state first to access reviewContent
  const {
    isLoading,
    isDraft,
    isEditing,
    reviewId,
    reviewContent
  } = useReviewFormState();
  
  // Then pass reviewContent to useReviewForm
  const {
    form,
  } = useReviewForm(reviewContent);
  
  const {
    selectedImages,
    imagePreviewUrls,
    imageError,
    existingImages,
    setImageError,
    handleImageSelection,
    removeImage,
    uploadImages,
    // Video related
    videoPreviewUrl,
    videoError,
    handleVideoSelection,
    removeVideo,
    setVideoError,
    uploadVideo,
    // Upload state
    uploading,
    setUploading
  } = useReviewMedia();
  
  // Import the handleSubmit function from useReviewSubmitHandler
  const { handleSubmit } = useReviewSubmitHandler(
    reviewId,
    uploadImages,
    uploadVideo
  );
  
  // Log loaded data for debugging
  useEffect(() => {
    if (isEditing) {
      const formContent = form.getValues('content');
      console.log('Edit mode detected with data:', {
        reviewId,
        content: reviewContent && reviewContent.length > 0 
          ? reviewContent.substring(0, 50) + '...' 
          : (formContent && formContent.length > 0 
              ? formContent.substring(0, 50) + '...' 
              : 'No content'),
        imageCount: imagePreviewUrls.length,
        hasVideo: !!videoPreviewUrl,
        isDraft
      });
      
      // Try to set the content directly if needed
      if (reviewContent && (!formContent || formContent.length === 0)) {
        console.log('Setting form content directly in useSubmitReview');
        form.setValue('content', reviewContent);
      }
    }
  }, [isEditing, form, imagePreviewUrls, videoPreviewUrl, isDraft, reviewId, reviewContent]);
  
  // Handle image reordering
  const reorderImages = (newOrder: string[]) => {
    console.log('Reordering images to:', newOrder);
    
    // Simply update the arrays with the new order
    const newExistingImages = [...newOrder];
    const newImagePreviewUrls = [...newOrder];
    
    if (existingImages.length !== newOrder.length) {
      console.warn('Image arrays length mismatch during reordering:', {
        existingImagesLength: existingImages.length,
        newOrderLength: newOrder.length
      });
    }
    
    // This ensures we keep the arrays synchronized
    if (newOrder.length > 0) {
      console.log('Setting reordered images');
      // Use the setter functions to update the state
      useReviewMedia().setExistingImages(newExistingImages);
      useReviewMedia().setImagePreviewUrls(newImagePreviewUrls);
    }
  };
  
  // Custom image selection handler that sets error if too many files are selected
  const handleImageSelectionWithValidation = (files: FileList | null) => {
    if (!files) {
      return;
    }
    
    if (files.length + imagePreviewUrls.length > 12) {
      setImageError("You can only upload up to 12 images. Please select fewer images.");
      return;
    }
    
    // Otherwise use the regular handler
    handleImageSelection(files);
  };
  
  // Save as draft functionality - make content optional for draft
  const saveDraft = () => {
    const values = form.getValues();
    form.setValue('isDraft', true);
    
    // For drafts, require at least one of: content, images, or video
    if (!values.content && selectedImages.length === 0 && existingImages.length === 0 
        && !videoPreviewUrl) {
      toast.error('Please add some content, images, or video to save as draft');
      return;
    }
    
    handleSubmit(form.getValues());
  };
  
  // Form submission wrapper
  const onSubmit = async (data: ReviewFormValues) => {
    // Check for maximum image count
    const totalImageCount = selectedImages.length + existingImages.length;
    if (totalImageCount > 12) {
      setImageError(`You can only upload up to 12 images. Please remove ${totalImageCount - 12} images.`);
      return;
    }
    
    // For published reviews, only require images if content is empty
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
