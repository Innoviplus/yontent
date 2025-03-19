
import React from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ProfileTab } from '@/components/settings/ProfileTab';
import { AccountTab } from '@/components/settings/AccountTab';
import { SocialMediaTab } from '@/components/settings/SocialMediaTab';
import { GeneralTab } from '@/components/settings/GeneralTab';
import Navbar from '@/components/Navbar';
import { ExtendedProfile } from '@/lib/types';
import { UseFormReturn } from 'react-hook-form';

interface SettingsLayoutProps {
  userProfile: any;
  avatarUrl: string | null;
  uploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  profileForm: UseFormReturn<any>;
  settingsForm: UseFormReturn<any>;
  onProfileSubmit: (values: any) => Promise<void>;
  onSettingsSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
  extendedProfile: ExtendedProfile | null;
  handleResetPassword: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  activeTab: string;
  setActiveTab: (value: string) => void;
}

export const SettingsLayout: React.FC<SettingsLayoutProps> = ({
  userProfile,
  avatarUrl,
  uploading,
  handleAvatarUpload,
  profileForm,
  settingsForm,
  onProfileSubmit,
  onSettingsSubmit,
  isUpdating,
  extendedProfile,
  handleResetPassword,
  handleLogout,
  handleDeleteAccount,
  activeTab,
  setActiveTab
}) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-28 pb-16">
        <div className="container mx-auto px-4">
          <div className="max-w-4xl mx-auto">
            <h1 className="text-3xl font-bold text-gray-900 mb-8">Account Settings</h1>
            
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="mb-8 w-full">
                <TabsTrigger value="profile" className="flex-1">Profile</TabsTrigger>
                <TabsTrigger value="account" className="flex-1">Account</TabsTrigger>
                <TabsTrigger value="social" className="flex-1">Social Media</TabsTrigger>
                <TabsTrigger value="general" className="flex-1">General</TabsTrigger>
              </TabsList>
              
              <TabsContent value="profile">
                <ProfileTab 
                  userProfile={userProfile}
                  avatarUrl={avatarUrl}
                  uploading={uploading}
                  handleAvatarUpload={handleAvatarUpload}
                  profileForm={profileForm}
                  onProfileSubmit={onProfileSubmit}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              
              <TabsContent value="account">
                <AccountTab 
                  settingsForm={settingsForm}
                  onSettingsSubmit={onSettingsSubmit}
                  isUpdating={isUpdating}
                  handleResetPassword={handleResetPassword}
                />
              </TabsContent>
              
              <TabsContent value="social">
                <SocialMediaTab 
                  profileForm={profileForm}
                  onSubmit={profileForm.handleSubmit(onProfileSubmit)}
                  isUpdating={isUpdating}
                />
              </TabsContent>
              
              <TabsContent value="general">
                <GeneralTab 
                  handleLogout={handleLogout}
                  handleDeleteAccount={handleDeleteAccount}
                />
              </TabsContent>
            </Tabs>
          </div>
        </div>
      </div>
    </div>
  );
};
