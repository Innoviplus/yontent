
import { useAuth } from '@/contexts/AuthContext';
import { Form } from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { ProfileFormValues } from '@/schemas/profileFormSchema';
import { AvatarSection } from './AvatarSection';
import { ProfileInfoForm } from '../ProfileInfoForm';
import { SocialMediaSection } from './SocialMediaSection';
import { LoadingSpinner } from './LoadingSpinner';
import { useProfilePageState } from '@/hooks/settings/useProfilePageState';
import { useProfileRefresh } from '@/hooks/settings/useProfileRefresh';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { UseFormReturn } from 'react-hook-form';
import { ExtendedProfile } from '@/lib/types';

interface ProfileTabProps {
  userProfile: any;
  profileForm: UseFormReturn<any>;
  onProfileSubmit: (values: ProfileFormValues) => Promise<void>;
  isUpdating: boolean;
  avatarUrl: string | null;
  uploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  extendedProfile: ExtendedProfile | null;
}

const ProfileTab = ({
  userProfile,
  profileForm,
  onProfileSubmit,
  isUpdating,
  avatarUrl,
  uploading,
  handleAvatarUpload,
  extendedProfile
}: ProfileTabProps) => {
  const { user, refreshUserProfile } = useAuth();
  
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

  // Handle form submission
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
            onProfileSubmit={onProfileSubmit}
            isUpdating={isUpdating}
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
          onClick={profileForm.handleSubmit(onSubmit)}
          className="bg-brand-teal hover:bg-brand-darkTeal text-white"
          disabled={isLoading || isUpdating || !profileForm.formState.isDirty}
        >
          {isLoading || isUpdating ? (
            <>
              <Loader2 className="mr-2 h-4 w-4 animate-spin" />
              Saving...
            </>
          ) : (
            'Save All Changes'
          )}
        </Button>
      </div>
    </div>
  );
};

export default ProfileTab;
