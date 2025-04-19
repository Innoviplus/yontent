
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage, FormDescription } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';
import { Textarea } from '@/components/ui/textarea';
import { BirthDateInput } from '@/components/settings/BirthDateInput';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { ProfileFormValues } from '@/schemas/profileFormSchema';

interface ProfileInfoFormProps {
  profileForm: UseFormReturn<any>;
  onSubmit: (values: ProfileFormValues) => Promise<void>;
  isUpdating: boolean;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  profileForm,
  onSubmit,
  isUpdating
}) => {
  return (
    <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-6">
      <FormField
        control={profileForm.control}
        name="username"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="Username" {...field} disabled className="bg-gray-100 cursor-not-allowed" />
            </FormControl>
            <FormDescription>Username cannot be changed after account creation</FormDescription>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={profileForm.control}
        name="email"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Email</FormLabel>
            <FormControl>
              <Input placeholder="Email address" {...field} disabled className="bg-gray-100 cursor-not-allowed" />
            </FormControl>
            <FormDescription>Email cannot be changed</FormDescription>
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
              <Input placeholder="First Name" {...field} value={field.value || ''} />
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
              <Input placeholder="Last Name" {...field} value={field.value || ''} />
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
              <Textarea 
                placeholder="Tell us a little about yourself" 
                className="min-h-[100px]" 
                {...field} 
                value={field.value || ''}
              />
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
            <Select
              onValueChange={field.onChange}
              defaultValue={field.value}
              value={field.value || ''}
            >
              <FormControl>
                <SelectTrigger>
                  <SelectValue placeholder="Select gender" />
                </SelectTrigger>
              </FormControl>
              <SelectContent>
                <SelectItem value="male">Male</SelectItem>
                <SelectItem value="female">Female</SelectItem>
                <SelectItem value="non-binary">Non-binary</SelectItem>
                <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
              </SelectContent>
            </Select>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={profileForm.control}
        name="birthDate"
        render={() => (
          <FormItem className="text-left">
            <FormLabel>Birth Date</FormLabel>
            <BirthDateInput control={profileForm.control} disabled={false} />
            <FormMessage />
          </FormItem>
        )}
      />
      
      <FormField
        control={profileForm.control}
        name="phoneNumber"
        render={({ field }) => (
          <FormItem className="text-left">
            <FormLabel>Mobile Number</FormLabel>
            <FormControl>
              <Input 
                value={field.value || ''} 
                onChange={field.onChange}
                disabled
                className="bg-gray-100 cursor-not-allowed"
              />
            </FormControl>
            <FormDescription>Phone number cannot be changed after verification</FormDescription>
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
