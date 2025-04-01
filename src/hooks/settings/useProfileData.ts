
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
          
          // If user email isn't in the profile yet, update it
          if ((!data.email || data.email === '') && user?.email) {
            const { error: updateError } = await supabase
              .from('profiles')
              .update({ email: user.email })
              .eq('id', user.id);
              
            if (updateError) {
              console.error('Error updating user email:', updateError);
            }
          }
          
          settingsForm.reset({
            email: data.email || user?.email || '',
            phoneNumber: data.phone_number || extData.phoneNumber || '',
            phoneCountryCode: data.phone_country_code || '',
            country: extData.country || '',
          });
        }
      };
      
      loadExtendedProfile();
    }
  }, [userProfile, user, profileForm, settingsForm, setAvatarUrl, setExtendedProfile]);
};
