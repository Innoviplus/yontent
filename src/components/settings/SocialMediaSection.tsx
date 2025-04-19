
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { FormField, FormItem, FormLabel, FormControl, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';

interface SocialMediaSectionProps {
  profileForm: UseFormReturn<any>;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  profileForm
}) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      <FormField
        control={profileForm.control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem className="text-left">
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
          <FormItem className="text-left">
            <FormLabel>Facebook</FormLabel>
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
          <FormItem className="text-left">
            <FormLabel>Instagram</FormLabel>
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
          <FormItem className="text-left">
            <FormLabel>YouTube</FormLabel>
            <FormControl>
              <Input placeholder="https://youtube.com/channel" {...field} value={field.value || ''} />
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
              <Input placeholder="https://tiktok.com/@username" {...field} value={field.value || ''} />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
