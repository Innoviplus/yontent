
import { useState } from 'react';
import { toast } from 'sonner';
import { ProfileFormValues } from '@/schemas/profileFormSchema';
import { UseFormReturn } from 'react-hook-form';

export const useProfilePageState = () => {
  const [isLoading, setIsLoading] = useState(true);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  const [initialLoadComplete, setInitialLoadComplete] = useState(false);

  // Handle submit for profile form
  const handleProfileSubmit = async (
    values: ProfileFormValues, 
    onProfileSubmit: (values: ProfileFormValues) => Promise<void>,
    profileForm: UseFormReturn<any>
  ) => {
    try {
      console.log("useProfilePageState - handleProfileSubmit called with values:", values);
      
      await onProfileSubmit(values);
      
      // Reset form state to indicate values have been saved
      profileForm.reset(values, { keepValues: true, keepDirty: false });
      
      // Slight delay to allow the UI to update
      setTimeout(() => {
        if (!profileForm.formState.isDirty) {
          console.log("Form marked as clean after save");
        }
      }, 100);
    } catch (error: any) {
      console.error("Error saving profile:", error);
      toast.error(`Failed to save: ${error?.message || "Unknown error"}`);
    }
  };

  return {
    isLoading,
    setIsLoading,
    loadingAttempts,
    setLoadingAttempts,
    initialLoadComplete,
    setInitialLoadComplete,
    handleProfileSubmit
  };
};
