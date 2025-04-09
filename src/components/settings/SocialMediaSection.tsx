
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Form, FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Loader2 } from 'lucide-react';

interface SocialMediaSectionProps {
  profileForm: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  profileForm,
  onSubmit,
  isUpdating
}) => {
  return (
    <div className="space-y-6">
      <div className="text-left">
        <h3 className="text-lg font-medium text-left">Social Media Profiles</h3>
        <p className="text-sm text-gray-500 text-left">Link your social media accounts to your profile</p>
      </div>
      
      <Form {...profileForm}>
        <form onSubmit={profileForm.handleSubmit(onSubmit)} className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <FormField
              control={profileForm.control}
              name="websiteUrl"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Website</FormLabel>
                  <FormControl>
                    <Input placeholder="https://yourwebsite.com" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={profileForm.control}
              name="facebookUrl"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Facebook</FormLabel>
                  <FormControl>
                    <Input placeholder="https://facebook.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={profileForm.control}
              name="instagramUrl"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>Instagram</FormLabel>
                  <FormControl>
                    <Input placeholder="https://instagram.com/username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={profileForm.control}
              name="youtubeUrl"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>YouTube</FormLabel>
                  <FormControl>
                    <Input placeholder="https://youtube.com/channel" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            
            <FormField
              control={profileForm.control}
              name="tiktokUrl"
              render={({ field }) => (
                <FormItem className="text-left">
                  <FormLabel>TikTok</FormLabel>
                  <FormControl>
                    <Input placeholder="https://tiktok.com/@username" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
          </div>
          
          <div className="flex justify-start">
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
          </div>
        </form>
      </Form>
    </div>
  );
};
