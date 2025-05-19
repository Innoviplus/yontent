
import { useReviewForm } from './review/useReviewForm';
import { useReviewMedia } from './review/useReviewMedia';
import { useReviewFormState } from './review/useReviewFormState';
import { useReviewSubmitHandler } from './review/useReviewSubmitHandler';
import { toast } from 'sonner';
import { ReviewFormValues } from './review/useReviewForm';

export const useSubmitReview = (onSuccess?: () => void) => {
  const {
    form,
  } = useReviewForm();
  
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
  
  const {
    isLoading,
    isDraft,
    isEditing,
    reviewId
  } = useReviewFormState();
  
  const {
    handleSubmit
  } = useReviewSubmitHandler(reviewId, uploadImages, uploadVideo);
  
  // Handle image reordering
  const reorderImages = (newOrder: string[]) => {
    existingImages.splice(0, existingImages.length, ...newOrder);
    imagePreviewUrls.splice(0, imagePreviewUrls.length, ...newOrder);
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
    removeVideo: () => removeVideo(),
    setVideoError
  };
};
