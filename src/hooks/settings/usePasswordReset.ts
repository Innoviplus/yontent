
import { useState } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

export const usePasswordReset = () => {
  const [isLoading, setIsLoading] = useState(false);

  const handleResetPassword = async (email: string) => {
    if (!email) {
      toast.error('Please enter your email address');
      return;
    }

    setIsLoading(true);

    try {
      const { error } = await supabase.auth.resetPasswordForEmail(email, {
        redirectTo: `${window.location.origin}/reset-password`,
      });

      if (error) {
        throw error;
      }

      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      console.error('Password reset error:', error);
      toast.error(`Failed to send reset email: ${error.message}`);
    } finally {
      setIsLoading(false);
    }
  };

  return {
    isLoading,
    handleResetPassword,
  };
};
