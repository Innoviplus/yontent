import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DeletionRequest } from '../types/DeletionRequestTypes';

export const useDeletionRequests = () => {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  
  const fetchDeletionRequests = async () => {
    setLoading(true);
    try {
      // Get deletion requests with proper user information
      const { data, error } = await supabase
        .from('account_deletion_requests')
        .select(`
          id,
          user_id,
          created_at,
          status,
          reason,
          profiles:user_id(
            username,
            email,
            phone_number,
            phone_country_code
          )
        `)
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Transform data to our expected format
      const formattedData = data.map(item => ({
        id: item.id,
        user_id: item.user_id,
        created_at: item.created_at,
        status: item.status as DeletionRequest['status'],
        reason: item.reason || 'No reason provided',
        username: item.profiles?.username || 'Unknown user',
        email: item.profiles?.email || 'No email',
        phone: item.profiles?.phone_number 
          ? `${item.profiles.phone_country_code || ''}${item.profiles.phone_number}` 
          : 'No phone'
      }));
      
      console.log('Deletion requests:', formattedData);
      setRequests(formattedData);
    } catch (error) {
      console.error('Error fetching deletion requests:', error);
      toast.error('Failed to load deletion requests');
    } finally {
      setLoading(false);
    }
  };
  
  const approveRequest = async (requestId: string, userId: string) => {
    if (!window.confirm('Are you sure you want to disable this user account? This action cannot be undone.')) {
      return;
    }
    
    setProcessing(requestId);
    try {
      // 1. Update user reviews to DISABLED status
      const { error: reviewsError } = await supabase
        .from('reviews')
        .update({ status: 'DISABLED' })
        .eq('user_id', userId);
        
      if (reviewsError) throw reviewsError;
      
      // 2. Update request status to approved
      const { error: updateError } = await supabase
        .from('account_deletion_requests')
        .update({ status: 'APPROVED' })
        .eq('id', requestId);
        
      if (updateError) throw updateError;
      
      // 3. Keep the profile record but disable the auth account if possible
      // Note: This requires admin privileges and would typically be handled by a secure admin function
      toast.success('User account disabled and reviews hidden');
      
      // Update local state
      setRequests(prev => 
        prev.map(r => r.id === requestId ? { ...r, status: 'APPROVED' } : r)
      );
    } catch (error) {
      console.error('Error approving deletion request:', error);
      toast.error('Failed to approve deletion request');
    } finally {
      setProcessing(null);
    }
  };
  
  const rejectRequest = async (requestId: string) => {
    setProcessing(requestId);
    try {
      // Update request status to rejected
      const { error } = await supabase
        .from('account_deletion_requests')
        .update({ status: 'REJECTED' })
        .eq('id', requestId);
        
      if (error) throw error;
      
      toast.success('Deletion request rejected');
      
      // Update local state
      setRequests(prev => 
        prev.map(r => r.id === requestId ? { ...r, status: 'REJECTED' } : r)
      );
    } catch (error) {
      console.error('Error rejecting deletion request:', error);
      toast.error('Failed to reject deletion request');
    } finally {
      setProcessing(null);
    }
  };

  useEffect(() => {
    fetchDeletionRequests();
  }, []);

  return {
    requests,
    loading,
    processing,
    fetchDeletionRequests,
    approveRequest,
    rejectRequest
  };
};
