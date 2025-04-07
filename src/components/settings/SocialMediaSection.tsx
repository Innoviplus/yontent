
import React from 'react';
import { UseFormReturn } from 'react-hook-form';
import { Loader2 } from 'lucide-react';
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

interface SocialMediaSectionProps {
  profileForm: UseFormReturn<any>;
  onSubmit: (values: any) => Promise<void>;
  isUpdating: boolean;
}

export const SocialMediaSection: React.FC<SocialMediaSectionProps> = ({
  profileForm,
  onSubmit,
  isUpdating,
}) => {
  const handleSubmit = async () => {
    await onSubmit(profileForm.getValues());
  };

  return (
    <div className="mt-8 text-left">
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
            className="w-full md:w-auto bg-brand-teal hover:bg-brand-darkTeal text-white" 
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
  );
};
