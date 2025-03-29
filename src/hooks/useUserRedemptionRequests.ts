
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { RedemptionRequest } from '@/lib/types';
import { toast } from 'sonner';
import { useAuth } from '@/contexts/AuthContext';

export const useUserRedemptionRequests = () => {
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchRedemptionRequests = async () => {
      if (!user?.id) return;
      
      try {
        setIsLoading(true);
        
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
          .eq('user_id', user.id)
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
        console.error('Error fetching user redemption requests:', error);
        toast.error('Failed to load redemption history');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRedemptionRequests();
  }, [user?.id]);

  return { requests, isLoading };
};
