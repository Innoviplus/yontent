import { useState, useEffect } from 'react';
import { useSearchParams, useNavigate } from 'react-router-dom';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';

// Form validation schema
const reviewSchema = z.object({
  content: z.string().min(20, { message: "Review content must be at least 20 characters" }),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export const useSubmitReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');
  const editId = searchParams.get('edit');
  const reviewId = draftId || editId || null;
  
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: '',
    },
  });
  
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
  }, [reviewId, user, form]);
  
  const onSubmit = async (values: ReviewFormValues, isDraft: boolean = false) => {
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    // For published reviews, validate that at least one image is selected or exists
    if (!isDraft && selectedImages.length === 0 && existingImages.length === 0) {
      setImageError("At least one image is required");
      return;
    }
    
    try {
      setUploading(true);
      
      let imagePaths = [...existingImages];
      
      // Upload new images if there are any
      if (selectedImages.length > 0) {
        for (const file of selectedImages) {
          const fileExt = file.name.split('.').pop();
          const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
          const filePath = `${user.id}/${fileName}`;
          
          const { error: uploadError } = await supabase.storage
            .from('reviews')
            .upload(filePath, file);
            
          if (uploadError) {
            throw uploadError;
          }
          
          const { data } = supabase.storage
            .from('reviews')
            .getPublicUrl(filePath);
            
          imagePaths.push(data.publicUrl);
        }
      }
      
      // Update or create the review
      if (reviewId) {
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            content: values.content,
            images: imagePaths,
            status: isDraft ? 'DRAFT' : 'PUBLISHED',
            updated_at: new Date().toISOString()
          })
          .eq('id', reviewId);
          
        if (error) throw error;
        
        toast.success(isDraft ? 'Draft updated successfully!' : 'Review updated successfully!');
      } else {
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: user.id,
            content: values.content,
            images: imagePaths,
            status: isDraft ? 'DRAFT' : 'PUBLISHED'
          });
          
        if (error) throw error;
        
        toast.success(isDraft ? 'Draft saved successfully!' : 'Review submitted successfully!');
      }
      
      navigate(isDraft ? '/dashboard' : '/reviews');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };
  
  const saveDraft = () => {
    const values = form.getValues();
    
    // For drafts, allow empty content only if there are images
    if (values.content.length === 0 && selectedImages.length === 0 && existingImages.length === 0) {
      toast.error('Please add some content or images to save as draft');
      return;
    }
    
    onSubmit(values, true);
  };
  
  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    
    const newFiles = Array.from(files);
    setSelectedImages(prev => [...prev, ...newFiles]);
    
    // Generate preview URLs for selected images
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    // Clear any previous error
    setImageError(null);
  };
  
  const removeImage = (index: number) => {
    // If within the range of existing images, remove from existing
    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    } 
    // Otherwise, remove from newly selected images
    else {
      const newIndex = index - existingImages.length;
      setSelectedImages(prev => prev.filter((_, i) => i !== newIndex));
      setImagePreviewUrls(prev => {
        const newUrls = [...prev];
        newUrls.splice(index, 1);
        return newUrls;
      });
    }
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
    onSubmit,
    saveDraft,
    handleImageSelection,
    removeImage,
    setImageError
  };
};
