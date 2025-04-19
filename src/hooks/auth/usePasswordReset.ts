
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const usePasswordReset = () => {
  const [isResetting, setIsResetting] = useState(false);
  
  const handleResetPassword = async (email: string) => {
    if (!email) {
      toast.error('Email is required for password reset');
      return;
    }
    
    setIsResetting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      
      if (error) throw error;
      
      toast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      toast.error(error.message || "Failed to send password reset email");
    } finally {
      setIsResetting(false);
    }
  };

  return {
    handleResetPassword,
    isResetting
  };
};
