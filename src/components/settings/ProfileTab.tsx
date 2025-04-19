
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileFormValues } from '@/schemas/profileFormSchema';
import { AvatarSection } from './AvatarSection';
import { ProfileInfoForm } from './ProfileInfoForm';
import { SocialMediaSection } from './SocialMediaSection';
import { LoadingSpinner } from './LoadingSpinner';
import { useProfilePageState } from '@/hooks/settings/useProfilePageState';
import { useProfileRefresh } from '@/hooks/settings/useProfileRefresh';

const ProfileTab = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { extendedProfile, profileForm, onProfileSubmit, handleAvatarUpload, avatarUrl, uploading } = useSettings();
  
  const {
    isLoading,
    loadingAttempts,
    initialLoadComplete,
    setIsLoading,
    setLoadingAttempts,
    setInitialLoadComplete,
    handleProfileSubmit
  } = useProfilePageState();

  // Initialize profile refresh logic
  useProfileRefresh({
    user,
    loadingAttempts,
    initialLoadComplete,
    setIsLoading,
    setInitialLoadComplete,
    setLoadingAttempts,
    refreshUserProfile
  });

  const onSubmit = async (values: ProfileFormValues) => {
    await handleProfileSubmit(values, onProfileSubmit, profileForm);
  };

  if (isLoading && !userProfile && !initialLoadComplete) {
    return <LoadingSpinner />;
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Add a profile picture to personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AvatarSection
            avatarUrl={avatarUrl || userProfile?.avatar}
            username={userProfile?.username}
            uploading={uploading}
            handleAvatarUpload={handleAvatarUpload}
          />
        </CardContent>
      </Card>

      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your personal details.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <ProfileInfoForm 
                  profileForm={profileForm}
                  onSubmit={onSubmit}
                  isUpdating={isLoading}
                />
              </CardContent>
            </Card>
            
            <SocialMediaSection 
              profileForm={profileForm} 
              onSubmit={onSubmit} 
              isUpdating={isLoading} 
            />
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileTab;
