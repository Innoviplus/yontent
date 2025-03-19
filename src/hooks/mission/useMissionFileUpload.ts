
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useMissionFileUpload = () => {
  const [uploading, setUploading] = useState(false);

  const uploadFile = async (file: File, fieldName: string): Promise<string | null> => {
    if (!file) return null;
    
    try {
      setUploading(true);
      
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${fileName}`;
      
      const { error: uploadError } = await supabase.storage
        .from('missions')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      const { data: urlData } = supabase.storage
        .from('missions')
        .getPublicUrl(filePath);
        
      toast.success('File uploaded successfully!');
      return urlData.publicUrl;
    } catch (error: any) {
      toast.error('Error uploading file: ' + error.message);
      console.error('File upload error:', error);
      return null;
    } finally {
      setUploading(false);
    }
  };

  return {
    uploadFile,
    uploading
  };
};
