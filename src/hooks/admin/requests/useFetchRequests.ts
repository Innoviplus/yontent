
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RedemptionRequest } from '@/lib/types';

export const useFetchRequests = () => {
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [isLoadingRequests, setIsLoadingRequests] = useState(true);

  const fetchRequests = useCallback(async () => {
    try {
      setIsLoadingRequests(true);
      
      // Log when we're starting to fetch
      console.log('Fetching redemption requests from Supabase...');
      
      const { data, error } = await supabase
        .from('redemption_requests')
        .select('*')
        .order('created_at', { ascending: false });
      
      if (error) {
        throw error;
      }
      
      // Log the raw data we received
      console.log('Raw redemption requests data:', data);
      
      // Create an array to store formatted requests
      const formattedRequests: RedemptionRequest[] = [];
      
      // Process each request and fetch the associated user data
      for (const item of data || []) {
        // Create the base request object
        const request: RedemptionRequest = {
          id: item.id,
          userId: item.user_id,
          pointsAmount: item.points_amount,
          redemptionType: item.redemption_type as "CASH" | "GIFT_VOUCHER",
          status: item.status as "PENDING" | "APPROVED" | "REJECTED",
          paymentDetails: item.payment_details,
          adminNotes: item.admin_notes,
          createdAt: new Date(item.created_at),
          updatedAt: new Date(item.updated_at),
          user: undefined
        };
        
        // Fetch the associated user profile
        if (item.user_id) {
          const { data: userData, error: userError } = await supabase
            .from('profiles')
            .select('username, avatar')
            .eq('id', item.user_id)
            .single();
          
          if (!userError && userData) {
            request.user = {
              username: userData.username,
              avatar: userData.avatar
            };
          }
        }
        
        formattedRequests.push(request);
      }
      
      // Log the formatted requests
      console.log('Formatted redemption requests:', formattedRequests);
      
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

  return {
    requests,
    setRequests,
    isLoadingRequests,
    fetchRequests
  };
};
