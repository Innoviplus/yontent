
import { useState } from 'react';
import { useFetchRequests } from './requests/useFetchRequests';
import { useApproveRequest } from './requests/useApproveRequest';
import { useRejectRequest } from './requests/useRejectRequest';
import { RedemptionRequest } from '@/lib/types';

export const useRequestsAdmin = () => {
  const { 
    requests, 
    setRequests, 
    isLoadingRequests, 
    fetchRequests 
  } = useFetchRequests();
  
  const { approveRequest } = useApproveRequest({ setRequests });
  const { rejectRequest } = useRejectRequest({ setRequests });

  return {
    requests,
    isLoadingRequests,
    approveRequest,
    rejectRequest,
    refreshRequests: fetchRequests
  };
};
