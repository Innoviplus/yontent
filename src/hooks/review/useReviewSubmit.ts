
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useReviewForm, ReviewFormValues } from './useReviewForm';
import { submitReview } from '@/services/review';

export const useReviewSubmit = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);
  
  const {
    form,
    selectedImages,
    imagePreviewUrls,
    imageError,
    existingImages,
    setImageError,
    // Video related properties
    selectedVideo,
    videoPreviewUrl,
    videoError,
    existingVideo,
    setVideoError
  } = useReviewForm();
  
  // Submit the review
  const handleSubmit = async (data: ReviewFormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    // For published reviews, validate that at least one image is required
    if (!data.isDraft && selectedImages.length === 0 && existingImages.length === 0) {
      setImageError("At least one image is required");
      return;
    }
    
    // Check for maximum image count
    const totalImageCount = selectedImages.length + existingImages.length;
    if (totalImageCount > 10) {
      setImageError(`You can only upload up to 10 images. Please remove ${totalImageCount - 10} images.`);
      return;
    }
    
    try {
      setUploading(true);
      
      const success = await submitReview({
        userId: user.id,
        content: data.content,
        images: selectedImages,
        videos: selectedVideo,
        isDraft: data.isDraft
      });
      
      if (success) {
        toast.success(data.isDraft ? 'Draft saved successfully!' : 'Review submitted successfully!');
        
        if (onSuccess) {
          onSuccess();
        } else {
          navigate(data.isDraft ? '/dashboard' : '/reviews');
        }
      }
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };
  
  const saveDraft = () => {
    const values = form.getValues();
    form.setValue('isDraft', true);
    
    // For drafts, allow empty content only if there are images or videos
    if (values.content.length === 0 && selectedImages.length === 0 && existingImages.length === 0 
        && !selectedVideo && !existingVideo) {
      toast.error('Please add some content, images, or video to save as draft');
      return;
    }
    
    handleSubmit(form.getValues());
  };
  
  return {
    form,
    uploading,
    handleSubmit,
    saveDraft
  };
};
