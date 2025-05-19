
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { useReviewForm } from './useReviewForm';

export const useReviewFormState = () => {
  const { user } = useAuth();
  const [searchParams] = useSearchParams();
  const draftId = searchParams.get('draft');
  const editId = searchParams.get('edit');
  const reviewId = draftId || editId || null;
  
  const [isLoading, setIsLoading] = useState(false);
  const { form, setExistingImages, setImagePreviewUrls, setExistingVideo, setVideoPreviewUrl } = useReviewForm();

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
        
        // Set existing video
        if (data.videos && data.videos.length > 0) {
          setExistingVideo(data.videos[0]);
          setVideoPreviewUrl(data.videos[0]);
        }
      } catch (error) {
        console.error('Error fetching review:', error);
        toast.error('Failed to load review data');
      } finally {
        setIsLoading(false);
      }
    };
    
    fetchReview();
  }, [reviewId, user, form, setExistingImages, setImagePreviewUrls, setExistingVideo, setVideoPreviewUrl]);

  return {
    isLoading,
    isDraft: !!draftId,
    isEditing: !!reviewId,
    reviewId
  };
};
