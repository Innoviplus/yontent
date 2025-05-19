
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
      
      // Update or create the review
      if (reviewId) {
        console.log('Updating existing review:', reviewId);
        // Update existing review
        const { error } = await supabase
          .from('reviews')
          .update({
            content: reviewContent,
            images: imagePaths,
            videos: videoPaths,
            status: data.isDraft ? 'DRAFT' : 'PUBLISHED',
            updated_at: new Date().toISOString()
          })
          .eq('id', reviewId);
          
        if (error) {
          console.error('Error updating review:', error);
          throw error;
        }
        
        toast.success(data.isDraft ? 'Draft updated successfully!' : 'Review updated successfully!');
      } else {
        console.log('Creating new review');
        // Create new review
        const { error } = await supabase
          .from('reviews')
          .insert({
            user_id: user.id,
            content: reviewContent,
            images: imagePaths,
            videos: videoPaths,
            status: data.isDraft ? 'DRAFT' : 'PUBLISHED'
          });
          
        if (error) {
          console.error('Error creating review:', error);
          throw error;
        }
        
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

  return {
    uploading,
    setUploading,
    handleSubmit
  };
};
