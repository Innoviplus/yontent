
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { AlertDialog, AlertDialogAction, AlertDialogCancel, AlertDialogContent, AlertDialogDescription, AlertDialogFooter, AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from '@/components/ui/alert-dialog';
import { Loader2 } from 'lucide-react';

export interface AccountTabProps {
  settingsForm?: UseFormReturn<any>;
  onSettingsSubmit?: (values: any) => Promise<void>;
  isUpdating?: boolean;
  isSubmitting?: boolean;
  handleResetPassword: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  handleResetPassword,
  handleLogout,
  handleDeleteAccount,
  isSubmitting = false
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Account Settings</CardTitle>
          <CardDescription>Manage your account security and access</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          {/* Password Reset Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium mb-4">Password</h3>
            <p className="text-muted-foreground mb-4">
              You can reset your password by clicking the button below. We'll send you an email with a link to set a new password.
            </p>
            <Button 
              onClick={handleResetPassword} 
              className="w-auto bg-brand-teal hover:bg-brand-teal/90"
              disabled={isSubmitting}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Processing...
                </>
              ) : 'Reset Password'}
            </Button>
          </div>
          
          {/* Log out Section */}
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium mb-4">Account Access</h3>
            <p className="text-muted-foreground mb-4">
              You can log out of your account across all devices by clicking the button below.
            </p>
            <Button 
              onClick={handleLogout} 
              className="w-auto bg-brand-teal hover:bg-brand-teal/90"
            >
              Log out
            </Button>
          </div>
          
          {/* Delete Account Section */}
          <div className="pb-6">
            <h3 className="text-lg font-medium mb-4">Delete Account</h3>
            <p className="text-muted-foreground mb-4">
              Permanently delete your account and all associated data. This action cannot be undone.
            </p>
            <AlertDialog>
              <AlertDialogTrigger asChild>
                <Button variant="destructive">Delete Account</Button>
              </AlertDialogTrigger>
              <AlertDialogContent>
                <AlertDialogHeader>
                  <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                  <AlertDialogDescription>
                    This action cannot be undone. This will permanently delete your account and remove all your data from our servers.
                  </AlertDialogDescription>
                </AlertDialogHeader>
                <AlertDialogFooter>
                  <AlertDialogCancel>Cancel</AlertDialogCancel>
                  <AlertDialogAction onClick={handleDeleteAccount} className="bg-destructive text-destructive-foreground">
                    Delete Account
                  </AlertDialogAction>
                </AlertDialogFooter>
              </AlertDialogContent>
            </AlertDialog>
          </div>
        </CardContent>
      </Card>
    </>
  );
};
