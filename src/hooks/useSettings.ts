
import { useSettingsState } from './settings/useSettingsState';
import { useAvatarUpload } from './settings/useAvatarUpload';
import { useProfileForm } from './settings/useProfileForm';
import { useAccountActions } from './settings/useAccountActions';
import { useProfileData } from './settings/useProfileData';
import { useSettingsForm } from './settings/useSettingsForm';
import { useEffect } from 'react';
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
  
  // Get the updateProfileData function from useProfileData
  const { updateProfileData } = useProfileData();
  
  // Get form-related functions from useSettingsForm
  const settingsFormData = useSettingsForm();
  
  const { handleDeleteAccount, handleLogout } = useAccountActions(
    user, 
    signOut, 
    navigate
  );

  // Debugging - log critical objects
  useEffect(() => {
    console.log('useSettings hook initialized with:', {
      user: !!user,
      userProfile: !!userProfile,
      profileForm: !!profileForm,
      settingsForm: !!settingsFormData.form
    });
  }, [user, userProfile, profileForm, settingsFormData.form]);

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
    settingsForm: settingsFormData.form,
    handleAvatarUpload,
    onProfileSubmit,
    onSettingsSubmit: updateProfileData,
    handleResetPassword: settingsFormData.handleResetPassword,
    handleDeleteAccount,
    handleLogout,
  };
};
