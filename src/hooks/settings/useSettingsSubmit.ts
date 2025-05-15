
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
    if (!user) {
      console.error("User not authenticated");
      toast({
        title: "Authentication Error",
        description: "You must be logged in to update your profile",
        variant: "destructive",
      });
      return;
    }
    
    setIsSubmitting(true);
    
    try {
      console.log("Processing profile update with values:", values);
      const profileData = prepareProfileData(values);
      
      console.log("Using user ID:", user.id);
      const success = await updateProfileData(user.id, profileData);
      
      if (success) {
        debounceToast(() => {
          sonnerToast.success('Your profile has been updated');
        }, 300);
      } else {
        throw new Error('Failed to update profile');
      }
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast({
        title: "Update Failed",
        description: error.message || "Could not update profile",
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
