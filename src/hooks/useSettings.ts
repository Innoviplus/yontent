
import { useSettingsState } from './settings/useSettingsState';
import { useAvatarUpload } from './settings/useAvatarUpload';
import { useProfileForm } from './settings/useProfileForm';
import { useSettingsForm } from './settings/useSettingsForm';
import { useAccountActions } from './settings/useAccountActions';
import { useProfileData } from './settings/useProfileData';
import { useEffect } from 'react';
import { useLocation } from 'react-router-dom';

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

  const location = useLocation();
  
  // Set active tab based on URL parameter if present
  useEffect(() => {
    const params = new URLSearchParams(location.search);
    const tabParam = params.get('tab');
    if (tabParam && ['profile', 'general', 'social', 'account'].includes(tabParam)) {
      setActiveTab(tabParam);
    }
  }, [location, setActiveTab]);

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
  };
};
