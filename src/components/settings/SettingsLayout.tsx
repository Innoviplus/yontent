
import { useRef } from "react";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./ProfileTab";
import { GeneralTab } from "./GeneralTab";
import { AccountTab } from "./AccountTab";
import { SocialMediaTab } from "./SocialMediaTab";
import { AvatarUploader } from "./AvatarUploader";
import { User } from "lucide-react";
import PointsBadge from "../PointsBadge";

export function SettingsLayout({
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
  setActiveTab,
}) {
  const fileInputRef = useRef(null);

  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="flex flex-col md:flex-row gap-8">
        <div className="w-full md:w-1/3 space-y-6">
          <div className="bg-white rounded-lg shadow-sm p-6 text-center">
            <h2 className="text-xl font-semibold mb-6">Your Profile</h2>
            <AvatarUploader
              avatarUrl={avatarUrl}
              uploading={uploading}
              handleAvatarUpload={handleAvatarUpload}
              fileInputRef={fileInputRef}
              username={userProfile?.username || "User"}
            />
            <h3 className="mt-4 text-lg font-medium">{userProfile?.username}</h3>
            {userProfile?.points !== undefined && (
              <PointsBadge points={userProfile.points} className="mt-2" />
            )}
          </div>
        </div>

        <div className="w-full md:w-2/3">
          <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="grid grid-cols-4 mb-8">
              <TabsTrigger value="profile" className="flex items-center gap-2">
                <User className="h-4 w-4" />
                <span className="hidden sm:inline">Profile</span>
              </TabsTrigger>
              <TabsTrigger value="general">General</TabsTrigger>
              <TabsTrigger value="social">Social</TabsTrigger>
              <TabsTrigger value="account">Account</TabsTrigger>
            </TabsList>
            
            <TabsContent value="profile" className="mt-0">
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
            
            <TabsContent value="general" className="mt-0">
              <GeneralTab
                handleLogout={handleLogout}
                handleDeleteAccount={handleDeleteAccount}
              />
            </TabsContent>
            
            <TabsContent value="social" className="mt-0">
              <SocialMediaTab
                profileForm={profileForm}
                onSubmit={() => onProfileSubmit(profileForm.getValues())}
                isUpdating={isUpdating}
              />
            </TabsContent>
            
            <TabsContent value="account" className="mt-0">
              <AccountTab
                settingsForm={settingsForm}
                onSettingsSubmit={onSettingsSubmit}
                isUpdating={isUpdating}
                handleResetPassword={handleResetPassword}
                handleLogout={handleLogout}
                handleDeleteAccount={handleDeleteAccount}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
