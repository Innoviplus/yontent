
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RedemptionRequest } from '@/lib/types';
import { returnPointsToUser } from '../utils/points';

interface UseRejectRequestProps {
  setRequests: React.Dispatch<React.SetStateAction<RedemptionRequest[]>>;
}

export const useRejectRequest = ({ setRequests }: UseRejectRequestProps) => {
  const rejectRequest = async (id: string, adminNotes?: string) => {
    try {
      console.log(`Rejecting request ${id} with notes: ${adminNotes}`);
      
      // First, get the request data
      const { data: requestData, error: requestError } = await supabase
        .from('redemption_requests')
        .select('user_id, points_amount, status')
        .eq('id', id)
        .single();
      
      if (requestError) {
        console.error('Error fetching request data for rejection:', requestError);
        throw requestError;
      }
      
      // If already rejected or approved, just update notes
      if (requestData && requestData.status !== 'PENDING') {
        const { error } = await supabase
          .from('redemption_requests')
          .update({ 
            admin_notes: adminNotes,
            updated_at: new Date().toISOString()
          })
          .eq('id', id);
        
        if (error) {
          throw error;
        }
        
        setRequests(prev => prev.map(req => 
          req.id === id 
            ? { ...req, adminNotes, updatedAt: new Date() } 
            : req
        ));
        toast.success('Notes updated successfully');
        return true;
      }
      
      // Update the request status to REJECTED
      const { error: updateError } = await supabase
        .from('redemption_requests')
        .update({ 
          status: 'REJECTED',
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (updateError) {
        console.error('Error updating request status for rejection:', updateError);
        throw updateError;
      }
      
      // Return points to the user after status update is successful
      if (requestData) {
        try {
          await returnPointsToUser(requestData.user_id, requestData.points_amount);
          console.log(`Successfully returned ${requestData.points_amount} points to user ${requestData.user_id}`);
        } catch (pointsError) {
          console.error('Error returning points to user:', pointsError);
          toast.error('Request rejected but points may not have been returned');
        }
      }
      
      // Update UI optimistically
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

  return { rejectRequest };
};
