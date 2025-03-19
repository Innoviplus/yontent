
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';

interface SocialMediaTabProps {
  profileForm: UseFormReturn<any>;
  onSubmit: () => void;
  isUpdating: boolean;
}

export const SocialMediaTab: React.FC<SocialMediaTabProps> = ({
  profileForm,
  onSubmit,
  isUpdating
}) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Social Media Profiles</CardTitle>
        <CardDescription>Connect your social media accounts</CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...profileForm}>
          <form className="space-y-6">
            <FormField
              control={profileForm.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Website</FormLabel>
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
                  <FormLabel>Facebook Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/username" {...field} value={field.value || ''} />
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
                  <FormLabel>Instagram Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/username" {...field} value={field.value || ''} />
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
                  <FormLabel>YouTube Channel</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/c/channelname" {...field} value={field.value || ''} />
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
                  <FormLabel>TikTok Profile</FormLabel>
                  <FormControl>
                    <Input placeholder="https://tiktok.com/@username" {...field} value={field.value || ''} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <Button type="button" onClick={onSubmit} disabled={isUpdating}>
              {isUpdating && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
              Save Social Profiles
            </Button>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
};
