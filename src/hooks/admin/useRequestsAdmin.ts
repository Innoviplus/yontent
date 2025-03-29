
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import { RedemptionRequest } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { approveRedemptionRequest, rejectRedemptionRequest } from '@/services/redemptionService';

export const useRequestsAdmin = () => {
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [activeTab, setActiveTab] = useState('pending');
  const [isRefreshing, setIsRefreshing] = useState(false);

  // Fetch redemption requests
  const fetchRequests = async () => {
    try {
      setIsLoading(true);
      
      // Fetch requests from Supabase with proper joins
      const { data, error } = await supabase
        .from('redemption_requests')
        .select(`
          id,
          user_id,
          item_id,
          status,
          created_at,
          updated_at,
          payment_details,
          points_amount,
          username,
          redemption_items(name)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Format data for component
      const formattedRequests: RedemptionRequest[] = (data || []).map(req => ({
        id: req.id,
        userId: req.user_id,
        itemId: req.item_id,
        status: req.status as 'PENDING' | 'APPROVED' | 'REJECTED',
        createdAt: new Date(req.created_at),
        updatedAt: new Date(req.updated_at),
        paymentDetails: req.payment_details as RedemptionRequest['paymentDetails'],
        pointsAmount: req.points_amount,
        userName: req.username || 'Unknown User',
        itemName: req.redemption_items?.name || 'Unknown Item'
      }));
      
      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching redemption requests:', error);
      toast.error('Failed to load redemption requests');
    } finally {
      setIsLoading(false);
    }
  };

  // Load requests on component mount
  useEffect(() => {
    fetchRequests();
  }, []);

  // Refresh requests
  const refreshRequests = async () => {
    setIsRefreshing(true);
    await fetchRequests();
    setIsRefreshing(false);
  };

  // Approve request
  const handleApproveRequest = async (requestId: string) => {
    try {
      const result = await approveRedemptionRequest(requestId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, status: 'APPROVED' } : req
        )
      );
      
      toast.success('Redemption request approved successfully');
      return true;
    } catch (error: any) {
      console.error('Error approving request:', error);
      toast.error(error.message || 'Failed to approve request');
      return false;
    }
  };

  // Reject request
  const handleRejectRequest = async (requestId: string) => {
    try {
      const result = await rejectRedemptionRequest(requestId);
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Update local state
      setRequests(prevRequests => 
        prevRequests.map(req => 
          req.id === requestId ? { ...req, status: 'REJECTED' } : req
        )
      );
      
      toast.success('Redemption request rejected successfully');
      return true;
    } catch (error: any) {
      console.error('Error rejecting request:', error);
      toast.error(error.message || 'Failed to reject request');
      return false;
    }
  };

  return {
    requests,
    isLoading,
    activeTab,
    setActiveTab,
    isRefreshing,
    refreshRequests,
    handleApproveRequest,
    handleRejectRequest
  };
};
