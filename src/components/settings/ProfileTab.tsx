
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
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

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
        <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-6">
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
              />
            </CardContent>
          </Card>
          
          <Card>
            <CardHeader>
              <CardTitle>Social Media Profiles</CardTitle>
              <CardDescription>
                Link your social media accounts to your profile
              </CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <SocialMediaSection 
                profileForm={profileForm}
              />
            </CardContent>
          </Card>
          
          <div className="flex justify-end">
            <Button 
              type="submit"
              className="bg-brand-teal hover:bg-brand-darkTeal text-white"
              disabled={isLoading || !profileForm.formState.isDirty}
            >
              {isLoading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Saving...
                </>
              ) : (
                'Save Profile'
              )}
            </Button>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileTab;
