
import React from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface GeneralTabProps {
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
}

export const GeneralTab: React.FC<GeneralTabProps> = ({
  handleLogout,
  handleDeleteAccount
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
            <Button variant="outline">
              Send Message
            </Button>
          </div>
          
          <div className="pb-6">
            <h3 className="text-lg font-medium mb-4">Account Actions</h3>
            <div className="space-y-4">
              <Button onClick={handleLogout} variant="outline" className="w-full justify-start">
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
