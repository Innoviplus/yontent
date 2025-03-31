
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { subYears } from 'date-fns';
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
import { Textarea } from '@/components/ui/textarea';
import { DateOfBirthDropdowns } from './DateOfBirthDropdowns';
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

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
  // Early return if profileForm is undefined or null
  if (!profileForm) {
    return <div>Loading profile form...</div>;
  }

  // Get the current profile data to determine if fields should be locked
  const currentBirthDate = profileForm.getValues('birthDate');
  const currentGender = profileForm.getValues('gender');
  
  // Check if these values already existed in the database (not just set in the current form session)
  const extendedProfile = profileForm.getValues('__extendedProfile') || {};
  const hasSetBirthDate = !!extendedProfile.birthDate;
  const hasSetGender = !!extendedProfile.gender;

  // Create validation function for date of birth
  const validateAge = (date: Date | undefined) => {
    if (!date) return true;
    
    const minAgeDate = subYears(new Date(), 18);
    if (date > minAgeDate) {
      return "You must be at least 18 years old";
    }
    return true;
  };

  const handleSubmit = async (values: any) => {
    try {
      // Check age validation
      if (values.birthDate) {
        const minAgeDate = subYears(new Date(), 18);
        if (values.birthDate > minAgeDate) {
          profileForm.setError('birthDate', {
            type: 'manual', 
            message: 'You must be at least 18 years old'
          });
          toast.error('You must be at least 18 years old to save your profile');
          return;
        }
      }
      
      // Store the current form values to determine what's being saved
      // This is used to track which fields should become read-only after saving
      values.__extendedProfile = {
        birthDate: values.birthDate,
        gender: values.gender
      };
      
      await onProfileSubmit(values);
      toast.success('Profile updated successfully!');
    } catch (error) {
      toast.error('Failed to update profile');
      console.error('Error updating profile:', error);
    }
  };

  return (
    <Form {...profileForm}>
      <form onSubmit={profileForm.handleSubmit(handleSubmit)} className="space-y-6">
        <FormField
          control={profileForm.control}
          name="username"
          render={({ field }) => (
            <FormItem>
              <FormLabel>Username</FormLabel>
              <FormControl>
                <Input {...field} readOnly className="bg-gray-100" />
              </FormControl>
              <FormDescription>
                Your username cannot be changed.
              </FormDescription>
            </FormItem>
          )}
        />
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <FormField
            control={profileForm.control}
            name="firstName"
            render={({ field }) => (
              <FormItem>
                <FormLabel>First Name</FormLabel>
                <FormControl>
                  <Input placeholder="John" {...field} />
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
                  <Input placeholder="Doe" {...field} />
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
                  placeholder="Tell us a little about yourself"
                  className="resize-none"
                  {...field}
                  value={field.value || ''}
                />
              </FormControl>
              <FormDescription>
                Brief description for your profile. Maximum 500 characters.
              </FormDescription>
              <FormMessage />
            </FormItem>
          )}
        />
        
        <div className="grid gap-6 grid-cols-1 md:grid-cols-2">
          <FormField
            control={profileForm.control}
            name="gender"
            render={({ field }) => (
              <FormItem>
                <FormLabel>Gender</FormLabel>
                <Select 
                  onValueChange={field.onChange} 
                  value={field.value || ''}
                  disabled={hasSetGender}
                >
                  <FormControl>
                    <SelectTrigger className={hasSetGender ? "bg-gray-100" : ""}>
                      <SelectValue placeholder="Select gender" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="pointer-events-auto">
                    <SelectItem value="male">Male</SelectItem>
                    <SelectItem value="female">Female</SelectItem>
                    <SelectItem value="non-binary">Non-binary</SelectItem>
                    <SelectItem value="prefer-not-to-say">Prefer not to say</SelectItem>
                  </SelectContent>
                </Select>
                <FormDescription>
                  {hasSetGender ? 'Gender cannot be changed once set.' : 'Select your gender.'}
                </FormDescription>
                <FormMessage />
              </FormItem>
            )}
          />
          
          <DateOfBirthDropdowns control={profileForm.control} disabled={hasSetBirthDate} />
        </div>
        
        <Button type="submit" disabled={isUpdating}>
          {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Save Profile
        </Button>
      </form>
    </Form>
  );
};
