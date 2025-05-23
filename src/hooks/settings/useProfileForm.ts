
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ExtendedProfile } from '@/lib/types';
import { profileFormSchema, ProfileFormValues } from '@/schemas/profileFormSchema';
import { useProfileFormInitialization } from './useProfileFormInitialization';
import { formatProfileFormValues, validateBirthDate } from '@/services/profile/profileFormService';
import { updateProfileData } from '@/services/profile/profileUpdateService';
import { supabase } from '@/integrations/supabase/client';
import { usePoints } from '@/contexts/PointsContext';

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

export const useProfileForm = (
  user: any, 
  userProfile: any, 
  extendedProfile: ExtendedProfile | null,
  setExtendedProfile: (profile: ExtendedProfile | null) => void,
  setIsUpdating: (updating: boolean) => void
) => {
  const profileForm = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userProfile?.username || '',
      email: userProfile?.email || user?.email || '',
      firstName: '',
      lastName: '',
      bio: '',
      gender: '',
      birthDate: undefined,
      websiteUrl: '',
      facebookUrl: '',
      instagramUrl: '',
      youtubeUrl: '',
      tiktokUrl: '',
      phoneNumber: userProfile?.phone_number || '',
    },
  });
  
  const { refreshPoints } = usePoints();

  // Initialize form with profile data when it becomes available
  useProfileFormInitialization(profileForm, userProfile);

  // Function to check and award welcome points if needed
  const checkWelcomePoints = async (userId: string) => {
    if (!userId) return;
    
    try {
      // Define the response type structure and the parameters type
      type WelcomePointsResponse = {
        success: boolean;
        message: string;
        points_awarded?: number;
      };
      
      type WelcomePointsParams = {
        user_id_param: string;
      };
      
      // Use the correct format for RPC call with 2 generic parameters:
      // First parameter is the return type, second is the params type
      const { data, error } = await supabase.rpc<WelcomePointsResponse, WelcomePointsParams>(
        'check_and_award_welcome_points',
        { user_id_param: userId }
      );
      
      if (error) {
        console.error('Error checking welcome points:', error);
        return;
      }
      
      // Type guard to ensure data has the expected structure
      if (data && typeof data === 'object' && 'success' in data && data.success) {
        toast.success('You received 100 welcome points for updating your profile!');
        // Refresh points to update UI
        await refreshPoints();
      }
    } catch (error) {
      console.error('Error in welcome points check:', error);
    }
  };

  const onProfileSubmit = async (values: ProfileFormValues) => {
    if (!user) {
      toast.error("You must be logged in to update your profile");
      return;
    }
    
    setIsUpdating(true);
    console.log("Submitting profile data:", values);
    
    try {
      // Validate birthdate
      if (values.birthDate && !validateBirthDate(values.birthDate)) {
        toast.error("You must be at least 18 years old");
        setIsUpdating(false);
        return;
      }
      
      // Get current extended profile data to preserve other fields
      const currentExtendedProfile = extendedProfile || {};
      
      // Format and merge profile data
      const extendedData = formatProfileFormValues(values, currentExtendedProfile);
      
      console.log("Saving extended data with user ID:", user.id);
      console.log("Extended data:", extendedData);
      
      // Use the updateProfileData service function
      const success = await updateProfileData(user.id, extendedData);
      
      if (success) {
        // Update local state
        setExtendedProfile(extendedData);
        
        // Check for welcome points after successful profile update
        await checkWelcomePoints(user.id);
        
        // Use debounced toast to prevent duplicates
        debounceToast(() => {
          toast.success('Profile updated successfully!');
        }, 300);
        
        // Mark form as pristine to indicate data has been saved
        profileForm.reset(values, { keepValues: true });
      } else {
        throw new Error("Failed to update profile data");
      }
      
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error(`Update Failed: ${error.message || "Unknown error"}`);
    } finally {
      setIsUpdating(false);
    }
  };

  return {
    profileForm,
    onProfileSubmit
  };
};
