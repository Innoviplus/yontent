
import { Mission } from '@/lib/types';
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MissionForm from './form/MissionForm';

interface MissionFormWrapperProps {
  mission?: Mission;
  isAdding: boolean;
  onSubmit: (data: Partial<Mission>) => Promise<boolean>;
  onCancel: () => void;
}

const MissionFormWrapper = ({ 
  mission, 
  isAdding, 
  onSubmit, 
  onCancel 
}: MissionFormWrapperProps) => {
  const [isUploading, setIsUploading] = useState(false);
  
  if (!isAdding && !mission) return null;
  
  const title = isAdding ? "Add New Mission" : "Edit Mission";
  
  const uploadImage = async (file: File, path: string): Promise<string | null> => {
    if (!file) return null;
    
    setIsUploading(true);
    try {
      // Create a unique file name
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
      const filePath = `${path}/${fileName}`;
      
      // Upload the file to Supabase storage
      const { error: uploadError } = await supabase.storage
        .from('missions')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get the public URL
      const { data } = supabase.storage
        .from('missions')
        .getPublicUrl(filePath);
        
      return data.publicUrl;
    } catch (error: any) {
      console.error('Error uploading image:', error.message);
      toast.error('Failed to upload image.');
      return null;
    } finally {
      setIsUploading(false);
    }
  };

  const uploadMultipleImages = async (files: File[]): Promise<string[]> => {
    if (!files?.length) return [];
    
    setIsUploading(true);
    try {
      const uploadedUrls: string[] = [];
      
      for (const file of files) {
        // Create a unique file name
        const fileExt = file.name.split('.').pop();
        const fileName = `${Math.random().toString(36).substring(2, 15)}.${fileExt}`;
        const filePath = `products/${fileName}`;
        
        // Upload the file to Supabase storage
        const { error: uploadError } = await supabase.storage
          .from('missions')
          .upload(filePath, file);
          
        if (uploadError) {
          console.error('Error uploading image:', uploadError.message);
          continue; // Skip this file and try the next one
        }
        
        // Get the public URL
        const { data } = supabase.storage
          .from('missions')
          .getPublicUrl(filePath);
          
        if (data.publicUrl) {
          uploadedUrls.push(data.publicUrl);
        }
      }
      
      return uploadedUrls;
    } catch (error: any) {
      console.error('Error uploading images:', error.message);
      toast.error('Some images failed to upload.');
      return [];
    } finally {
      setIsUploading(false);
    }
  };
  
  const handleFormSubmit = async (data: Partial<Mission>, files: { 
    merchantLogo?: File | null, 
    bannerImage?: File | null,
    productImages?: File[] | null
  }) => {
    // Handle file uploads first if there are any
    let updatedData = { ...data };
    
    if (files.merchantLogo) {
      const logoUrl = await uploadImage(files.merchantLogo, 'logos');
      if (logoUrl) {
        updatedData.merchantLogo = logoUrl;
      }
    }
    
    if (files.bannerImage) {
      const bannerUrl = await uploadImage(files.bannerImage, 'banners');
      if (bannerUrl) {
        updatedData.bannerImage = bannerUrl;
      }
    }
    
    if (files.productImages && files.productImages.length > 0) {
      const productImageUrls = await uploadMultipleImages(files.productImages);
      if (productImageUrls.length > 0) {
        // Combine with any existing product images if we're editing
        let existingImages: string[] = [];
        if (mission?.productImages) {
          existingImages = mission.productImages;
        }
        updatedData.productImages = [...existingImages, ...productImageUrls];
      }
    }
    
    // Clean HTML content if needed
    if (updatedData.requirementDescription) {
      console.log('Requirements HTML before submission:', updatedData.requirementDescription);
    }
    
    if (updatedData.termsConditions) {
      console.log('Terms HTML before submission:', updatedData.termsConditions);
    }

    if (updatedData.completionSteps) {
      console.log('Completion steps HTML before submission:', updatedData.completionSteps);
    }
    
    if (updatedData.productDescription) {
      console.log('Product description HTML before submission:', updatedData.productDescription);
    }
    
    // Then submit the form data with the uploaded image URLs
    return onSubmit(updatedData);
  };
  
  return (
    <MissionForm 
      mission={mission}
      onSubmit={handleFormSubmit}
      onCancel={onCancel}
      title={title}
      isUploading={isUploading}
    />
  );
};

export default MissionFormWrapper;
