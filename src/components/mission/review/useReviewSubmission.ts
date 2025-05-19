
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { reviewSchema, ReviewFormValues } from './ReviewFormSchema';
import { Mission } from '@/lib/types';

export const useReviewSubmission = (mission: Mission, userId: string) => {
  const navigate = useNavigate();
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  
  // Add video state
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoError, setVideoError] = useState<string | null>(null);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: {
      content: '',
    },
  });
  
  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    
    if (selectedImages.length + files.length > 10) {
      setImageError('You can only upload up to 10 images in total');
      return;
    }
    
    const newFiles = Array.from(files);
    setSelectedImages(prev => [...prev, ...newFiles]);
    
    newFiles.forEach(file => {
      const reader = new FileReader();
      reader.onloadend = () => {
        setImagePreviewUrls(prev => [...prev, reader.result as string]);
      };
      reader.readAsDataURL(file);
    });
    
    setImageError(null);
  };

  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Handle video selection
  const handleVideoSelection = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    
    // Only allow one video
    const videoFile = files[0];
    
    // Create preview URL
    const videoUrl = URL.createObjectURL(videoFile);
    
    setSelectedVideo(videoFile);
    setVideoPreviewUrl(videoUrl);
    setVideoError(null);
  };

  // Remove video
  const removeVideo = (index: number) => {
    if (videoPreviewUrl) {
      URL.revokeObjectURL(videoPreviewUrl);
    }
    
    setSelectedVideo(null);
    setVideoPreviewUrl('');
  };

  const onSubmit = async (values: ReviewFormValues) => {
    if (selectedImages.length === 0) {
      setImageError('Please upload at least one image');
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      // Upload each image to Supabase storage
      const uploadedImageUrls: string[] = [];
      
      for (const file of selectedImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `reviews/${userId}/${mission.id}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('missions')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('missions')
          .getPublicUrl(filePath);
          
        uploadedImageUrls.push(data.publicUrl);
      }
      
      // Upload video if selected
      let uploadedVideoUrl: string | null = null;
      
      if (selectedVideo) {
        const videoExt = selectedVideo.name.split('.').pop();
        const videoName = `video_${Math.random().toString(36).substring(2, 15)}.${videoExt}`;
        const videoPath = `reviews/${userId}/${mission.id}/${videoName}`;
        
        const { error: videoUploadError } = await supabase.storage
          .from('missions')
          .upload(videoPath, selectedVideo);
          
        if (videoUploadError) {
          throw videoUploadError;
        }
        
        const { data: videoData } = supabase.storage
          .from('missions')
          .getPublicUrl(videoPath);
          
        uploadedVideoUrl = videoData.publicUrl;
      }
      
      // Create a review in the reviews table
      const { data: reviewData, error: reviewError } = await supabase
        .from('reviews')
        .insert({
          user_id: userId,
          content: values.content,
          images: uploadedImageUrls,
          videos: uploadedVideoUrl ? [uploadedVideoUrl] : [],
          status: 'PUBLISHED'
        })
        .select('id')
        .single();
        
      if (reviewError) throw reviewError;
      
      // Save the participation record with the review ID
      const { error: insertError } = await supabase
        .from('mission_participations')
        .insert({
          mission_id: mission.id,
          user_id_p: userId,
          status: 'PENDING',
          submission_data: {
            review_id: reviewData.id,
            review_images: uploadedImageUrls,
            review_video: uploadedVideoUrl,
            submission_type: 'REVIEW'
          }
        });
        
      if (insertError) throw insertError;
      
      toast.success('Review submitted successfully!');
      navigate(`/mission/${mission.id}`);
    } catch (error) {
      console.error('Error submitting review:', error);
      toast.error('Failed to submit review. Please try again.');
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    form,
    isSubmitting,
    imagePreviewUrls,
    imageError,
    videoPreviewUrl,
    videoError,
    handleImageSelection,
    removeImage,
    handleVideoSelection,
    removeVideo,
    onSubmit
  };
};
