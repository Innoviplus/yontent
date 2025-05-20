
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';

interface AccountTabProps {
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  handleResetPassword: () => Promise<void>;
  settingsForm: UseFormReturn<any>;
  onSettingsSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
  isSubmitting?: boolean;
  isDeleting?: boolean;
  isLoggingOut?: boolean;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  handleLogout,
  handleDeleteAccount,
  handleResetPassword,
  settingsForm,
  onSettingsSubmit,
  isUpdating,
  isSubmitting = false,
  isDeleting = false,
  isLoggingOut = false
}) => {
  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Account Security</CardTitle>
          <CardDescription>Update your account security settings</CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <div>
            <Button 
              type="button" 
              variant="outline"
              onClick={handleResetPassword}
              disabled={isUpdating}
            >
              Reset Password
            </Button>
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Session Management</CardTitle>
          <CardDescription>Manage your current session</CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="outline" 
            onClick={handleLogout}
            disabled={isLoggingOut}
          >
            {isLoggingOut ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Logging out...
              </>
            ) : (
              'Log out'
            )}
          </Button>
        </CardContent>
      </Card>
      
      <Card className="border-red-200">
        <CardHeader className="text-red-600">
          <CardTitle>Danger Zone</CardTitle>
          <CardDescription className="text-red-500">
            Disable your account and remove access to all services
          </CardDescription>
        </CardHeader>
        <CardContent>
          <Button 
            variant="destructive" 
            onClick={handleDeleteAccount}
            disabled={isDeleting}
          >
            {isDeleting ? (
              <>
                <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                Processing...
              </>
            ) : (
              'Request Account Deletion'
            )}
          </Button>
          <p className="mt-2 text-xs text-gray-500">
            This will submit a request for account deactivation. An admin will review your request and disable your account.
            Your profile data will be retained but you will no longer be able to log in.
          </p>
        </CardContent>
      </Card>
    </div>
  );
};
