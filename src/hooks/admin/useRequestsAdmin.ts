
import { useState } from 'react';
import { toast } from 'sonner';
import { useFetchRequests } from './requests/useFetchRequests';
import { approveRedemptionRequest } from '@/services/redemptionService';
import { RedemptionRequest } from '@/lib/types';

export const useRequestsAdmin = () => {
  const { 
    requests, 
    isLoadingRequests, 
    fetchRequests,
    setRequests
  } = useFetchRequests();
  
  const [isApproving, setIsApproving] = useState<string | null>(null);
  
  const handleApproveRequest = async (requestId: string) => {
    try {
      setIsApproving(requestId);
      console.log('Starting approval process for request:', requestId);
      
      const success = await approveRedemptionRequest(requestId);
      
      if (success) {
        console.log('Successfully approved request:', requestId);
        toast.success('Request approved successfully');
        
        // Update the local state to reflect the change
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === requestId 
              ? { ...request, status: 'APPROVED' as const } 
              : request
          )
        );
        
        // Refresh the requests to ensure we have the latest data
        await fetchRequests();
      } else {
        console.error('Failed to approve request:', requestId);
        toast.error('Failed to approve request');
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('An error occurred while approving the request');
    } finally {
      setIsApproving(null);
    }
  };
  
  return {
    requests,
    isLoadingRequests,
    refreshRequests: fetchRequests,
    isApproving,
    approveRequest: handleApproveRequest
  };
};
