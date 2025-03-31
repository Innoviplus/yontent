
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import * as z from 'zod';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';
import { ExtendedProfile } from '@/lib/types';

// Form schema
export const settingsFormSchema = z.object({
  email: z.string().email("Please enter a valid email").optional(),
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
      phoneCountryCode: '',
      country: '',
    },
  });

  const onSettingsSubmit = async (values: z.infer<typeof settingsFormSchema>) => {
    if (!user) return;
    
    setIsUpdating(true);
    
    try {
      // Get current extended data
      const { data, error: fetchError } = await supabase
        .from('profiles')
        .select('extended_data, phone_number, phone_country_code')
        .eq('id', user.id)
        .single();
      
      if (fetchError) {
        throw fetchError;
      }
      
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
      
      // Update profile with new extended data, phone country code and potentially email
      const updateData: any = { 
        extended_data: jsonData,
        phone_country_code: values.phoneCountryCode || null,
        phone_number: values.phoneNumber || null
      };
      
      // Update email if provided and different from current email
      if (values.email && values.email !== user.email) {
        console.log('Updating email from', user.email, 'to', values.email);
        
        // Update email in auth user
        const { error: emailUpdateError } = await supabase.auth.updateUser({
          email: values.email
        });
        
        if (emailUpdateError) {
          console.error('Error updating email:', emailUpdateError);
          throw emailUpdateError;
        }
        
        sonnerToast.success('Email update verification sent. Please check your inbox.');
      }
      
      // Update profile
      const { error: updateError } = await supabase
        .from('profiles')
        .update(updateData)
        .eq('id', user.id);
      
      if (updateError) {
        console.error('Error updating profile:', updateError);
        throw updateError;
      }
      
      // Update local state
      setExtendedProfile(updatedExtendedData);
      
      sonnerToast.success('Settings updated successfully!');
    } catch (error: any) {
      toast({
        title: "Update Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsUpdating(false);
    }
  };

  const handleResetPassword = async () => {
    if (!user?.email) return;
    
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
