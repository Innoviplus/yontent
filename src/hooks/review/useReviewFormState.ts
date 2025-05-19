
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useReviewForm } from './useReviewForm';
import { useReviewMedia } from './useReviewMedia';

export const useReviewFormState = () => {
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get('draft') || searchParams.get('edit');
  
  const [isLoading, setIsLoading] = useState<boolean>(!!reviewId);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(!!reviewId);
  
  const {
    form,
    setImagePreviewUrls,
    setExistingImages,
    setVideoPreviewUrl,
    setExistingVideo
  } = useReviewForm();
  
  // Load review data if in edit mode
  useEffect(() => {
    const loadReviewData = async () => {
      if (!reviewId) return;
      
      try {
        console.log('Loading review data for ID:', reviewId);
        setIsLoading(true);
        
        const { data: review, error } = await supabase
          .from('reviews')
          .select('*')
          .eq('id', reviewId)
          .single();
          
        if (error) {
          console.error('Error loading review:', error);
          throw error;
        }
        
        if (review) {
          console.log('Loaded review data:', review);
          
          // Set form values
          form.setValue('content', review.content || '');
          
          // Set draft state
          const isDraftReview = review.status === 'DRAFT';
          setIsDraft(isDraftReview);
          form.setValue('isDraft', isDraftReview);
          
          // Set images
          if (review.images && Array.isArray(review.images)) {
            setExistingImages(review.images);
            setImagePreviewUrls(review.images);
          }
          
          // Set videos
          if (review.videos && Array.isArray(review.videos) && review.videos.length > 0) {
            setExistingVideo(review.videos[0]);
            setVideoPreviewUrl(review.videos[0]);
          }
        }
      } catch (error) {
        console.error('Error in loadReviewData:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadReviewData();
  }, [reviewId, form]);
  
  return {
    isLoading,
    isDraft,
    isEditing,
    reviewId
  };
};
