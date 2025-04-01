
import { useSettingsState } from './settings/useSettingsState';
import { useAvatarUpload } from './settings/useAvatarUpload';
import { useProfileForm } from './settings/useProfileForm';
import { useAccountActions } from './settings/useAccountActions';
import { useProfileData } from './settings/useProfileData';
import { useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useSettings = () => {
  const {
    user,
    userProfile,
    signOut,
    avatarUrl,
    setAvatarUrl,
    uploading,
    setUploading,
    isUpdating,
    setIsUpdating,
    activeTab,
    setActiveTab,
    extendedProfile,
    setExtendedProfile,
    navigate
  } = useSettingsState();

  const { handleAvatarUpload } = useAvatarUpload(user, setAvatarUrl, setUploading);
  
  const { profileForm, onProfileSubmit } = useProfileForm(
    user, 
    userProfile, 
    extendedProfile, 
    setExtendedProfile, 
    setIsUpdating
  );
  
  // Use the settings form hook - Fix: The useSettingsForm hook doesn't return these properties
  const { 
    form: settingsForm, 
    activeTab: formActiveTab, // Renamed to avoid conflict
    setActiveTab: setFormActiveTab, // Renamed to avoid conflict
    handleResetPassword
  } = useProfileData(); // Use the correct hook
  
  const { handleDeleteAccount, handleLogout } = useAccountActions(
    user, 
    signOut, 
    navigate
  );

  // Load profile data
  const { updateProfileData } = useProfileData();

  // Debugging - log critical objects
  useEffect(() => {
    console.log('useSettings hook initialized with:', {
      user: !!user,
      userProfile: !!userProfile,
      profileForm: !!profileForm,
      settingsForm: !!settingsForm
    });
  }, [user, userProfile, profileForm, settingsForm]);

  return {
    user,
    userProfile,
    avatarUrl,
    uploading,
    isUpdating,
    activeTab,
    setActiveTab,
    extendedProfile,
    profileForm,
    settingsForm,
    handleAvatarUpload,
    onProfileSubmit,
    // Fix: Use the correct properties from the hook
    onSettingsSubmit: updateProfileData,
    handleResetPassword,
    handleDeleteAccount,
    handleLogout,
  };
};
