
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
      
      // Get current profile data
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('extended_data, phone_number, phone_country_code, email')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        console.error('Error fetching profile data:', fetchError);
        throw fetchError;
      }
      
      console.log('Current profile data:', data);
      
      // Update extended data with new settings
      const currentExtendedData = data.extended_data as ExtendedProfile || {};
      const updatedExtendedData: ExtendedProfile = {
        ...currentExtendedData,
        phoneNumber: values.phoneNumber || null,
        country: values.country || null,
      };
      
      // Convert ExtendedProfile to a plain object for storage
      const jsonData = Object.fromEntries(
        Object.entries(updatedExtendedData).map(([key, value]) => [key, value])
      );
      
      console.log('Updated extended data:', jsonData);
      console.log('Updating email to:', values.email);
      
      // Call the edge function to update the email in both the email column and profile's extended_data
      const { data: edgeFunctionData, error: edgeFunctionError } = await supabase.functions.invoke(
        'update_profile_email',
        {
          body: JSON.stringify({
            user_id: user.id,
            new_email: values.email || null
          })
        }
      );
      
      if (edgeFunctionError) {
        console.error('Error calling edge function:', edgeFunctionError);
        
        // Fallback to direct update if edge function fails
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            email: values.email || null,
            extended_data: {
              ...jsonData,
              email: values.email || null  // Store email in extended_data for backward compatibility
            },
            phone_country_code: values.phoneCountryCode || null,
            phone_number: values.phoneNumber || null
          })
          .eq('id', user.id);
        
        if (updateError) {
          console.error('Error updating profile:', updateError);
          throw updateError;
        }
      } else {
        console.log('Edge function response:', edgeFunctionData);
        
        // Update other profile fields except email (which was handled by the edge function)
        const { error: updateError } = await supabase
          .from('profiles')
          .update({ 
            phone_country_code: values.phoneCountryCode || null,
            phone_number: values.phoneNumber || null
          })
          .eq('id', user.id);
          
        if (updateError) {
          console.error('Error updating profile fields:', updateError);
          throw updateError;
        }
      }
      
      // Update local state with the new extended profile data
      const updatedProfile = {
        ...currentExtendedData,
        ...updatedExtendedData,
        email: values.email || null
      };
      setExtendedProfile(updatedProfile);
      
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
