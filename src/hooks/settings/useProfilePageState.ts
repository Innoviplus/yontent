
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';
import { ProfileFormValues } from '@/schemas/profileFormSchema';

export const useProfilePageState = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const [formSuccess, setFormSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  const handleProfileSubmit = async (values: ProfileFormValues, onProfileSubmit: (values: ProfileFormValues) => Promise<void>, profileForm: any) => {
    if (!user) return;
    
    setIsLoading(true);
    setFormSuccess(false);
    
    try {
      await onProfileSubmit(values);
      await refreshUserProfile();
      
      setFormSuccess(true);
      toast.success('Profile updated successfully');
      
      // Ensure form is marked as pristine after successful submission
      profileForm.reset(values, { keepValues: true, keepDirty: false });
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };

  return {
    formSuccess,
    isLoading,
    loadingAttempts,
    initialLoadComplete,
    setIsLoading,
    setLoadingAttempts,
    setInitialLoadComplete,
    handleProfileSubmit
  };
};
