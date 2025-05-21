
import React from 'react';
import { Card } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import ProfileTab from './ProfileTab';
import { AccountTab } from './AccountTab';
import { GeneralTab } from './GeneralTab';
import { UseFormReturn } from 'react-hook-form';

interface SettingsLayoutProps {
  userProfile: any;
  avatarUrl: string;
  uploading: boolean;
  isUpdating: boolean;
  isSubmitting: boolean;
  extendedProfile: any;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  profileForm: UseFormReturn<any>;
  settingsForm: UseFormReturn<any>;
  onProfileSubmit: (values: any) => Promise<void>;
  onSettingsSubmit: (values: any) => Promise<void>;
  handleResetPassword: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  isDeleting?: boolean;
  isLoggingOut?: boolean;
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
  isSubmitting,
  extendedProfile,
  handleResetPassword,
  handleLogout,
  handleDeleteAccount,
  activeTab,
  setActiveTab,
  isDeleting,
  isLoggingOut
}) => {
  return (
    <div className="container px-4 pt-6 pb-16 max-w-2xl">
      <h1 className="text-3xl font-bold mb-6">Settings</h1>
      
      <Card className="mb-8">
        <Tabs 
          value={activeTab} 
          onValueChange={setActiveTab} 
          className="p-4"
        >
          <TabsList className="mb-4">
            <TabsTrigger value="profile">Profile</TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
            <TabsTrigger value="general">General</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile">
            <ProfileTab 
              userProfile={userProfile}
              avatarUrl={avatarUrl} 
              uploading={uploading}
              isUpdating={isUpdating}
              handleAvatarUpload={handleAvatarUpload}
              profileForm={profileForm}
              onProfileSubmit={onProfileSubmit}
              extendedProfile={extendedProfile}
            />
          </TabsContent>
          
          <TabsContent value="account">
            <AccountTab 
              handleLogout={handleLogout}
              handleDeleteAccount={handleDeleteAccount}
              handleResetPassword={handleResetPassword}
              settingsForm={settingsForm}
              onSettingsSubmit={onSettingsSubmit}
              isUpdating={isUpdating}
              isSubmitting={isSubmitting}
              isDeleting={isDeleting}
              isLoggingOut={isLoggingOut}
            />
          </TabsContent>
          
          <TabsContent value="general">
            <GeneralTab 
              handleLogout={handleLogout}
              handleDeleteAccount={handleDeleteAccount}
              settingsForm={settingsForm}
              onSettingsSubmit={onSettingsSubmit}
              isUpdating={isUpdating}
            />
          </TabsContent>
        </Tabs>
      </Card>
    </div>
  );
};
