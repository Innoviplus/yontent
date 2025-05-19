
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { supabase } from '@/integrations/supabase/client';
import { ReviewFormValues } from './useReviewForm';

export const useReviewSubmitHandler = (
  reviewId: string | null,
  uploadImages: (userId: string) => Promise<string[]>,
  uploadVideo: (userId: string) => Promise<string[]>
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (data: ReviewFormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }
    
    try {
      setUploading(true);
      console.log('Starting review submission process...', {
        isUpdate: !!reviewId,
        isDraft: data.isDraft,
      });
      
      const imagePaths = await uploadImages(user.id);
      console.log('Image paths after upload:', imagePaths);
      
      const videoPaths = await uploadVideo(user.id);
      console.log('Video paths after upload:', videoPaths);
      
      // Content is now optional, using empty string as default
      const reviewContent = data.content || '';
      
      // Add proper object structure for insert/update
      const reviewData = {
        content: reviewContent,
        images: imagePaths,
        videos: videoPaths,
        status: data.isDraft ? 'DRAFT' : 'PUBLISHED',
        updated_at: new Date().toISOString()
      };
      
      console.log('Preparing to save review data:', reviewData);
      
      // Update or create the review
      if (reviewId) {
        console.log('Updating existing review:', reviewId);
        // Update existing review
        const { data: updatedData, error } = await supabase
          .from('reviews')
          .update(reviewData)
          .eq('id', reviewId)
          .select();
          
        if (error) {
          console.error('Error updating review:', error);
          throw error;
        }
        
        console.log('Review updated successfully:', updatedData);
        toast.success(data.isDraft ? 'Draft updated successfully!' : 'Review updated successfully!');
      } else {
        console.log('Creating new review');
        // Create new review with the user ID
        const newReviewData = {
          ...reviewData,
          user_id: user.id
        };
        
        const { data: insertedData, error } = await supabase
          .from('reviews')
          .insert(newReviewData)
          .select();
          
        if (error) {
          console.error('Error creating review:', error);
          throw error;
        }
        
        console.log('Review created successfully:', insertedData);
        toast.success(data.isDraft ? 'Draft saved successfully!' : 'Review submitted successfully!');
      }
      
      navigate(data.isDraft ? '/dashboard' : '/reviews');
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return {
    uploading,
    setUploading,
    handleSubmit
  };
};
