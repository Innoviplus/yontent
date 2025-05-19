
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { ReviewFormValues } from './useReviewForm';
import { submitReview } from '@/services/review';

export const useReviewSubmitHandler = (
  reviewId: string | null,
  uploadImages: (userId: string) => Promise<string[]>,
  uploadVideo: (userId: string) => Promise<string[]>
) => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const [uploading, setUploading] = useState(false);

  const handleSubmit = async (formData: ReviewFormValues) => {
    if (!user) {
      toast.error('You must be logged in to submit a review');
      return;
    }

    setUploading(true);
    try {
      console.log('Preparing to submit review:', {
        reviewId,
        isDraft: formData.isDraft,
        contentLength: formData.content?.length || 0
      });

      // 1. Upload images and video
      const uploadedImageUrls = await uploadImages(user.id);
      const uploadedVideoUrls = await uploadVideo(user.id);

      console.log('Uploads complete:', {
        imageCount: uploadedImageUrls.length,
        videoCount: uploadedVideoUrls.length
      });

      // 2. Submit review to database
      const result = await submitReview({
        userId: user.id,
        content: formData.content || '',
        images: [],  // We only pass the File objects to uploadImages, not here
        videos: null,  // We only pass the File object to uploadVideo, not here
        isDraft: formData.isDraft || false,
        reviewId: reviewId
      });

      console.log('Review submission result:', result);

      // 3. Show success message and redirect
      const actionText = formData.isDraft ? 'saved as draft' : (reviewId ? 'updated' : 'published');
      toast.success(`Review ${actionText} successfully!`);

      // 4. Redirect based on context
      if (formData.isDraft) {
        navigate('/dashboard?tab=drafts');
      } else {
        navigate('/reviews');
      }
    } catch (error) {
      console.error('Error in review submission:', error);
      toast.error('Failed to submit review');
    } finally {
      setUploading(false);
    }
  };

  return {
    handleSubmit,
    uploading
  };
};
