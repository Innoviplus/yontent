
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { useToast } from '@/hooks/use-toast';
import { toast as sonnerToast } from 'sonner';

export const usePasswordReset = () => {
  const { toast } = useToast();
  const [isResetting, setIsResetting] = useState(false);
  
  const handleResetPassword = async (email: string) => {
    if (!email) {
      sonnerToast.error('Email is required for password reset');
      return;
    }
    
    setIsResetting(true);
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/reset-password` }
      );
      
      if (error) throw error;
      
      sonnerToast.success('Password reset email sent. Please check your inbox.');
    } catch (error: any) {
      toast({
        title: "Password Reset Failed",
        description: error.message,
        variant: "destructive",
      });
    } finally {
      setIsResetting(false);
    }
  };

  return {
    handleResetPassword,
    isResetting
  };
};
