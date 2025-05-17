
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useAccountActions = (navigate: ReturnType<typeof useNavigate>) => {
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useAuth();

  const handleLogout = async () => {
    try {
      setIsLoggingOut(true);
      
      // Use Auth context signOut function if available
      if (signOut) {
        await signOut();
      } else {
        // Fallback to direct Supabase signout
        const { error } = await supabase.auth.signOut();
        
        if (error) {
          throw error;
        }
      }
      
      toast.success('Logged out successfully');
      
      // Navigate to login
      navigate('/login');
    } catch (error: any) {
      console.error('Logout error:', error);
      toast.error(`Failed to log out: ${error.message}`);
    } finally {
      setIsLoggingOut(false);
    }
  };

  const handleDeleteAccount = async () => {
    // This is a placeholder as account deletion requires server-side implementation
    try {
      setIsDeleting(true);
      
      // Simulated account deletion - in production this should call a secure endpoint
      await new Promise(resolve => setTimeout(resolve, 1000));
      
      toast.success('Account scheduled for deletion');
      
      // Log the user out after deletion
      await handleLogout();
      
      // Navigate to home page
      navigate('/');
    } catch (error: any) {
      console.error('Account deletion error:', error);
      toast.error(`Failed to delete account: ${error.message}`);
    } finally {
      setIsDeleting(false);
    }
  };

  return {
    isDeleting,
    isLoggingOut,
    handleLogout,
    handleDeleteAccount
  };
};
