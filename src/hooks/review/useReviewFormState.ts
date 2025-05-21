
import { useState, useEffect } from 'react';
import { useSearchParams } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useReviewFormState = () => {
  const [searchParams] = useSearchParams();
  const reviewId = searchParams.get('draft') || searchParams.get('edit') || window.location.pathname.split('/edit-review/')[1];
  
  const [isLoading, setIsLoading] = useState<boolean>(!!reviewId);
  const [isDraft, setIsDraft] = useState<boolean>(false);
  const [isEditing, setIsEditing] = useState<boolean>(!!reviewId);
  const [reviewContent, setReviewContent] = useState<string>('');
  const [existingImages, setExistingImages] = useState<string[]>([]);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);
  
  // Load review data if in edit mode
  useEffect(() => {
    const loadReviewData = async () => {
      if (!reviewId) {
        setIsLoading(false);
        return;
      }
      
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
            console.log('Setting review content:', review.content.substring(0, 50) + '...');
            setReviewContent(review.content);
          }
          
          // Set images if they exist
          if (review.images && review.images.length > 0) {
            console.log('Setting existing images:', review.images);
            setExistingImages(review.images);
          }
          
          // Set video if it exists
          if (review.videos && review.videos.length > 0) {
            console.log('Setting existing video:', review.videos[0]);
            setExistingVideo(review.videos[0]);
          }
          
          // Set draft state
          const isDraftReview = review.status === 'DRAFT';
          setIsDraft(isDraftReview);
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
      loadReviewData();
    } else {
      setIsLoading(false);
    }
  }, [reviewId]);
  
  return {
    isLoading,
    isDraft,
    isEditing,
    reviewId,
    reviewContent,
    existingImages,
    existingVideo
  };
};
