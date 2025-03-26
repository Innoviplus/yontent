
import { useFetchRequests } from './requests/useFetchRequests';

export const useRequestsAdmin = () => {
  const { 
    requests, 
    isLoadingRequests, 
    fetchRequests 
  } = useFetchRequests();
  
  return {
    requests,
    isLoadingRequests,
    refreshRequests: fetchRequests
  };
};
