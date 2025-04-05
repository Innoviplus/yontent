
import { useState, useEffect } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useReviewForm, ReviewFormValues } from './useReviewForm';

export const useEditReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  const [loading, setLoading] = useState(true);
  
  const {
    form,
    uploading,
    setUploading,
    imagePreviewUrls,
    imageError,
    setExistingImages,
    setImagePreviewUrls,
    handleImageSelection,
    removeImage,
    uploadImages
  } = useReviewForm();

  // Fetch the review data
  useEffect(() => {
    if (!user) {
      navigate('/login');
      return;
    }

    const fetchReview = async () => {
      if (!id) return;
      
      try {
        setLoading(true);
        
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          toast.error('Failed to load review');
          navigate('/dashboard');
          return;
        }
        
        if (!data) {
          toast.error('Review not found');
          navigate('/dashboard');
          return;
        }
        
        form.setValue('content', data.content);
        
        if (data.images && data.images.length > 0) {
          setExistingImages(data.images);
          setImagePreviewUrls(data.images);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
        toast.error('Failed to load review data');
      } finally {
        setLoading(false);
      }
    };
    
    fetchReview();
  }, [id, user, navigate, form, setExistingImages, setImagePreviewUrls]);
  
  // Handle image reordering
  const reorderImages = (newOrder: string[]) => {
    setExistingImages(newOrder);
    setImagePreviewUrls(newOrder);
  };
  
  // Submit the updated review
  const onSubmit = async (values: ReviewFormValues) => {
    if (!user || !id) {
      toast.error('You must be logged in to update a review');
      return;
    }
    
    try {
      setUploading(true);
      
      const imagePaths = await uploadImages(user.id);
      
      const { error } = await supabase
        .from('reviews')
        .update({
          content: values.content,
          images: imagePaths,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
        
      if (error) throw error;
      
      toast.success('Review updated successfully!');
      navigate(`/review/${id}`);
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setUploading(false);
    }
  };

  return {
    form,
    loading,
    uploading,
    imagePreviewUrls,
    imageError,
    user,
    onSubmit,
    handleImageSelection,
    removeImage,
    reorderImages
  };
};
