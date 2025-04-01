
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

export const useAvatarUpload = (
  user: any,
  setAvatarUrl: (url: string | null) => void,
  setUploading: (uploading: boolean) => void
) => {
  const { toast } = useToast();
  
  // Track whether a toast was already shown
  let toastShown = false;

  const handleAvatarUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    try {
      if (!event.target.files || event.target.files.length === 0) {
        return;
      }
      
      const file = event.target.files[0];
      const fileExt = file.name.split('.').pop();
      const fileName = `${Math.random().toString(36).substring(2)}.${fileExt}`;
      const filePath = `${user?.id}/${fileName}`;
      
      setUploading(true);
      toastShown = false; // Reset toast state for new upload
      
      // Upload file to storage
      const { error: uploadError } = await supabase.storage
        .from('avatars')
        .upload(filePath, file);
        
      if (uploadError) {
        throw uploadError;
      }
      
      // Get public URL
      const { data: urlData } = supabase.storage
        .from('avatars')
        .getPublicUrl(filePath);
        
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ avatar: urlData.publicUrl })
        .eq('id', user?.id);
        
      if (updateError) {
        throw updateError;
      }
      
      setAvatarUrl(urlData.publicUrl);
      
      if (!toastShown) {
        sonnerToast.success('Avatar updated successfully!');
        toastShown = true;
      }
    } catch (error: any) {
      toast({
        title: "Upload Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setUploading(false);
    }
  };

  return { handleAvatarUpload };
};
