
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { useReviewForm } from './useReviewForm';
import { toast } from 'sonner';

export const useReviewFormState = () => {
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get('draft') || searchParams.get('edit');
  
  const [isLoading, setIsLoading] = useState<boolean>(!!reviewId);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(!!reviewId);
  const [reviewContent, setReviewContent] = useState<string>('');
  
  const { 
    form, 
    setImagePreviewUrls, 
    setExistingImages,
    setVideoPreviewUrl,
    setExistingVideo
  } = useReviewForm(reviewContent);
  
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
          toast.error('Error loading review data');
          throw error;
        }
        
        if (review) {
          console.log('Loaded review data from DB:', review);
          
          // Set the content state
          if (review.content) {
            setReviewContent(review.content);
          }
          
          // Set draft state
          const isDraftReview = review.status === 'DRAFT';
          setIsDraft(isDraftReview);
          
          // Handle images - ensure arrays are properly initialized
          if (review.images && Array.isArray(review.images) && review.images.length > 0) {
            console.log('Setting images:', review.images);
            setExistingImages(review.images);
            setImagePreviewUrls(review.images);
          } else {
            console.log('No images to set');
            // Reset the image arrays when there are no images
            setExistingImages([]);
            setImagePreviewUrls([]);
          }
          
          // Handle videos - ensure arrays are properly initialized
          if (review.videos && Array.isArray(review.videos) && review.videos.length > 0) {
            console.log('Setting video:', review.videos[0]);
            setExistingVideo(review.videos[0]);
            setVideoPreviewUrl(review.videos[0]);
          } else {
            console.log('No videos to set');
            // Reset video state when there's no video
            setExistingVideo(null);
            setVideoPreviewUrl('');
          }
        } else {
          console.warn('No review found with ID:', reviewId);
          toast.error('Review not found');
        }
      } catch (error) {
        console.error('Error in loadReviewData:', error);
      } finally {
        setIsLoading(false);
      }
    };
    
    if (reviewId) {
      console.log('Initializing review data loading for ID:', reviewId);
      loadReviewData();
    }
  }, [reviewId, setExistingImages, setImagePreviewUrls, setExistingVideo, setVideoPreviewUrl]);
  
  return {
    isLoading,
    isDraft,
    isEditing,
    reviewId,
    reviewContent
  };
};
