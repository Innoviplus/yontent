
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DeletionRequest, DeletionRequestStatus } from '../types/DeletionRequestTypes';

export const useDeletionRequests = () => {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  
  const fetchDeletionRequests = useCallback(async () => {
    setLoading(true);
    try {
      // First, fetch all deletion requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (requestsError) {
        throw requestsError;
      }
      
      // Now fetch profiles for each user_id_delete to properly join the data
      const userRequests: DeletionRequest[] = [];
      
      for (const request of requestsData) {
        // Get profile data for this user
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username, email, avatar')
          .eq('id', request.user_id_delete)
          .single();
          
        // Create a formatted request object with profile data
        userRequests.push({
          id: request.id,
          user_id: request.user_id_delete,
          created_at: request.created_at,
          status: request.status as DeletionRequestStatus,
          reason: request.reason,
          processed_by: request.processed_by,
          profile: profileData || null
        });
      }
      
      setRequests(userRequests);
    } catch (error: any) {
      console.error('Error fetching deletion requests:', error.message);
      toast.error('Failed to load deletion requests');
    } finally {
      setLoading(false);
    }
  }, []);
  
  // Load requests on component mount
  useEffect(() => {
    fetchDeletionRequests();
  }, [fetchDeletionRequests]);
  
  const approveRequest = useCallback(async (requestId: string) => {
    setProcessing(prev => ({ ...prev, [requestId]: true }));
    
    try {
      const requestDetails = requests.find(req => req.id === requestId);
      if (!requestDetails) {
        throw new Error('Request not found');
      }
      
      // 1. Get current user as processor
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Admin user not found');
      }
      
      // 2. Update reviews by this user to show "Account Disabled" status
      // Explicitly use the column name user_id to avoid ambiguity
      const { error: reviewsError } = await supabase
        .from('reviews')
        .update({ status: 'ACCOUNT_DISABLED' })
        .eq('user_id', requestDetails.user_id);
        
      if (reviewsError) {
        throw new Error(`Failed to update user reviews: ${reviewsError.message}`);
      }
      
      // 3. Update request status with explicit column reference to avoid ambiguity
      const { error: updateError } = await supabase
        .from('account_deletion_requests')
        .update({
          status: 'APPROVED' as DeletionRequestStatus,
          processed_by: user.id
        })
        .eq('id', requestId);
      
      if (updateError) {
        throw new Error(`Failed to update request status: ${updateError.message}`);
      }
      
      // 4. Success
      toast.success('Account disabled successfully');
      
      // 5. Refresh the list
      fetchDeletionRequests();
      
      return true;
    } catch (error: any) {
      console.error('Error disabling user account:', error.message);
      toast.error(`Failed to disable user account: ${error.message}`);
      return false;
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  }, [requests, fetchDeletionRequests]);
  
  const rejectRequest = useCallback(async (requestId: string) => {
    setProcessing(prev => ({ ...prev, [requestId]: true }));
    
    try {
      console.log('Rejecting request:', requestId);
      
      // 1. Get current user as processor
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Admin user not found');
      }
      
      // 2. Update request status in account_deletion_requests table
      // Using explicit column names to avoid ambiguity
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .update({
          status: 'REJECTED' as DeletionRequestStatus,
          processed_by: user.id
        })
        .eq('id', requestId)
        .select();
      
      if (error) {
        console.error('Database error when rejecting request:', error);
        throw error;
      }
      
      if (!data || data.length === 0) {
        throw new Error('No request was updated');
      }
      
      console.log('Request rejected successfully:', data);
      toast.success('Account deletion request rejected');
      await fetchDeletionRequests();
      return true;
    } catch (error: any) {
      console.error('Error rejecting deletion request:', error);
      toast.error(`Failed to reject deletion request: ${error.message}`);
      return false;
    } finally {
      setProcessing(prev => ({ ...prev, [requestId]: false }));
    }
  }, [fetchDeletionRequests]);
  
  return {
    requests,
    loading,
    processing,
    fetchDeletionRequests,
    approveRequest,
    rejectRequest
  };
};
