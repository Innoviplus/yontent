
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { UseFormReturn } from 'react-hook-form';

export interface GeneralTabProps {
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
  settingsForm?: UseFormReturn<any>;
  onSettingsSubmit?: (values: any) => Promise<void>;
  isUpdating?: boolean;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  handleLogout,
  handleDeleteAccount,
  // We're not using these props in this component yet, but including them
  // in the interface to avoid TypeScript errors
  settingsForm,
  onSettingsSubmit,
  isUpdating
}) => {
  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>General Settings</CardTitle>
          <CardDescription>Manage app preferences and account actions</CardDescription>
        </CardHeader>
        <CardContent className="space-y-8">
          <div className="border-b pb-6">
            <h3 className="text-lg font-medium mb-4">About</h3>
            <p className="text-muted-foreground">
              This application helps users track and share reviews, participate in missions, and earn points.
            </p>
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
