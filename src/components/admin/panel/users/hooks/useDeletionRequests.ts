
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { DeletionRequest, DeletionRequestStatus } from '../types/DeletionRequestTypes';

export const useDeletionRequests = () => {
  const [requests, setRequests] = useState<DeletionRequest[]>([]);
  const [loading, setLoading] = useState(true);
  const [processing, setProcessing] = useState<string | null>(null);
  
  const fetchDeletionRequests = async () => {
    setLoading(true);
    try {
      // First get deletion requests
      const { data: requestsData, error: requestsError } = await supabase
        .from('account_deletion_requests')
        .select('*')
        .order('created_at', { ascending: false });

      if (requestsError) throw requestsError;
      
      // Separately get user profiles for each request
      const userRequests: DeletionRequest[] = await Promise.all(
        requestsData.map(async (request) => {
          const { data: profileData, error: profileError } = await supabase
            .from('profiles')
            .select('username, email, phone_number, phone_country_code')
            .eq('id', request.user_id_delete) // Updated to use user_id_delete
            .single();
            
          if (profileError) {
            console.error(`Error fetching profile for user ${request.user_id_delete}:`, profileError);
            return {
              id: request.id,
              user_id: request.user_id_delete, // Updated to use user_id_delete
              created_at: request.created_at,
              status: request.status as DeletionRequestStatus,
              reason: request.reason || 'No reason provided',
              username: 'Unknown user',
              email: 'No email',
              phone: 'No phone'
            };
          }
          
          return {
            id: request.id,
            user_id: request.user_id_delete, // Updated to use user_id_delete
            created_at: request.created_at,
            status: request.status as DeletionRequestStatus,
            reason: request.reason || 'No reason provided',
            username: profileData?.username || 'Unknown user',
            email: profileData?.email || 'No email',
            phone: profileData?.phone_number 
              ? `${profileData?.phone_country_code || ''}${profileData?.phone_number}` 
              : 'No phone'
          };
        })
      );
      
      console.log('Deletion requests:', userRequests);
      setRequests(userRequests);
    } catch (error) {
      console.error('Error fetching deletion requests:', error);
      toast.error('Failed to load deletion requests');
    } finally {
      setLoading(false);
    }
  };
  
  const approveRequest = async (requestId: string, userId: string) => {
    if (!window.confirm('Are you sure you want to disable this user account? This action cannot be undone. The user will no longer be able to log in, but their profile information will be retained.')) {
      return;
    }
    
    setProcessing(requestId);
    try {
      console.log(`Disabling account for user ${userId}, request ${requestId}`);
      
      // Update user reviews to DISABLED status
      const { error: reviewsError } = await supabase
        .from('reviews')
        .update({ status: 'DISABLED' })
        .eq('user_id', userId);
        
      if (reviewsError) {
        console.error('Error updating reviews:', reviewsError);
        throw new Error(`Failed to update user reviews: ${reviewsError.message}`);
      }
      
      console.log('Reviews updated successfully');
      
      // Update request status to approved
      const { error: updateError } = await supabase
        .from('account_deletion_requests')
        .update({ status: 'APPROVED' })
        .eq('id', requestId);
        
      if (updateError) {
        console.error('Error updating request status:', updateError);
        throw new Error(`Failed to update request status: ${updateError.message}`);
      }
      
      console.log('Request status updated successfully');
      
      toast.success('User account disabled and reviews hidden');
      
      // Update local state
      setRequests(prev => 
        prev.map(r => r.id === requestId ? { ...r, status: 'APPROVED' } : r)
      );
    } catch (error: any) {
      console.error('Error approving deletion request:', error);
      toast.error(`Failed to disable user account: ${error.message}`);
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
        prev.map(r => r.id === requestId ? { ...r, status: 'REJECTED' as DeletionRequestStatus } : r)
      );
    } catch (error: any) {
      console.error('Error rejecting deletion request:', error);
      toast.error(`Failed to reject deletion request: ${error.message}`);
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
