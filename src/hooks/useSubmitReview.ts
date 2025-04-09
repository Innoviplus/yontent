import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useReviewForm, ReviewFormValues } from './review/useReviewForm';

export const useSubmitReview = (onSuccess?: () => void) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');
  const editId = searchParams.get('edit');
  const reviewId = draftId || editId || null;
  
  const [isLoading, setIsLoading] = useState(false);
  
  const {
    form,
    uploading,
    setUploading,
    selectedImages,
    imagePreviewUrls,
    imageError,
    existingImages,
    setExistingImages,
    setImagePreviewUrls,
    handleImageSelection,
    removeImage,
    setImageError,
    uploadImages
  } = useReviewForm();
  
  // Fetch the existing review if we're editing
  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId || !user) return;
      
      setIsLoading(true);
      try {
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', reviewId)
          .eq('user_id', user.id)
          .single();
          
        if (error) throw error;
        
        // Set form values
        form.setValue('content', data.content);
        
        // Set existing images
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
          setImagePreviewUrls(data.images);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
        toast.error('Failed to load review data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReview();
  }, [reviewId, user, form, setExistingImages, setImagePreviewUrls]);
  
  // Handle image reordering
  const reorderImages = (newOrder: string[]) => {
    setExistingImages(newOrder);
    setImagePreviewUrls(newOrder);
  };
  
  // Custom image selection handler that sets error if too many files are selected
  const handleImageSelectionWithValidation = (files: FileList | null) => {
    if (!files) {
      setImageError("You can only upload up to 10 images. Please select fewer images.");
      return;
    }
    
    // Otherwise use the regular handler
    handleImageSelection(files);
  };
  
  const handleSubmit = async (data: ReviewFormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    // Check for maximum image count
    const totalImageCount = selectedImages.length + existingImages.length;
    if (totalImageCount > 10) {
      setImageError(`You can only upload up to 10 images. Please remove ${totalImageCount - 10} images.`);
      return;
    }
    
    // For published reviews, validate that at least one image is selected or exists
    if (!data.isDraft && selectedImages.length === 0 && existingImages.length === 0) {
      setImageError("At least one image is required");
      return;
    }
    
    try {
      setUploading(true);
      
      const imagePaths = await uploadImages(user.id);
      
      // Update or create the review
      if (reviewId) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            content: data.content,
            images: imagePaths,
            status: data.isDraft ? 'DRAFT' : 'PUBLISHED',
            updated_at: new Date().toISOString()
          })
          .eq('id', reviewId);
          
        if (error) throw error;
        
        toast.success(data.isDraft ? 'Draft updated successfully!' : 'Review updated successfully!');
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: user.id,
            content: data.content,
            images: imagePaths,
            status: data.isDraft ? 'DRAFT' : 'PUBLISHED'
          });
          
        if (error) throw error;
        
        toast.success(data.isDraft ? 'Draft saved successfully!' : 'Review submitted successfully!');
      }
      
      navigate(data.isDraft ? '/dashboard' : '/reviews');
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
    
    // For drafts, allow empty content only if there are images
    if (values.content.length === 0 && selectedImages.length === 0 && existingImages.length === 0) {
      toast.error('Please add some content or images to save as draft');
      return;
    }
    
    handleSubmit(form.getValues());
  };
  
  return {
    form,
    uploading,
    isLoading,
    selectedImages,
    imagePreviewUrls,
    imageError,
    existingImages,
    isDraft: !!draftId,
    isEditing: !!reviewId,
    onSubmit: handleSubmit,
    saveDraft,
    handleImageSelection: handleImageSelectionWithValidation,
    removeImage,
    reorderImages,
    setImageError
  };
};
