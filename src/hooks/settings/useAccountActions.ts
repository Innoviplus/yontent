import { useState } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

export const useAccountActions = (userId: string) => {
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const requestAccountDeletion = async (reason: string) => {
    if (!userId) return false;
    
    try {
      setIsSubmitting(true);
      
      // Check if user already has a pending request
      const { data: existingRequests, error: checkError } = await supabase
        .from('account_deletion_requests')
        .select('id, status')
        .eq('user_id_delete', userId)
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
      
      // Create a new deletion request
      const { error } = await supabase
        .from('account_deletion_requests')
        .insert({
          user_id_delete: userId,
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
    } catch (error) {
      console.error('Error in requestAccountDeletion:', error);
      toast.error('An unexpected error occurred. Please try again later.');
      return false;
    } finally {
      setIsSubmitting(false);
    }
  };

  // Other functions...
  
  return {
    requestAccountDeletion,
    isSubmitting,
    isDeleting
  };
};
