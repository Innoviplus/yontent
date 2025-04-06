
import React, { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileInfoForm } from './ProfileInfoForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { AvatarUploader } from './AvatarUploader';

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
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ensure avatar URL is properly set
  useEffect(() => {
    if (userProfile?.avatar && !avatarUrl) {
      console.log("Ensuring avatar URL is set:", userProfile.avatar);
    }
  }, [userProfile, avatarUrl]);

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
