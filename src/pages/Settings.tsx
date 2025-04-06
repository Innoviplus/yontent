
import { SettingsLayout } from '@/components/settings/SettingsLayout';
import { useSettings } from '@/hooks/useSettings';
import Navbar from '@/components/Navbar';

const Settings = () => {
  const {
    user,
    userProfile,
    isUpdating,
    isSubmitting,
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
  } = useSettings();

  return (
    <>
      <Navbar />
      <div className="pt-24">
        <SettingsLayout
          userProfile={userProfile}
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
          userEmail={user?.email}
        />
      </div>
    </>
  );
};

export default Settings;
