
import React, { useCallback } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileInfoForm } from './ProfileInfoForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUploader } from './AvatarUploader';
import { toast } from 'sonner';

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
  const fileInputRef = React.useRef<HTMLInputElement>(null);
  
  // Log important state for debugging
  React.useEffect(() => {
    console.log("ProfileTab - Current avatar URL:", avatarUrl);
    console.log("ProfileTab - User profile avatar:", userProfile?.avatar);
  }, [userProfile, avatarUrl]);

  React.useEffect(() => {
    console.log("ProfileTab loaded with:", {
      hasUserProfile: !!userProfile,
      avatarUrl,
      uploading,
      profileFormValues: profileForm?.getValues()
    });
  }, [userProfile, avatarUrl, uploading, profileForm]);

  const triggerAvatarUpload = useCallback(() => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      toast.error("Cannot access file input");
    }
  }, []);

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information and personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center">
            <AvatarUploader
              avatarUrl={avatarUrl}
              username={userProfile?.username}
              uploading={uploading}
              handleAvatarUpload={handleAvatarUpload}
              fileInputRef={fileInputRef}
            />
          </div>
          
          <div className="flex-1">
            <ProfileInfoForm 
              profileForm={profileForm}
              onProfileSubmit={onProfileSubmit}
              isUpdating={isUpdating}
            />
          </div>
        </div>
      </CardContent>
    </Card>
  );
};
