
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface AccountTabProps {
  settingsForm: UseFormReturn<any>;
  onSettingsSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
  handleResetPassword: () => Promise<void>;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  settingsForm,
  onSettingsSubmit,
  isUpdating,
  handleResetPassword
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Account Settings</CardTitle>
        <CardDescription>Manage your account details and security</CardDescription>
      </CardHeader>
      <CardContent className="space-y-8">
        <Form {...settingsForm}>
          <form onSubmit={settingsForm.handleSubmit(onSettingsSubmit)} className="space-y-6">
            <FormField
              control={settingsForm.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email Address</FormLabel>
                  <FormControl>
                    <Input type="email" {...field} readOnly />
                  </FormControl>
                  <FormDescription>
                    Your email address cannot be changed directly.
                  </FormDescription>
                </FormItem>
              )}
            />
            
            <FormField
              control={settingsForm.control}
              name="phoneNumber"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Phone Number</FormLabel>
                  <FormControl>
                    <Input placeholder="+1 (555) 000-0000" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={settingsForm.control}
              name="country"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Country</FormLabel>
                  <FormControl>
                    <Input placeholder="United States" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="submit" disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Settings
            </Button>
          </form>
        </Form>
        
        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Password</h3>
          <Button variant="outline" onClick={handleResetPassword}>
            Reset Password
          </Button>
        </div>
      </CardContent>
    </Card>
  );
};
