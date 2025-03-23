
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { useSettings } from '@/hooks/useSettings';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';

const Settings = () => {
  const {
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
  } = useSettings();

  return (
    <>
      <Navbar />
      <div className="pt-24">
        <SettingsLayout
          userProfile={userProfile}
          avatarUrl={avatarUrl}
          uploading={uploading}
          handleAvatarUpload={handleAvatarUpload}
          profileForm={profileForm}
          settingsForm={settingsForm}
          onProfileSubmit={onProfileSubmit}
          onSettingsSubmit={onSettingsSubmit}
          isUpdating={isUpdating}
          extendedProfile={extendedProfile}
          handleResetPassword={handleResetPassword}
          handleLogout={handleLogout}
          handleDeleteAccount={handleDeleteAccount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
      </div>
      <Toaster />
    </>
  );
};

export default Settings;
