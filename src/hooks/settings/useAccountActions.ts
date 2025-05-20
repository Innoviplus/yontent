
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
    try {
      if (!window.confirm('Are you sure you want to delete your account? This action cannot be undone.')) {
        return;
      }
      
      setIsDeleting(true);
      
      // Get the current user
      const { data: userData } = await supabase.auth.getUser();
      if (!userData.user) {
        throw new Error('User not authenticated');
      }

      // Create account_deletion_requests record
      const { error: insertError } = await supabase
        .from('account_deletion_requests')
        .insert({
          user_id: userData.user.id,
          status: 'PENDING',
          reason: 'User requested account deletion',
        });

      if (insertError) {
        throw insertError;
      }
      
      toast.success('Account scheduled for deletion');
      
      // Log the user out after deletion request
      await handleLogout();
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
