
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { ProfileTab } from "./ProfileTab";
import { AccountTab } from "./AccountTab";
import { User } from "lucide-react";

export function SettingsLayout({
  userProfile,
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
  userEmail,
}) {
  return (
    <div className="container mx-auto px-4 py-8 max-w-5xl">
      <div className="w-full">
        <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
          <TabsList className="grid grid-cols-2 mb-8">
            <TabsTrigger value="profile" className="flex items-center gap-2">
              <User className="h-4 w-4" />
              <span className="hidden sm:inline">Profile</span>
            </TabsTrigger>
            <TabsTrigger value="account">Account</TabsTrigger>
          </TabsList>
          
          <TabsContent value="profile" className="mt-0">
            <ProfileTab
              userProfile={userProfile}
              profileForm={profileForm}
              onProfileSubmit={onProfileSubmit}
              isUpdating={isUpdating}
              extendedProfile={extendedProfile}
            />
          </TabsContent>
          
          <TabsContent value="account" className="mt-0">
            <AccountTab
              settingsForm={settingsForm}
              onSettingsSubmit={onSettingsSubmit}
              isUpdating={isUpdating}
              isSubmitting={isSubmitting}
              handleResetPassword={handleResetPassword}
              handleLogout={handleLogout}
              handleDeleteAccount={handleDeleteAccount}
              userEmail={userEmail}
            />
          </TabsContent>
        </Tabs>
      </div>
    </div>
  );
}
