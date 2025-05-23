
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ExtendedProfile } from '@/lib/types';
import { profileFormSchema, ProfileFormValues } from '@/schemas/profileFormSchema';
import { useProfileFormInitialization } from './settings/useProfileFormInitialization';
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
      console.log('Checking for welcome points eligibility for user:', userId);
      
      // First check if point_transactions table exists
      const { error: tableCheckError } = await supabase
        .from('point_transactions')
        .select('id', { count: 'exact', head: true })
        .limit(1);
        
      if (tableCheckError) {
        console.warn('Point transactions table may not exist yet:', tableCheckError.message);
        return; // Exit early if table doesn't exist
      }
      
      try {
        // Call the Supabase function
        const { data, error } = await supabase.rpc(
          'check_and_award_welcome_points',
          { user_id_param: userId }
        );
        
        if (error) {
          console.error('Error checking welcome points:', error);
          return;
        }
        
        console.log('Welcome points check response:', data);
        
        // Check if points were awarded successfully
        if (data && typeof data === 'object' && 'success' in data && data.success) {
          toast.success('You received 100 welcome points for updating your profile!');
          
          // Refresh points to update UI
          await refreshPoints();
        } else if (data && typeof data === 'object' && 'message' in data) {
          // Log the message but don't show it to the user if points weren't awarded
          console.log('Welcome points status:', data.message);
        }
      } catch (rpcError) {
        console.error('RPC error in welcome points check:', rpcError);
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
        
        try {
          // Check for welcome points after successful profile update
          // Add a small delay to ensure database triggers have completed
          setTimeout(() => checkWelcomePoints(user.id), 500);
        } catch (pointsError) {
          console.error("Error checking welcome points:", pointsError);
          // Don't fail the whole operation if points check fails
        }
        
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
