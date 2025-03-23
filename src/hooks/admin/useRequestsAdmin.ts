
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RedemptionRequest } from '@/lib/types';

export const useRequestsAdmin = () => {
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoadingRequests(true);
      const { data, error } = await supabase
        .from('redemption_requests')
        .select(`
          *,
          profiles(username, avatar)
        `)
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      const formattedRequests: RedemptionRequest[] = (data || []).map(item => ({
        id: item.id,
        userId: item.user_id,
        pointsAmount: item.points_amount,
        redemptionType: item.redemption_type as "CASH" | "GIFT_VOUCHER",
        status: item.status as "PENDING" | "APPROVED" | "REJECTED",
        paymentDetails: item.payment_details,
        adminNotes: item.admin_notes,
        createdAt: new Date(item.created_at),
        updatedAt: new Date(item.updated_at),
        user: item.profiles ? {
          username: item.profiles.username,
          avatar: item.profiles.avatar
        } : undefined
      }));
      
      setRequests(formattedRequests);
    } catch (error) {
      console.error('Error fetching redemption requests:', error);
      toast.error('Failed to load redemption requests');
    } finally {
      setIsLoadingRequests(false);
    }
  }, []);

  useEffect(() => {
    fetchRequests();
  }, [fetchRequests]);

  const approveRequest = async (id: string, adminNotes?: string) => {
    try {
      const { error } = await supabase
        .from('redemption_requests')
        .update({ 
          status: 'APPROVED',
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setRequests(prev => prev.map(req => 
        req.id === id 
          ? { ...req, status: 'APPROVED', adminNotes, updatedAt: new Date() } 
          : req
      ));
      toast.success('Request approved successfully');
      return true;
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('Failed to approve request');
      return false;
    }
  };

  const rejectRequest = async (id: string, adminNotes?: string) => {
    try {
      const { data: requestData, error: requestError } = await supabase
        .from('redemption_requests')
        .select('user_id, points_amount')
        .eq('id', id)
        .single();
      
      if (requestError) {
        throw requestError;
      }
      
      const { error: updateError } = await supabase
        .from('redemption_requests')
        .update({ 
          status: 'REJECTED',
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) {
        throw updateError;
      }
      
      const { data: pointsData, error: pointsError } = await supabase
        .rpc('increment_points', { 
          user_id_param: requestData.user_id, 
          points_amount_param: requestData.points_amount 
        });
      
      if (pointsError) {
        console.error('Error returning points to user:', pointsError);
        toast.error('Request rejected but points may not have been returned');
      }
      
      setRequests(prev => prev.map(req => 
        req.id === id 
          ? { ...req, status: 'REJECTED', adminNotes, updatedAt: new Date() } 
          : req
      ));
      toast.success('Request rejected and points returned to user');
      return true;
    } catch (error) {
      console.error('Error rejecting request:', error);
      toast.error('Failed to reject request');
      return false;
    }
  };

  return {
    requests,
    isLoadingRequests,
    approveRequest,
    rejectRequest,
    refreshRequests: fetchRequests
  };
};
