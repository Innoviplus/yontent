
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useState, useEffect } from 'react';

// Form schema with isDraft property and optional content
export const reviewFormSchema = z.object({
  content: z.string().optional().default(''),
  isDraft: z.boolean().optional().default(false)
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const useReviewForm = (initialContent?: string) => {
  // Initialize form with resolver and default values
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      content: initialContent || '',
      isDraft: false
    },
    mode: 'onChange'
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
  
  // Debug logging for form values - always present
  useEffect(() => {
    const subscription = form.watch((value) => {
      console.log('Form values changed:', value);
    });
    
    return () => subscription.unsubscribe();
  }, [form]);
  
  // Save form state to sessionStorage to prevent loss - always present
  useEffect(() => {
    try {
      // Get form values
      const formValues = form.getValues();
      const content = formValues.content;
      
      if (content && content.length > 0) {
        // Only save if there's actual content
        console.log('Saving form state to sessionStorage');
        sessionStorage.setItem('reviewFormContent', content);
      }
    } catch (e) {
      console.error('Error saving form state:', e);
    }
  }, [form.watch('content')]);

  // Set content when initialContent changes - always present
  useEffect(() => {
    if (initialContent && initialContent.trim().length > 0) {
      console.log('Setting form content with initial value:', initialContent.substring(0, 50) + '...');
      form.setValue('content', initialContent);
    }
  }, [initialContent, form]);

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
