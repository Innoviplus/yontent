
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { profileFormSchema, ProfileFormValues } from '@/schemas/profileFormSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import BirthDatePicker from './BirthDatePicker';
import { Loader2 } from 'lucide-react';
import SocialMediaSection from './SocialMediaSection';

const ProfileTab = () => {
  const { user, userProfile } = useAuth();
  const { extendedProfile, isLoading, isUpdating, setIsUpdating, updateProfile } = useSettings();
  const [formSuccess, setFormSuccess] = useState(false);
  
  const form = useForm<ProfileFormValues>({
    resolver: zodResolver(profileFormSchema),
    defaultValues: {
      username: userProfile?.username || '',
      email: userProfile?.email || user?.email || '',
      firstName: extendedProfile?.firstName || '',
      lastName: extendedProfile?.lastName || '',
      bio: extendedProfile?.bio || '',
      gender: extendedProfile?.gender || '',
      birthDate: extendedProfile?.birthDate ? new Date(extendedProfile.birthDate) : undefined,
      websiteUrl: extendedProfile?.websiteUrl || '',
      facebookUrl: extendedProfile?.facebookUrl || '',
      instagramUrl: extendedProfile?.instagramUrl || '',
      youtubeUrl: extendedProfile?.youtubeUrl || '',
      tiktokUrl: extendedProfile?.tiktokUrl || '',
      phoneNumber: userProfile?.phone_number || '',
    },
  });
  
  // Update form values when profile data changes
  useState(() => {
    if (userProfile && !isLoading) {
      form.setValue('username', userProfile.username || '');
      form.setValue('email', userProfile.email || user?.email || '');
      form.setValue('phoneNumber', userProfile.phone_number || '');
      
      if (extendedProfile) {
        form.setValue('firstName', extendedProfile.firstName || '');
        form.setValue('lastName', extendedProfile.lastName || '');
        form.setValue('bio', extendedProfile.bio || '');
        form.setValue('gender', extendedProfile.gender || '');
        
        if (extendedProfile.birthDate) {
          form.setValue('birthDate', new Date(extendedProfile.birthDate));
        }
        
        form.setValue('websiteUrl', extendedProfile.websiteUrl || '');
        form.setValue('facebookUrl', extendedProfile.facebookUrl || '');
        form.setValue('instagramUrl', extendedProfile.instagramUrl || '');
        form.setValue('youtubeUrl', extendedProfile.youtubeUrl || '');
        form.setValue('tiktokUrl', extendedProfile.tiktokUrl || '');
      }
    }
  });
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsUpdating(true);
    setFormSuccess(false);
    
    try {
      const success = await updateProfile(values);
      
      if (success) {
        setFormSuccess(true);
        toast.success('Profile updated successfully');
      }
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile');
    } finally {
      setIsUpdating(false);
    }
  };
  
  if (isLoading) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)}>
          <div className="space-y-6">
            <Card>
              <CardHeader>
                <CardTitle>Basic Information</CardTitle>
                <CardDescription>
                  Update your personal details.
                </CardDescription>
              </CardHeader>
              <CardContent className="grid gap-6">
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
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
                    control={form.control}
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
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input type="email" placeholder="john.doe@example.com" {...field} />
                        </FormControl>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={form.control}
                    name="phoneNumber"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Phone Number</FormLabel>
                        <FormControl>
                          <Input 
                            placeholder="Phone number" 
                            {...field} 
                            disabled={true} 
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Phone number cannot be changed after verification
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
                
                <FormField
                  control={form.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input placeholder="johnsmith" {...field} />
                      </FormControl>
                      <FormDescription>
                        This is your public display name.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <FormField
                  control={form.control}
                  name="bio"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Bio</FormLabel>
                      <FormControl>
                        <Textarea
                          placeholder="Tell us a little about yourself"
                          className="resize-none"
                          {...field}
                        />
                      </FormControl>
                      <FormDescription>
                        Your bio will be visible on your public profile.
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={form.control}
                    name="gender"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Gender</FormLabel>
                        <Select 
                          onValueChange={field.onChange} 
                          defaultValue={field.value}
                        >
                          <FormControl>
                            <SelectTrigger>
                              <SelectValue placeholder="Select your gender" />
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
                    control={form.control}
                    name="birthDate"
                    render={({ field }) => (
                      <FormItem className="flex flex-col">
                        <FormLabel>Date of Birth</FormLabel>
                        <BirthDatePicker date={field.value} setDate={field.onChange} />
                        <FormDescription>
                          You must be at least 18 years old.
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                </div>
              </CardContent>
            </Card>
            
            <SocialMediaSection form={form} />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isUpdating || !form.formState.isDirty}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Saving...
                  </>
                ) : 'Save Profile'}
              </Button>
            </div>
          </div>
        </form>
      </Form>
    </div>
  );
};

export default ProfileTab;
