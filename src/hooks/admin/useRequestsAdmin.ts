
import { useState } from 'react';
import { toast } from 'sonner';
import { RedemptionRequest } from '@/lib/types';

// Mock empty implementation since we're no longer supporting redemption requests
export const useRequestsAdmin = () => {
  const [requests, setRequests] = useState<RedemptionRequest[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [activeTab, setActiveTab] = useState('pending');
  const [isRefreshing, setIsRefreshing] = useState(false);

  const refreshRequests = async () => {
    // Mock implementation
    return;
  };

  const handleApproveRequest = async () => {
    // Mock implementation
    toast.info('Redemption request approval is no longer supported');
    return false;
  };

  const handleRejectRequest = async () => {
    // Mock implementation
    toast.info('Redemption request rejection is no longer supported');
    return false;
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
