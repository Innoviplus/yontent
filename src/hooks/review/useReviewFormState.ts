
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
  const { 
    form, 
    setExistingImages, 
    setImagePreviewUrls, 
    setExistingVideo, 
    setVideoPreviewUrl 
  } = useReviewForm();

  // Fetch the existing review if we're editing
  useEffect(() => {
    const fetchReview = async () => {
      if (!reviewId || !user) {
        console.log('No reviewId or user, skipping fetch', { reviewId, userId: user?.id });
        return;
      }
      
      console.log('Fetching review data for:', reviewId, 'user:', user.id);
      setIsLoading(true);
      
      try {
        // Fetch the review with a specific ID belonging to the current user
        const { data, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', reviewId)
          .eq('user_id', user.id)
          .single();
          
        if (error) {
          console.error('Error fetching review data:', error);
          toast.error('Failed to load review data');
          return;
        }
        
        console.log('Retrieved review data:', data);
        
        if (!data) {
          console.error('No review data found for ID:', reviewId);
          toast.error('Review not found');
          return;
        }
        
        // Set form values - ensure content is properly handled
        form.setValue('content', data.content || '');
        console.log('Setting form content:', data.content || '');
        
        // Set draft status
        if (data.status === 'DRAFT') {
          console.log('Setting isDraft to true');
          form.setValue('isDraft', true);
        }
        
        // Set existing images
        if (data.images && data.images.length > 0) {
          console.log('Setting images:', data.images);
          setExistingImages(data.images);
          setImagePreviewUrls(data.images);
        } else {
          console.log('No images to set');
          setExistingImages([]);
          setImagePreviewUrls([]);
        }
        
        // Set existing video
        if (data.videos && data.videos.length > 0 && data.videos[0]) {
          console.log('Setting video:', data.videos[0]);
          setExistingVideo(data.videos[0]);
          setVideoPreviewUrl(data.videos[0]);
        } else {
          console.log('No video to set');
          setExistingVideo(null);
          setVideoPreviewUrl('');
        }
      } catch (error) {
        console.error('Unexpected error fetching review:', error);
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
