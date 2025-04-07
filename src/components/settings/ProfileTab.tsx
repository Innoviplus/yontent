
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileInfoForm } from './ProfileInfoForm';
import { AvatarSection } from './AvatarSection';
import { SocialMediaSection } from './SocialMediaSection';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';

interface ProfileTabProps {
  userProfile: any;
  avatarUrl: string | null;
  uploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  profileForm: UseFormReturn<any>;
  onProfileSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
  extendedProfile: any;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userProfile,
  avatarUrl,
  uploading,
  handleAvatarUpload,
  profileForm,
  onProfileSubmit,
  isUpdating,
  extendedProfile
}) => {
  // Log the current state for debugging
  React.useEffect(() => {
    console.log("ProfileTab loaded with:", {
      hasUserProfile: !!userProfile,
      avatarUrl,
      uploading,
      profileFormValues: profileForm?.formState?.defaultValues
    });
  }, [userProfile, avatarUrl, uploading, profileForm]);

  return (
    <Card>
      <CardHeader className="text-left">
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information and personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <AvatarSection 
            avatarUrl={avatarUrl}
            uploading={uploading}
            handleAvatarUpload={handleAvatarUpload}
            username={userProfile?.username}
          />
          
          <div className="flex-1">
            <ProfileInfoForm 
              profileForm={profileForm}
              onProfileSubmit={onProfileSubmit}
              isUpdating={isUpdating}
            />
          </div>
        </div>

        <Separator className="my-8" />
        
        <SocialMediaSection 
          profileForm={profileForm}
          onSubmit={onProfileSubmit}
          isUpdating={isUpdating}
        />
      </CardContent>
    </Card>
  );
};
