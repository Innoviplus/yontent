import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RedemptionRequest } from '@/lib/types';

interface UseApproveRequestProps {
  setRequests: React.Dispatch<React.SetStateAction<RedemptionRequest[]>>;
}

export const useApproveRequest = ({ setRequests }: UseApproveRequestProps) => {
  const approveRequest = async (id: string, adminNotes?: string) => {
    try {
      console.log(`Approving request ${id} with notes: ${adminNotes}`);
      
      // First check if it's just a note update for an existing approved/rejected request
      const { data: requestData, error: requestError } = await supabase
        .from('redemption_requests')
        .select('status')
        .eq('id', id)
        .single();
      
      if (requestError) {
        console.error('Error fetching request status:', requestError);
        throw requestError;
      }
      
      if (requestData && requestData.status !== 'PENDING') {
        // Just update notes, don't change status
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
      
      // Otherwise, perform full approval
      const { error } = await supabase
        .from('redemption_requests')
        .update({ 
          status: 'APPROVED',
          admin_notes: adminNotes,
          updated_at: new Date().toISOString()
        })
        .eq('id', id);
      
      if (error) {
        console.error('Database error during approval:', error);
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

  return { approveRequest };
};
