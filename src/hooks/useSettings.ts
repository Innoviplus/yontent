
import { useSettingsState } from './settings/useSettingsState';
import { useAvatarUpload } from './settings/useAvatarUpload';
import { useProfileForm } from './settings/useProfileForm';
import { useAccountActions } from './settings/useAccountActions';
import { useProfileData } from './settings/useProfileData';
import { useSettingsForm } from './settings/useSettingsForm';
import { useEffect } from 'react';

export const useSettings = () => {
  const {
    user,
    userProfile,
    isUpdating,
    setIsUpdating,
    activeTab,
    setActiveTab,
    extendedProfile,
    setExtendedProfile,
    navigate
  } = useSettingsState();

  // Use refactored hooks
  const { avatarUrl, uploading, handleAvatarUpload } = useAvatarUpload();
  
  const { profileForm, onProfileSubmit } = useProfileForm(
    user, 
    userProfile, 
    extendedProfile, 
    setExtendedProfile, 
    setIsUpdating
  );
  
  // Get the updateProfileData function from useProfileData
  const { updateProfileData } = useProfileData();
  
  // Get form-related functions from useSettingsForm
  const { form: settingsForm, handleResetPassword, onSubmit: onSettingsSubmit, isSubmitting } = useSettingsForm();
  
  const { handleDeleteAccount, handleLogout } = useAccountActions(navigate);

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
    onSettingsSubmit,
    handleResetPassword,
    handleDeleteAccount,
    handleLogout,
    isSubmitting
  };
};
