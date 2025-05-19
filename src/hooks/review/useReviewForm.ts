
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState } from 'react';

// Form schema with isDraft property and optional content
export const reviewFormSchema = z.object({
  content: z.string().optional().default(''),
  isDraft: z.boolean().optional().default(false)
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const useReviewForm = () => {
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      content: '',
      isDraft: false
    },
  });

  // Image state
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  // Video state
  const [selectedVideo, setSelectedVideo] = useState<File | null>(null);
  const [videoPreviewUrl, setVideoPreviewUrl] = useState<string>('');
  const [videoError, setVideoError] = useState<string | null>(null);
  const [existingVideo, setExistingVideo] = useState<string | null>(null);
  
  // Upload state
  const [uploading, setUploading] = useState(false);

  return {
    form,
    // Image related
    selectedImages,
    setSelectedImages,
    imagePreviewUrls,
    setImagePreviewUrls,
    imageError,
    setImageError,
    existingImages,
    setExistingImages,
    // Video related
    selectedVideo,
    setSelectedVideo,
    videoPreviewUrl,
    setVideoPreviewUrl,
    videoError,
    setVideoError,
    existingVideo,
    setExistingVideo,
    // Upload state
    uploading,
    setUploading
  };
};
