
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { toast } from 'sonner';
import { ExtendedProfile } from '@/lib/types';
import { profileFormSchema, ProfileFormValues } from '@/schemas/profileFormSchema';
import { useProfileFormInitialization } from './useProfileFormInitialization';
import { formatProfileFormValues, validateBirthDate } from '@/services/profile/profileFormService';
import { updateProfileData } from '@/services/profile/profileUpdateService';
import { supabase } from '@/integrations/supabase/client';

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

  // Initialize form with profile data when it becomes available
  useProfileFormInitialization(profileForm, userProfile);

  const onProfileSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdating(true);
    console.log("Submitting profile data:", values);
    console.log("Birth date:", values.birthDate);
    
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
      
      console.log("Saving extended data:", extendedData);
      
      // Use the updateProfileData service function
      const success = await updateProfileData(user.id, extendedData);
      
      if (success) {
        // Check if this is the first profile update and add welcome points if it is
        await checkFirstProfileUpdateAndAwardPoints(user.id);
        
        // Update local state
        setExtendedProfile(extendedData);
        
        // Show success notification
        toast.success('Profile updated successfully!');
        
        // Mark form as pristine to indicate data has been saved
        profileForm.reset(values, { keepValues: true });
      }
      
    } catch (error: any) {
      console.error("Profile update error:", error);
      toast.error("Update Failed: " + error.message);
    } finally {
      setIsUpdating(false);
    }
  };

  // Check if this is the first profile update and award welcome points
  const checkFirstProfileUpdateAndAwardPoints = async (userId: string) => {
    try {
      // Check if user has already received welcome points
      const { data: transactions, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', userId)
        .eq('type', 'WELCOME');
      
      if (error) {
        console.error('Error checking welcome points:', error);
        return;
      }
      
      // If no welcome points transaction exists, add welcome points
      if (transactions.length === 0) {
        console.log('Awarding welcome points for first profile update');
        
        // First, get current points
        const { data: profileData, error: profileError } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', userId)
          .single();
          
        if (profileError) {
          console.error('Error fetching current points:', profileError);
          return;
        }
        
        const currentPoints = profileData.points || 0;
        const newPoints = currentPoints + 10;
        
        // Update points in profile table
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ points: newPoints })
          .eq('id', userId);
          
        if (updateError) {
          console.error('Error updating points:', updateError);
          return;
        }
        
        // Add transaction record
        const { error: transactionError } = await supabase
          .from('point_transactions')
          .insert([
            {
              user_id: userId,
              amount: 10,
              type: 'WELCOME',
              description: 'Welcome bonus for completing profile'
            }
          ]);
          
        if (transactionError) {
          console.error('Error recording welcome points transaction:', transactionError);
          return;
        }
        
        toast.success('You received 10 welcome points for completing your profile!');
      }
    } catch (error) {
      console.error('Error in welcome points logic:', error);
    }
  };

  return {
    profileForm,
    onProfileSubmit
  };
};
