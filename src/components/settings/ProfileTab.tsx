import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { useSettings } from '@/hooks/useSettings';
import { profileFormSchema, ProfileFormValues } from '@/schemas/profileFormSchema';
import { Form, FormControl, FormDescription, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { toast } from 'sonner';
import { BirthDatePicker } from './BirthDatePicker';
import { Loader2 } from 'lucide-react';
import { SocialMediaSection } from './SocialMediaSection';
import { AvatarSection } from '@/components/settings/AvatarSection';

const ProfileTab = () => {
  const { user, userProfile, refreshUserProfile } = useAuth();
  const { extendedProfile, isUpdating, profileForm, onProfileSubmit, handleAvatarUpload, avatarUrl, uploading } = useSettings();
  const [formSuccess, setFormSuccess] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [loadingAttempts, setLoadingAttempts] = useState(0);
  
  // Add refresh on mount and when user changes, with a retry limit
  useEffect(() => {
    if (user && loadingAttempts < 3) {
      console.log("ProfileTab: Refreshing user profile for user:", user.id, "Attempt:", loadingAttempts + 1);
      setIsLoading(true);
      refreshUserProfile()
        .then((profileData) => {
          console.log("ProfileTab: Profile refreshed successfully:", profileData);
          setIsLoading(false);
          // If we still don't have profile data, increment attempts
          if (!profileData) {
            setLoadingAttempts(prev => prev + 1);
          }
        })
        .catch(err => {
          console.error("ProfileTab: Error refreshing profile:", err);
          setIsLoading(false);
          setLoadingAttempts(prev => prev + 1);
        });
    }
  }, [user, refreshUserProfile, loadingAttempts]);
  
  // Force-stop loading after 5 seconds to prevent endless spinner
  useEffect(() => {
    let timeout: NodeJS.Timeout;
    
    if (isLoading) {
      timeout = setTimeout(() => {
        console.log("ProfileTab: Forcing loading state to end after timeout");
        setIsLoading(false);
      }, 5000);
    }
    
    return () => {
      if (timeout) clearTimeout(timeout);
    };
  }, [isLoading]);
  
  // Update form with profile data when it changes
  useEffect(() => {
    if (userProfile) {
      console.log("Setting form values from userProfile:", userProfile);
      
      profileForm.setValue('username', userProfile.username || '');
      profileForm.setValue('email', userProfile.email || user?.email || '');
      profileForm.setValue('phoneNumber', userProfile.phone_number || '');
      
      if (extendedProfile) {
        profileForm.setValue('firstName', extendedProfile.firstName || '');
        profileForm.setValue('lastName', extendedProfile.lastName || '');
        profileForm.setValue('bio', extendedProfile.bio || '');
        profileForm.setValue('gender', extendedProfile.gender || '');
        
        if (extendedProfile.birthDate) {
          profileForm.setValue('birthDate', new Date(extendedProfile.birthDate));
        }
        
        profileForm.setValue('websiteUrl', extendedProfile.websiteUrl || '');
        profileForm.setValue('facebookUrl', extendedProfile.facebookUrl || '');
        profileForm.setValue('instagramUrl', extendedProfile.instagramUrl || '');
        profileForm.setValue('youtubeUrl', extendedProfile.youtubeUrl || '');
        profileForm.setValue('tiktokUrl', extendedProfile.tiktokUrl || '');
      }
    }
  }, [userProfile, extendedProfile, profileForm, user]);
  
  const onSubmit = async (values: ProfileFormValues) => {
    if (!user) return;
    
    setIsLoading(true);
    setFormSuccess(false);
    
    try {
      await onProfileSubmit(values);
      
      await refreshUserProfile();
      
      setFormSuccess(true);
      toast.success('Profile updated successfully');
    } catch (error) {
      console.error("Error updating profile:", error);
      toast.error('Failed to update profile');
    } finally {
      setIsLoading(false);
    }
  };
  
  // Show at least a basic form even if profile data is not yet loaded
  if (isLoading && !userProfile) {
    return (
      <div className="flex justify-center items-center p-8">
        <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
      </div>
    );
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle>Profile Picture</CardTitle>
          <CardDescription>
            Add a profile picture to personalize your account
          </CardDescription>
        </CardHeader>
        <CardContent className="flex justify-center">
          <AvatarSection
            avatarUrl={avatarUrl || userProfile?.avatar}
            username={userProfile?.username}
            uploading={uploading}
            handleAvatarUpload={handleAvatarUpload}
          />
        </CardContent>
      </Card>

      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onSubmit)}>
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
                
                
                <div className="grid gap-4 grid-cols-1 md:grid-cols-2">
                  <FormField
                    control={profileForm.control}
                    name="email"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Email</FormLabel>
                        <FormControl>
                          <Input 
                            type="email" 
                            placeholder="john.doe@example.com" 
                            {...field} 
                            disabled={true}
                            className="bg-gray-100 cursor-not-allowed"
                          />
                        </FormControl>
                        <FormDescription className="text-xs">
                          Email cannot be changed after registration
                        </FormDescription>
                        <FormMessage />
                      </FormItem>
                    )}
                  />
                  
                  <FormField
                    control={profileForm.control}
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
                  control={profileForm.control}
                  name="username"
                  render={({ field }) => (
                    <FormItem>
                      <FormLabel>Username</FormLabel>
                      <FormControl>
                        <Input 
                          placeholder="johnsmith" 
                          {...field} 
                          disabled={true}
                          className="bg-gray-100 cursor-not-allowed"
                        />
                      </FormControl>
                      <FormDescription className="text-xs">
                        Username cannot be changed after registration
                      </FormDescription>
                      <FormMessage />
                    </FormItem>
                  )}
                />
                
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
                    control={profileForm.control}
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
                    control={profileForm.control}
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
            
            <SocialMediaSection 
              profileForm={profileForm} 
              onSubmit={onSubmit} 
              isUpdating={isUpdating || isLoading} 
            />
            
            <div className="flex justify-end">
              <Button 
                type="submit" 
                className="w-full md:w-auto"
                disabled={isUpdating || isLoading || !profileForm.formState.isDirty}
              >
                {isUpdating || isLoading ? (
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
