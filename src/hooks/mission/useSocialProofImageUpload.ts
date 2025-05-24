
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

interface UseSocialProofImageUploadProps {
  userId: string;
  missionId: string;
  onImagesChange: (images: string[]) => void;
}

export const useSocialProofImageUpload = ({ userId, missionId, onImagesChange }: UseSocialProofImageUploadProps) => {
  const [uploadedImages, setUploadedImages] = useState<string[]>([]);
  const [imagePreviewUrls, setImagePreviewUrls] = useState<string[]>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFileSelect = async (files: FileList | null) => {
    if (!files || files.length === 0) {
      setError('Please select at least one image');
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const uploadedUrls: string[] = [];
      const previewUrls: string[] = [];

      for (const file of Array.from(files)) {
        // Create preview URL
        previewUrls.push(URL.createObjectURL(file));

        // Upload to Supabase
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `social-proof/${userId}/${missionId}/${fileName}`;

        const { error: uploadError } = await supabase.storage
          .from('missions')
          .upload(filePath, file);

        if (uploadError) {
          throw uploadError;
        }

        const { data } = supabase.storage
          .from('missions')
          .getPublicUrl(filePath);

        uploadedUrls.push(data.publicUrl);
      }

      const newUploadedImages = [...uploadedImages, ...uploadedUrls];
      const newPreviewUrls = [...imagePreviewUrls, ...previewUrls];
      
      setUploadedImages(newUploadedImages);
      setImagePreviewUrls(newPreviewUrls);
      onImagesChange(newUploadedImages);
    } catch (error: any) {
      console.error('Error uploading images:', error);
      setError('Failed to upload images');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveImage = (index: number) => {
    const newPreviewUrls = imagePreviewUrls.filter((_, i) => i !== index);
    const newUploadedImages = uploadedImages.filter((_, i) => i !== index);
    
    setImagePreviewUrls(newPreviewUrls);
    setUploadedImages(newUploadedImages);
    onImagesChange(newUploadedImages);
  };

  const resetImages = () => {
    setUploadedImages([]);
    setImagePreviewUrls([]);
    onImagesChange([]);
  };

  return {
    uploadedImages,
    imagePreviewUrls,
    uploading,
    error,
    handleFileSelect,
    handleRemoveImage,
    resetImages
  };
};
