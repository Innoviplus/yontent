
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
    <div className="space-y-6">
      <FormField
        control={profileForm.control}
        name="websiteUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Website</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://yourwebsite.com" 
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
        name="facebookUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Facebook</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://facebook.com/yourusername" 
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
        name="instagramUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Instagram</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://instagram.com/yourusername" 
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
        name="twitterUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Twitter</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://twitter.com/yourusername" 
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
        name="youtubeUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>YouTube</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://youtube.com/@yourchannel" 
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
        name="tiktokUrl"
        render={({ field }) => (
          <FormItem>
            <FormLabel>TikTok</FormLabel>
            <FormControl>
              <Input 
                placeholder="https://tiktok.com/@yourusername" 
                {...field}
                value={field.value || ''}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
    </div>
  );
};
