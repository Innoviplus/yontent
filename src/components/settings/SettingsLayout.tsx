import React from 'react';
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs"
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card"
import { Label } from "@/components/ui/label"
import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { UseFormReturn } from 'react-hook-form';
import { ProfileTab } from './ProfileTab';

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
  isSubmitting: boolean;
  extendedProfile: any;
  handleResetPassword: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  activeTab: string;
  setActiveTab: (tab: string) => void;
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
  setActiveTab
}) => {
  return (
    <div className="container relative h-full max-w-5xl">
      <Tabs defaultValue="profile" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="profile" onClick={() => setActiveTab("profile")}>Profile</TabsTrigger>
          <TabsTrigger value="account" onClick={() => setActiveTab("account")}>Account</TabsTrigger>
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
            extendedProfile={extendedProfile}
          />
        </TabsContent>
        <TabsContent value="account">
          <Card>
            <CardHeader>
              <CardTitle>Account Settings</CardTitle>
              <CardDescription>Manage your account settings.</CardDescription>
            </CardHeader>
            <CardContent className="grid gap-6">
              <div className="grid gap-2">
                <Label htmlFor="email">Email</Label>
                <Input id="email" defaultValue={userProfile?.email} className="bg-muted/50 text-muted-foreground" readOnly />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="username">Username</Label>
                <Input id="username" defaultValue={userProfile?.username} className="bg-muted/50 text-muted-foreground" readOnly />
              </div>
              <div className="flex items-center justify-between rounded-md border p-4">
                <div className="space-y-1">
                  <p className="text-sm font-medium leading-none">Two-Factor Authentication</p>
                  <p className="text-sm text-muted-foreground">Add an extra layer of security to your account.</p>
                </div>
                <Switch id="2fa" />
              </div>
              <div className="grid gap-2">
                <Label htmlFor="apiKey">API Key</Label>
                <Input id="apiKey" className="bg-muted/50 text-muted-foreground" readOnly value="xxxxxxxx-xxxx-xxxx-xxxx-xxxxxxxxxxxx" />
              </div>
              <Button variant="outline" size="sm">
                Generate New Key
              </Button>
              <div className="grid gap-2">
                <Label htmlFor="delete">Delete Account</Label>
                <Button variant="destructive" onClick={handleDeleteAccount}>
                  Delete Account
                </Button>
              </div>
              <div className="grid gap-2">
                <Label htmlFor="logout">Logout</Label>
                <Button variant="secondary" onClick={handleLogout}>
                  Logout
                </Button>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};
