
import { useSettingsState } from './settings/useSettingsState';
import { useProfileForm } from './settings/useProfileForm';
import { useAccountActions } from './settings/useAccountActions';
import { useSettingsForm } from './settings/useSettingsForm';
import { useEffect } from 'react';

export const useSettings = () => {
  const {
    user,
    userProfile,
    signOut,
    isUpdating,
    setIsUpdating,
    activeTab,
    setActiveTab,
    extendedProfile,
    setExtendedProfile,
    navigate
  } = useSettingsState();
  
  const { profileForm, onProfileSubmit } = useProfileForm(
    user, 
    userProfile, 
    extendedProfile, 
    setExtendedProfile, 
    setIsUpdating
  );
  
  // Get form-related functions from useSettingsForm
  const { form: settingsForm, handleResetPassword, onSubmit: onSettingsSubmit, isSubmitting } = useSettingsForm();
  
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
      settingsForm: !!settingsForm
    });
  }, [user, userProfile, profileForm, settingsForm]);

  return {
    user,
    userProfile,
    isUpdating,
    activeTab,
    setActiveTab,
    extendedProfile,
    profileForm,
    settingsForm,
    onProfileSubmit,
    onSettingsSubmit,
    handleResetPassword,
    handleDeleteAccount,
    handleLogout,
    isSubmitting
  };
};
