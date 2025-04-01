
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
  
  const handleFormSubmit = async (data: Partial<Mission>, files: { 
    merchantLogo?: File | null, 
    bannerImage?: File | null 
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
    
    // Clean HTML content if needed
    if (updatedData.requirementDescription) {
      console.log('Requirements HTML before submission:', updatedData.requirementDescription);
    }
    
    if (updatedData.termsConditions) {
      console.log('Terms HTML before submission:', updatedData.termsConditions);
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
