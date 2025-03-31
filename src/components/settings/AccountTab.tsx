
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Loader2, MessageSquare } from 'lucide-react';
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
import { PhoneInput } from './PhoneInput';
import { toast } from 'sonner';

export interface AccountTabProps {
  settingsForm: UseFormReturn<any>;
  onSettingsSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
  handleResetPassword: () => Promise<void>;
  handleLogout: () => Promise<void>;
  handleDeleteAccount: () => Promise<void>;
}

export const AccountTab: React.FC<AccountTabProps> = ({
  settingsForm,
  onSettingsSubmit,
  isUpdating,
  handleResetPassword,
  handleLogout,
  handleDeleteAccount
}) => {
  const handleContactUs = () => {
    window.open('https://api.whatsapp.com/send?phone=85254278104', '_blank');
  };

  const [isResettingPassword, setIsResettingPassword] = React.useState(false);
  
  const onResetPassword = async () => {
    try {
      setIsResettingPassword(true);
      await handleResetPassword();
      toast.success('Password reset link sent to your email');
    } catch (error) {
      toast.error('Failed to send password reset link');
      console.error(error);
    } finally {
      setIsResettingPassword(false);
    }
  };

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
                    <Input type="email" {...field} />
                  </FormControl>
                  <FormDescription>
                    Enter your preferred email address for notifications.
                  </FormDescription>
                  <FormMessage />
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
                    <PhoneInput
                      value={field.value || ''}
                      onChange={field.onChange}
                      countryCode={settingsForm.watch('phoneCountryCode') || ''}
                      onCountryCodeChange={(code) => {
                        settingsForm.setValue('phoneCountryCode', code);
                      }}
                    />
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
                  <FormLabel>Current Country</FormLabel>
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
          <Button 
            variant="outline" 
            onClick={onResetPassword}
            disabled={isResettingPassword}
          >
            {isResettingPassword && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
            Reset Password
          </Button>
        </div>
        
        <div className="pt-6 border-t">
          <h3 className="text-lg font-medium mb-4">Contact Us</h3>
          <Button onClick={handleContactUs} className="bg-brand-teal hover:bg-brand-teal/90">
            <MessageSquare className="mr-2 h-4 w-4" />
            Send Message
          </Button>
          <p className="text-sm text-gray-500 mt-2">
            Opens WhatsApp to connect with our support team
          </p>
        </div>
      </CardContent>
    </Card>
  );
};
