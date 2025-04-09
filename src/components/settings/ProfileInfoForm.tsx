import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ProfileInfoFormProps {
  profileForm: UseFormReturn<any>;
  onProfileSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  profileForm,
  onProfileSubmit,
  isUpdating
}) => {
  return (
    <form onSubmit={profileForm.handleSubmit(onProfileSubmit)} className="space-y-6">
      <FormField
        control={profileForm.control}
        name="username"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Username" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={profileForm.control}
        name="firstName"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>First Name</FormLabel>
            <FormControl>
              <Input placeholder="First Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={profileForm.control}
        name="lastName"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Last Name</FormLabel>
            <FormControl>
              <Input placeholder="Last Name" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={profileForm.control}
        name="bio"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Input placeholder="Tell us a little about yourself" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={profileForm.control}
        name="gender"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Gender</FormLabel>
            <FormControl>
              <Input placeholder="Gender" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={profileForm.control}
        name="birthDate"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Birth Date</FormLabel>
            <FormControl>
              <Input type="date" {...field} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Button 
        type="submit"
        className="bg-brand-teal hover:bg-brand-darkTeal text-white"
        disabled={isUpdating || !profileForm.formState.isDirty}
      >
        {isUpdating ? (
          <>
            <Loader2 className="mr-2 h-4 w-4 animate-spin" />
            Saving...
          </>
        ) : (
          'Save Profile'
        )}
      </Button>
    </form>
  );
};
