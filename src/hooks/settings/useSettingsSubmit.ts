
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from './useProfileData';
import { SettingsFormValues } from '@/schemas/settingsFormSchema';
import { prepareProfileData } from '@/services/profile/profileSubmitService';

export const useSettingsSubmit = () => {
  const { user } = useAuth();
  const { toast } = useToast();
  const { updateProfileData } = useProfileData();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const onSubmit = async (values: SettingsFormValues) => {
    if (!user) return;
    
    setIsSubmitting(true);
    
    try {
      const profileData = prepareProfileData(values);
      const success = await updateProfileData(profileData);
      
      if (success) {
        sonnerToast.success('Your profile has been updated');
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return {
    onSubmit,
    isSubmitting
  };
};
