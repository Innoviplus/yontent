
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { BirthDateInput } from '@/components/settings/BirthDateInput';
import { ProfileFormValues } from '@/schemas/profileFormSchema';

interface ProfileInfoFormProps {
  profileForm: UseFormReturn<any>;
  onProfileSubmit: (values: ProfileFormValues) => Promise<void>;
  isUpdating: boolean;
}

export const ProfileInfoForm: React.FC<ProfileInfoFormProps> = ({
  profileForm,
  onProfileSubmit,
  isUpdating
}) => {
  // For debugging
  const formValues = profileForm.watch();
  console.log("Current form values:", formValues);

  return (
    <div className="space-y-6">
      <FormField 
        control={profileForm.control} 
        name="username" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input placeholder="username" {...field} disabled />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          control={profileForm.control} 
          name="firstName" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>First Name</FormLabel>
              <FormControl>
                <Input placeholder="Your first name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
        
        <FormField 
          control={profileForm.control} 
          name="lastName" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Last Name</FormLabel>
              <FormControl>
                <Input placeholder="Your last name" {...field} />
              </FormControl>
              <FormMessage />
            </FormItem>
          )} 
        />
      </div>
      
      <FormField 
        control={profileForm.control} 
        name="bio" 
        render={({ field }) => (
          <FormItem>
            <FormLabel>Bio</FormLabel>
            <FormControl>
              <Textarea 
                placeholder="Tell us a little bit about yourself" 
                className="min-h-[120px]" 
                {...field} 
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )} 
      />

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <FormField 
          control={profileForm.control} 
          name="gender" 
          render={({ field }) => (
            <FormItem>
              <FormLabel>Gender</FormLabel>
              <Select 
                onValueChange={field.onChange} 
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

        <BirthDateInput control={profileForm.control} disabled={false} />
      </div>
    </div>
  );
};
