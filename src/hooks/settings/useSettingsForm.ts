
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { ExtendedProfile } from '@/lib/types';

// Form schema
export const settingsFormSchema = z.object({
  email: z.string().email("Please enter a valid email").optional().or(z.string().length(0)),
  phoneNumber: z.string().optional(),
  phoneCountryCode: z.string().optional(),
  country: z.string().optional(),
});

export const useSettingsForm = (
  user: any,
  setExtendedProfile: (profile: ExtendedProfile | null) => void,
  setIsUpdating: (updating: boolean) => void
) => {
  const { toast } = useToast();

  const settingsForm = useForm<z.infer<typeof settingsFormSchema>>({
    resolver: zodResolver(settingsFormSchema),
    defaultValues: {
      email: user?.email || '',
      phoneNumber: '',
      phoneCountryCode: '+1',
      country: '',
    },
  });

  const onSettingsSubmit = async (values: z.infer<typeof settingsFormSchema>) => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      console.log('Submitting settings with values:', values);
      
      // Get current extended data
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('extended_data, phone_number, phone_country_code')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching profile data:', fetchError);
        throw fetchError;
      }
      
      // Update extended data with new settings
      const currentExtendedData = data.extended_data as ExtendedProfile || {};
      const updatedExtendedData: ExtendedProfile = {
        ...currentExtendedData,
        phoneNumber: values.phoneNumber || null,
        country: values.country || null,
        email: values.email || null, // Store email in extended_data as well
      };
      
      // Convert ExtendedProfile to a plain object for storage
      const jsonData = Object.fromEntries(
        Object.entries(updatedExtendedData).map(([key, value]) => [key, value])
      );
      
      console.log('Updated extended data:', jsonData);
      console.log('Updating email to:', values.email);
      
      // Update profile with new extended data, phone country code and email
      const { error: updateError } = await supabase
        .from('profiles')
        .update({ 
          extended_data: jsonData,
          phone_country_code: values.phoneCountryCode || null,
          phone_number: values.phoneNumber || null,
          email: values.email || null // Add email directly to the profiles table
        })
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }
      
      // Try to update the email in auth.users table as well (without verification)
      if (values.email && values.email !== user.email) {
        try {
          // Just trying to update the email in the user's session metadata
          // This won't trigger verification emails since we're not using updateUser with email param
          const { error: sessionUpdateError } = await supabase.auth.updateUser({
            data: { email: values.email }
          });
          
          if (sessionUpdateError) {
            console.log('Note: Could not update email in session data:', sessionUpdateError);
            // Don't throw error here, as the main profile update succeeded
          }
        } catch (emailErr) {
          console.log('Non-critical error updating session data:', emailErr);
          // Don't throw here since we successfully updated the profiles table
        }
      }
      
      // Update local state
      setExtendedProfile(updatedExtendedData);
      
      sonnerToast.success('Settings updated successfully!');
    } catch (error: any) {
      console.error('Settings update error:', error);
      toast({
        title: "Update Failed",
        description: error.message || "Failed to update settings. Please try again.",
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) {
      toast({
        title: "Email Required",
        description: "Please add an email address to your account before resetting your password.",
        variant: "destructive",
      });
      return;
    }
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(user.email);
      
      if (error) {
        throw error;
      }
      
      sonnerToast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      toast({
        title: "Reset Password Failed",
        description: error.message,
        variant: "destructive",
      });
    }
  };

  return {
    settingsForm,
    onSettingsSubmit,
    handleResetPassword
  };
};
