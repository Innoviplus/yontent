
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';

export interface AccountTabProps {
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  handleResetPassword?: () => Promise<void> | undefined;
  settingsForm?: UseFormReturn<any>;
  onSettingsSubmit?: (values: any) => Promise<void>;
  isUpdating?: boolean;
  isSubmitting?: boolean;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  handleLogout,
  handleDeleteAccount,
  handleResetPassword,
  settingsForm,
  onSettingsSubmit,
  isUpdating,
  isSubmitting
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account settings and security</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium mb-4">Security</h3>
            <p className="text-muted-foreground mb-4">
              Manage your password and security preferences.
            </p>
            {handleResetPassword && (
              <Button 
                onClick={handleResetPassword} 
                className="w-auto px-8 bg-brand-teal hover:bg-brand-teal/90"
              >
                Reset Password
              </Button>
            )}
          </div>
          
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium mb-4">Contact Us</h3>
            <p className="text-muted-foreground mb-4">
              If you have any questions or need support, please get in touch with our team.
            </p>
            <Button className="bg-brand-teal hover:bg-brand-teal/90">
              Send Message
            </Button>
          </div>
          
          <div className="pb-6">
            <h3 className="text-lg font-medium mb-4">Account Actions</h3>
            <div className="space-y-4">
              <Button onClick={handleLogout} className="w-auto px-8 bg-brand-teal hover:bg-brand-teal/90">
                Log out
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
      
      <div className="mt-8 text-center">
        <button 
          onClick={handleDeleteAccount}
          className="text-red-500 text-sm hover:underline"
        >
          Delete Account
        </button>
      </div>
    </>
  );
};
