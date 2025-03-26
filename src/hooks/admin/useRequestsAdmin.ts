
import { useState } from 'react';
import { toast } from 'sonner';
import { useFetchRequests } from './requests/useFetchRequests';
import { approveRedemptionRequest } from '@/services/redemption';
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
      
      // First update local state optimistically
      setRequests(prevRequests => 
        prevRequests.map(request => 
          request.id === requestId 
            ? { ...request, status: 'APPROVED' as const } 
            : request
        )
      );
      
      const success = await approveRedemptionRequest(requestId);
      
      if (success) {
        console.log('Successfully approved request:', requestId);
        toast.success('Request approved successfully');
        
        // Refresh the requests to ensure we have the latest data from the server
        await fetchRequests();
      } else {
        console.error('Failed to approve request:', requestId);
        toast.error('Failed to approve request');
        
        // Revert the optimistic update since it failed
        setRequests(prevRequests => 
          prevRequests.map(request => 
            request.id === requestId && request.status === 'APPROVED'
              ? { ...request, status: 'PENDING' as const } 
              : request
          )
        );
        
        // Try to fetch the latest data to ensure UI is in sync with server
        await fetchRequests();
      }
    } catch (error) {
      console.error('Error approving request:', error);
      toast.error('An error occurred while approving the request');
      
      // Refresh to ensure UI is in sync with server state
      await fetchRequests();
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
