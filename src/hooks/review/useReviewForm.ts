
import { useState } from 'react';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

// Form validation schema
export const reviewSchema = z.object({
  content: z.string().min(20, { message: "Review content must be at least 20 characters" }),
});

export type ReviewFormValues = z.infer<typeof reviewSchema>;

export const useReviewForm = (initialValues: { content: string } = { content: '' }) => {
  const [uploading, setUploading] = useState(false);
  const [selectedImages, setSelectedImages] = useState<File[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [imageError, setImageError] = useState<string | null>(null);
  const [existingImages, setExistingImages] = useState<string[]>([]);
  
  const form = useForm<ReviewFormValues>({
    resolver: zodResolver(reviewSchema),
    defaultValues: initialValues,
  });

  // Handle image selection
  const handleImageSelection = (files: FileList | null) => {
    if (!files) return;
    
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
  
  // Remove an image
  const removeImage = (index: number) => {
    if (index < existingImages.length) {
      setExistingImages(prev => prev.filter((_, i) => i !== index));
      setImagePreviewUrls(prev => prev.filter((_, i) => i !== index));
    } 
    else {
      const newIndex = index - existingImages.length;
      setSelectedImages(prev => prev.filter((_, i) => i !== newIndex));
      setImagePreviewUrls(prev => {
        const newUrls = [...prev];
        newUrls.splice(index, 1);
        return newUrls;
      });
    }
  };

  // Upload images to Supabase
  const uploadImages = async (userId: string) => {
    let imagePaths = [...existingImages];
    
    // Upload new images if there are any
    if (selectedImages.length > 0) {
      for (const file of selectedImages) {
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `${userId}/${fileName}`;
        
        const { error: uploadError } = await supabase.storage
          .from('reviews')
          .upload(filePath, file);
          
        if (uploadError) {
          throw uploadError;
        }
        
        const { data } = supabase.storage
          .from('reviews')
          .getPublicUrl(filePath);
          
        imagePaths.push(data.publicUrl);
      }
    }
    
    return imagePaths;
  };

  return {
    form,
    uploading,
    setUploading,
    selectedImages,
    setSelectedImages,
    imagePreviewUrls,
    setImagePreviewUrls,
    imageError,
    setImageError,
    existingImages,
    setExistingImages,
    handleImageSelection,
    removeImage,
    uploadImages
  };
};
