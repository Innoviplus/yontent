
import { useState, useCallback, useEffect } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { DeletionRequest } from '../types/DeletionRequestTypes';

export const useDeletionRequests = () => {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<Record<string, boolean>>({});
  
  const fetchDeletionRequests = useCallback(async () => {
    setLoading(true);
    try {
      // Fetch deletion requests with proper column mapping
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .select(`
          id,
          user_id_delete,
          created_at,
          status,
          reason,
          processed_by,
          profiles:user_id_delete (
            username,
            avatar,
            email
          )
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Transform data to match frontend type (using user_id as the frontend property)
      const formattedData: DeletionRequest[] = data.map(item => ({
        id: item.id,
        user_id: item.user_id_delete, // Map to expected property in frontend
        created_at: item.created_at,
        status: item.status,
        reason: item.reason,
        processed_by: item.processed_by,
        profile: item.profiles
      }));
      
      setRequests(formattedData);
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
      const { error: reviewsError } = await supabase
        .from('reviews')
        .update({ status: 'ACCOUNT_DISABLED' })
        .eq('user_id', requestDetails.user_id);
        
      if (reviewsError) {
        throw new Error(`Failed to update user reviews: ${reviewsError.message}`);
      }
      
      // 3. Update request status
      const { error: updateError } = await supabase
        .from('account_deletion_requests')
        .update({
          status: 'APPROVED',
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
      // 1. Get current user as processor
      const { data: { user } } = await supabase.auth.getUser();
      if (!user) {
        throw new Error('Admin user not found');
      }
      
      // 2. Update request status
      const { error } = await supabase
        .from('account_deletion_requests')
        .update({
          status: 'REJECTED',
          processed_by: user.id
        })
        .eq('id', requestId);
      
      if (error) {
        throw error;
      }
      
      toast.success('Account deletion request rejected');
      fetchDeletionRequests();
      return true;
    } catch (error: any) {
      console.error('Error rejecting deletion request:', error.message);
      toast.error('Failed to reject deletion request');
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
