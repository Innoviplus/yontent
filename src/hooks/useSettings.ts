
import { useSettingsState } from './settings/useSettingsState';
import { useAvatarUpload } from './settings/useAvatarUpload';
import { useProfileForm } from './settings/useProfileForm';
import { useSettingsForm } from './settings/useSettingsForm';
import { useAccountActions } from './settings/useAccountActions';
import { useProfileData } from './settings/useProfileData';

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
  
  const { settingsForm, onSettingsSubmit, handleResetPassword } = useSettingsForm(
    user, 
    setExtendedProfile, 
    setIsUpdating
  );
  
  const { handleDeleteAccount, handleLogout } = useAccountActions(
    user, 
    signOut, 
    navigate
  );

  // Load profile data
  useProfileData(
    user,
    userProfile,
    setAvatarUrl,
    setExtendedProfile,
    profileForm,
    settingsForm
  );

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
  };
};
