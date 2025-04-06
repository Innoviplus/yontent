import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2 } from 'lucide-react';

interface SocialMediaTabProps {
  profileForm: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
}

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({
  profileForm,
  onSubmit,
  isUpdating,
}) => {
  const handleSubmit = async () => {
    // Get only social media related values from the form
    const values = profileForm.getValues();
    const socialMediaValues = {
      websiteUrl: values.websiteUrl,
      facebookUrl: values.facebookUrl,
      instagramUrl: values.instagramUrl,
      youtubeUrl: values.youtubeUrl,
      tiktokUrl: values.tiktokUrl,
      // Keep other values from the form to preserve them
      username: values.username,
      firstName: values.firstName,
      lastName: values.lastName,
      bio: values.bio,
      gender: values.gender,
      birthDate: values.birthDate,
    };
    
    // Submit only social media related values
    await onSubmit(socialMediaValues);
  };

  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Profiles</CardTitle>
        <CardDescription>Connect your social media accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...profileForm}>
          <div className="space-y-8">
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
              ) : 'Save Social Media'}
            </Button>
          </div>
        </Form>
      </CardContent>
    </Card>
  );
};
