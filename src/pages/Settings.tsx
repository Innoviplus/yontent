
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { useSettings } from '@/hooks/useSettings';
import Navbar from '@/components/Navbar';
import { usePageTitle } from '@/hooks/usePageTitle';
import AdminAccessButton from '@/components/admin/AdminAccessButton';

const Settings = () => {
  usePageTitle('Settings');
  const {
    userProfile,
    avatarUrl,
    uploading,
    isUpdating,
    isSubmitting,
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
          isSubmitting={isSubmitting}
          extendedProfile={extendedProfile}
          handleResetPassword={handleResetPassword}
          handleLogout={handleLogout}
          handleDeleteAccount={handleDeleteAccount}
          activeTab={activeTab}
          setActiveTab={setActiveTab}
        />
        <div className="container mx-auto px-4 py-4 max-w-5xl">
          <AdminAccessButton />
        </div>
      </div>
    </>
  );
};

export default Settings;
