
import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import { useRewardsAdmin } from '@/hooks/admin/useRewardsAdmin';
import { useMissionsAdmin } from '@/hooks/admin/missions';
import { useMissionParticipations } from '@/hooks/admin/useMissionParticipations';
import { useRequestsAdmin } from '@/hooks/admin/useRequestsAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { toast } from 'sonner';

export const useAdminPanelState = () => {
  const [activeTab, setActiveTab] = useState('missions'); // Default to missions tab
  const { loading: authLoading, user, session, userProfile } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [maxLoadingTime, setMaxLoadingTime] = useState(false);

  // Very short timeout of 1.5 seconds to force display content
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMaxLoadingTime(true);
      console.log("Max loading time reached, forcing display of admin panel");
    }, 1500);
    return () => clearTimeout(timeoutId);
  }, []);

  // Rewards state/actions
  const {
    rewards,
    isLoadingRewards,
    addReward,
    updateReward,
    deleteReward
  } = useRewardsAdmin();

  // Missions state/actions
  const {
    missions,
    isLoading: isLoadingMissions,
    addMission,
    updateMission,
    deleteMission,
    error: missionsError,
    refreshMissions
  } = useMissionsAdmin();

  // Participations state/actions
  const {
    participations,
    isLoading: isLoadingParticipations,
    isRefreshing: isRefreshingParticipations,
    refreshParticipations: originalRefreshParticipations,
    approveParticipation,
    rejectParticipation
  } = useMissionParticipations();

  const refreshParticipations = async () => {
    try {
      return await originalRefreshParticipations();
    } catch (error) {
      console.error("Error refreshing participations:", error);
      return Promise.resolve();
    }
  };

  // Requests state/actions
  const {
    requests,
    isLoading: isLoadingRequests,
    activeTab: requestsActiveTab,
    setActiveTab: setRequestsActiveTab,
    isRefreshing: isRefreshingRequests,
    refreshRequests: originalRefreshRequests,
    handleApproveRequest,
    handleRejectRequest
  } = useRequestsAdmin();

  const refreshRequests = async () => {
    try {
      return await originalRefreshRequests();
    } catch (error) {
      console.error("Error refreshing requests:", error);
      return Promise.resolve();
    }
  };

  // For debugging auth on mount
  useEffect(() => {
    console.log("Admin panel auth status:", {
      isLoading: authLoading,
      hasUser: !!user,
      hasSession: !!session,
      userEmail: user?.email,
      retryCount,
      userProfile,
      missionsCount: missions?.length
    });
    
    if (missions && missions.length > 0) {
      console.log("Missions loaded successfully in admin panel:", missions.length);
    }
  }, [authLoading, user, session, retryCount, userProfile, missions]);

  const handleRetry = () => {
    setRetryCount(count => count + 1);
    setMaxLoadingTime(false);
    refreshMissions();
    toast.info("Retrying admin panel load...");
  };

  // Always show content after a very short loading time
  const isLoading =
    authLoading && 
    isLoadingRewards &&
    isLoadingMissions &&
    isLoadingParticipations &&
    isLoadingRequests &&
    !maxLoadingTime;

  // Always show content if max loading time is reached
  const shouldShowContent = !isLoading || maxLoadingTime || retryCount > 0;
  
  // Flag for displaying error state but still allow content to show
  const isLoadingTooLong =
    !authLoading && ((isLoadingMissions || isLoadingRewards) && maxLoadingTime);

  return {
    activeTab,
    setActiveTab,
    rewards,
    isLoadingRewards,
    addReward,
    updateReward,
    deleteReward,
    requests,
    isLoadingRequests,
    isRefreshingRequests,
    requestsActiveTab,
    setRequestsActiveTab,
    refreshRequests,
    handleApproveRequest,
    handleRejectRequest,
    missions,
    isLoadingMissions,
    addMission,
    updateMission,
    deleteMission,
    participations,
    isLoadingParticipations,
    isRefreshingParticipations,
    refreshParticipations,
    approveParticipation,
    rejectParticipation,
    refreshMissions,
    maxLoadingTime,
    handleRetry,
    isLoading,
    shouldShowContent,
    isLoadingTooLong,
    retryCount,
    setRetryCount,
    missionsError,
    authLoading
  };
};
