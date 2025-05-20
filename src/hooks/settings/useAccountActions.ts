
import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { NavigateFunction } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

export const useAccountActions = (navigateOrUserId: NavigateFunction | string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);
  const { signOut } = useAuth();
  const isNavigate = typeof navigateOrUserId !== 'string';
  const userId = isNavigate ? '' : navigateOrUserId;
  
  const requestAccountDeletion = async (reason: string) => {
    const actualUserId = userId || (await supabase.auth.getUser()).data.user?.id;
    if (!actualUserId) {
      toast.error('User not authenticated');
      return false;
    }
    
    try {
      setIsSubmitting(true);
      
      // Check if user already has a pending request
      const { data: existingRequests, error: checkError } = await supabase
        .from('account_deletion_requests')
        .select('id, status')
        .eq('user_id_delete', actualUserId)
        .order('created_at', { ascending: false })
        .limit(1);
      
      if (checkError) {
        console.error('Error checking existing deletion requests:', checkError);
        toast.error('Unable to submit deletion request. Please try again later.');
        return false;
      }
      
      // If there's an existing pending request, don't create a new one
      if (existingRequests && existingRequests.length > 0) {
        const latestRequest = existingRequests[0];
        if (latestRequest.status === 'PENDING') {
          toast.error('You already have a pending account deletion request.');
          return false;
        }
      }
      
      // Create a new deletion request using the correct column name
      const { error } = await supabase
        .from('account_deletion_requests')
        .insert({
          user_id_delete: actualUserId,
          reason: reason,
          status: 'PENDING'
        });
      
      if (error) {
        console.error('Error creating deletion request:', error);
        toast.error('Failed to submit deletion request. Please try again later.');
        return false;
      }
      
      toast.success('Your account deletion request has been submitted. An administrator will review your request.');
      return true;
    } catch (error: any) {
      console.error('Error in requestAccountDeletion:', error);
      toast.error('An unexpected error occurred. Please try again later.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  const handleDeleteAccount = async () => {
    setIsDeleting(true);
    try {
      // Show prompt to get reason
      const reason = prompt('Please provide a reason for disabling your account:');
      
      if (!reason) {
        toast.error('Please provide a reason for account deletion.');
        return;
      }
      
      const success = await requestAccountDeletion(reason);
      
      if (success) {
        toast.success('Your account deletion request has been submitted');
      }
    } catch (error) {
      console.error('Error in handleDeleteAccount:', error);
      toast.error('Failed to submit account deletion request');
    } finally {
      setIsDeleting(false);
    }
  };
  
  const handleLogout = async () => {
    setIsLoggingOut(true);
    try {
      await signOut();
      toast.success('Logged out successfully');
      if (isNavigate) {
        (navigateOrUserId as NavigateFunction)('/login');
      }
    } catch (error) {
      console.error('Error logging out:', error);
      toast.error('Failed to log out');
    } finally {
      setIsLoggingOut(false);
    }
  };
  
  return {
    requestAccountDeletion,
    handleDeleteAccount,
    handleLogout,
    isSubmitting,
    isDeleting,
    isLoggingOut
  };
};
