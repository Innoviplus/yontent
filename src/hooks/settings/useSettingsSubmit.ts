
import { useState } from 'react';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';
import { useProfileData } from './useProfileData';
import { SettingsFormValues } from '@/schemas/settingsFormSchema';
import { prepareProfileData } from '@/services/profile/profileSubmitService';

// Add debounce utility to prevent multiple toast notifications
const createDebouncer = () => {
  let timeout: NodeJS.Timeout | null = null;
  return (fn: Function, delay: number) => {
    if (timeout) clearTimeout(timeout);
    timeout = setTimeout(() => {
      timeout = null;
      fn();
    }, delay);
  };
};

const debounceToast = createDebouncer();

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
        debounceToast(() => {
          sonnerToast.success('Your profile has been updated');
        }, 300);
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
