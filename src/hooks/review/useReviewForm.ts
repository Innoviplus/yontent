
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { supabase } from '@/integrations/supabase/client';

// Form schema with isDraft property
export const reviewFormSchema = z.object({
  content: z.string().min(10, { message: "Review must be at least 10 characters" }),
  isDraft: z.boolean().optional().default(false)
});

export type ReviewFormValues = z.infer<typeof reviewFormSchema>;

export const useReviewForm = () => {
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);

  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewFormSchema),
    defaultValues: {
      content: '',
      isDraft: false
    },
  });

  // Handle image selection
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

  // Remove image
  const removeImage = (index: number) => {
    setSelectedImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
  };

  // Upload images function
  const uploadImages = async (userId: string): Promise<string[]> => {
    const imagePaths = [...existingImages];
    
    // Upload new images if any
    if (selectedImages.length > 0) {
      for (const image of selectedImages) {
        const fileExt = image.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        
        const { error: uploadError } = await supabase
          .storage
          .from('review-images')
          .upload(filePath, image, {
            cacheControl: '3600',
            upsert: false
          });
          
        if (uploadError) {
          console.error('Error uploading image:', uploadError);
          throw new Error(`Failed to upload image: ${uploadError.message}`);
        }
        
        const { data: publicURL } = supabase
          .storage
          .from('review-images')
          .getPublicUrl(filePath);
          
        if (publicURL) {
          imagePaths.push(publicURL.publicUrl);
        }
      }
    }
    
    return imagePaths;
  };

  return {
    form,
    uploading,
    setUploading,
    selectedImages,
    imagePreviewUrls,
    imageError,
    existingImages,
    setExistingImages,
    setImagePreviewUrls,
    handleImageSelection,
    removeImage,
    setImageError,
    uploadImages
  };
};
