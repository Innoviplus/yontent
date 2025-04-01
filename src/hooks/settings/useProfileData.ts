
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { ExtendedProfile } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';

export const useProfileData = (
  user: any, 
  userProfile: any,
  setAvatarUrl: (url: string | null) => void,
  setExtendedProfile: (profile: ExtendedProfile | null) => void,
  profileForm: UseFormReturn<any>,
  settingsForm: UseFormReturn<any>
) => {
  useEffect(() => {
    if (userProfile) {
      // Ensure avatar URL is set
      setAvatarUrl(userProfile.avatar || null);
      
      // Load extended profile data if available
      const loadExtendedProfile = async () => {
        if (!user) return;
        
        try {
          const { data, error } = await supabase
            .from('profiles')
            .select('extended_data, phone_country_code, phone_number, avatar, email')
            .eq('id', user.id)
            .single();
            
          if (error) {
            console.error('Error fetching extended profile:', error);
            return;
          }
          
          if (data) {
            console.log('Profile data loaded:', data);
            
            // Make sure avatar URL is set from profile data
            if (data.avatar) {
              setAvatarUrl(data.avatar);
            }
            
            const extData = data.extended_data as ExtendedProfile || {};
            setExtendedProfile(extData);
            
            profileForm.reset({
              username: userProfile.username || '',
              firstName: extData.firstName || '',
              lastName: extData.lastName || '',
              bio: extData.bio || '',
              gender: extData.gender || '',
              birthDate: extData.birthDate ? new Date(extData.birthDate) : undefined,
              websiteUrl: extData.websiteUrl || '',
              facebookUrl: extData.facebookUrl || '',
              instagramUrl: extData.instagramUrl || '',
              youtubeUrl: extData.youtubeUrl || '',
              tiktokUrl: extData.tiktokUrl || '',
            });
            
            // Set the phone number in the settings form
            // - First try phone_number from the profiles table
            // - Then fall back to extended_data.phoneNumber if present
            const phoneNumber = data.phone_number || extData.phoneNumber || '';
            
            // Prioritize the dedicated email column, then fall back to extended_data.email
            const email = data.email || extData.email || user?.email || '';
            
            settingsForm.reset({
              email: email,
              phoneNumber: phoneNumber,
              phoneCountryCode: data.phone_country_code || '+1',
              country: extData.country || '',
            });
            
            console.log('Set email in form to:', email);
            console.log('Set phone in form to:', phoneNumber);
          }
        } catch (fetchErr) {
          console.error('Error in loadExtendedProfile:', fetchErr);
        }
      };
      
      loadExtendedProfile();
    }
  }, [userProfile, user, profileForm, settingsForm, setAvatarUrl, setExtendedProfile]);
};
