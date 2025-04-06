
import React, { useEffect, useRef } from 'react';
import { UseFormReturn } from 'react-hook-form';
import { ProfileInfoForm } from './ProfileInfoForm';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Camera, Loader2, Upload } from 'lucide-react';
import { Form, FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { toast } from 'sonner';
import { Separator } from '@/components/ui/separator';

interface ProfileTabProps {
  userProfile: any;
  avatarUrl: string | null;
  uploading: boolean;
  handleAvatarUpload: (event: React.ChangeEvent<HTMLInputElement>) => Promise<void>;
  profileForm: UseFormReturn<any>;
  onProfileSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
  extendedProfile: any;
}

export const ProfileTab: React.FC<ProfileTabProps> = ({
  userProfile,
  avatarUrl,
  uploading,
  handleAvatarUpload,
  profileForm,
  onProfileSubmit,
  isUpdating,
  extendedProfile
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  
  // Ensure avatar URL is properly set and logged for debugging
  useEffect(() => {
    console.log("ProfileTab - Current avatar URL:", avatarUrl);
    console.log("ProfileTab - User profile avatar:", userProfile?.avatar);
  }, [userProfile, avatarUrl]);

  // Log the current state for debugging
  useEffect(() => {
    console.log("ProfileTab loaded with:", {
      hasUserProfile: !!userProfile,
      avatarUrl,
      uploading,
      profileFormValues: profileForm?.formState?.defaultValues
    });
  }, [userProfile, avatarUrl, uploading, profileForm]);

  const triggerAvatarUpload = () => {
    if (fileInputRef.current) {
      fileInputRef.current.click();
    } else {
      toast.error("Cannot access file input");
    }
  };

  const handleSubmit = async () => {
    await onProfileSubmit(profileForm.getValues());
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Profile Information</CardTitle>
        <CardDescription>Update your profile information and personal details</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="flex flex-col md:flex-row gap-8 mb-8">
          <div className="flex flex-col items-center">
            <Avatar className="w-32 h-32 mb-4 border-2 border-gray-200">
              <AvatarImage src={avatarUrl || ''} alt={userProfile?.username || 'User'} />
              <AvatarFallback className="bg-primary/10">
                {userProfile?.username ? userProfile.username.charAt(0).toUpperCase() : 'U'}
              </AvatarFallback>
            </Avatar>
            <div className="relative">
              <Input
                type="file"
                accept="image/jpeg,image/png,image/gif,image/webp"
                onChange={handleAvatarUpload}
                className="hidden"
                id="avatar-upload"
                disabled={uploading}
                ref={fileInputRef}
              />
              <Button
                variant="outline"
                className="relative"
                asChild
                disabled={uploading}
              >
                <label htmlFor="avatar-upload" className="cursor-pointer flex items-center">
                  {uploading ? (
                    <Loader2 className="h-4 w-4 animate-spin mr-2" />
                  ) : (
                    <Upload className="h-4 w-4 mr-2" />
                  )}
                  {uploading ? 'Uploading...' : 'Change Avatar'}
                </label>
              </Button>
            </div>
            {!avatarUrl && !uploading && (
              <p className="text-xs text-gray-500 mt-2">Upload an image to personalize your profile</p>
            )}
          </div>
          
          <div className="flex-1">
            <ProfileInfoForm 
              profileForm={profileForm}
              onProfileSubmit={onProfileSubmit}
              isUpdating={isUpdating}
            />
          </div>
        </div>

        <Separator className="my-8" />
        
        {/* Social Media Profiles Section */}
        <div className="mt-8">
          <h3 className="text-lg font-medium mb-4">Social Media Profiles</h3>
          <Form {...profileForm}>
            <div className="space-y-6">
              <FormField
                control={profileForm.control}
                name="websiteUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Personal Website</FormLabel>
                    <FormControl>
                      <Input placeholder="https://yourwebsite.com" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="facebookUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Facebook</FormLabel>
                    <FormControl>
                      <Input placeholder="https://facebook.com/yourusername" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="instagramUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>Instagram</FormLabel>
                    <FormControl>
                      <Input placeholder="https://instagram.com/yourusername" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="youtubeUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>YouTube</FormLabel>
                    <FormControl>
                      <Input placeholder="https://youtube.com/c/yourchannel" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <FormField
                control={profileForm.control}
                name="tiktokUrl"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>TikTok</FormLabel>
                    <FormControl>
                      <Input placeholder="https://tiktok.com/@yourusername" {...field} value={field.value || ''} />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              
              <Button 
                type="button" 
                onClick={handleSubmit}
                className="w-full md:w-auto" 
                disabled={isUpdating}
              >
                {isUpdating ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Updating...
                  </>
                ) : 'Save Profile'}
              </Button>
            </div>
          </Form>
        </div>
      </CardContent>
    </Card>
  );
};
