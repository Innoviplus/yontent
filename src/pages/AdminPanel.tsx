
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { useRewardsAdmin } from '@/hooks/admin/useRewardsAdmin';
import { useMissionsAdmin } from '@/hooks/admin/missions';
import { useMissionParticipations } from '@/hooks/admin/useMissionParticipations';
import { useRequestsAdmin } from '@/hooks/admin/useRequestsAdmin';
import { useAuth } from '@/contexts/AuthContext';
import { AlertCircle, RefreshCw } from 'lucide-react';
import AdminHeader from '@/components/admin/panel/AdminHeader';
import AdminTabsContainer from '@/components/admin/panel/AdminTabsContainer';
import AdminPanelLoadingState from '@/components/admin/panel/AdminPanelLoadingState';
import { Button } from '@/components/ui/button';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('rewards');
  const { loading: authLoading, user, session, userProfile } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  const [maxLoadingTime, setMaxLoadingTime] = useState(false);

  useEffect(() => {
    const timeoutId = setTimeout(() => {
      setMaxLoadingTime(true);
    }, 8000);
    return () => clearTimeout(timeoutId);
  }, []);

  const handleRetry = () => {
    setRetryCount(count => count + 1);
    setMaxLoadingTime(false);
    refreshMissions();
  };

  const {
    rewards,
    isLoadingRewards,
    addReward,
    updateReward,
    deleteReward
  } = useRewardsAdmin();

  const {
    missions,
    isLoading: isLoadingMissions,
    addMission,
    updateMission,
    deleteMission,
    error: missionsError,
    refreshMissions
  } = useMissionsAdmin();

  const {
    participations,
    isLoading: isLoadingParticipations,
    isRefreshing: isRefreshingParticipations,
    refreshParticipations: originalRefreshParticipations,
    approveParticipation,
    rejectParticipation
  } = useMissionParticipations();

  // Wrap the refreshParticipations function to ensure it returns a Promise
  const refreshParticipations = async () => {
    return originalRefreshParticipations();
  };

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

  // Wrap the refreshRequests function to ensure it returns a Promise
  const refreshRequests = async () => {
    return originalRefreshRequests();
  };

  useEffect(() => {
    console.log("Admin panel auth status:", {
      isLoading: authLoading,
      hasUser: !!user,
      hasSession: !!session,
      userEmail: user?.email,
      retryCount,
      userProfile
    });
  }, [authLoading, user, session, retryCount, userProfile]);

  const isLoading =
    authLoading ||
    isLoadingRewards ||
    isLoadingMissions ||
    isLoadingParticipations ||
    isLoadingRequests;

  const shouldShowContent = !isLoading || maxLoadingTime;
  const isLoadingTooLong =
    !authLoading && (isLoadingMissions || isLoadingRewards) && (retryCount > 0 || maxLoadingTime);

  if (isLoading && !maxLoadingTime) {
    return (
      <AdminPanelLoadingState retryCount={retryCount} handleRetry={handleRetry} />
    );
  }

  if (missionsError && !maxLoadingTime) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className="bg-red-50 border border-red-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start">
              <AlertCircle className="text-red-500 h-6 w-6 mt-0.5 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-red-700 mb-2">Error Loading Admin Panel</h2>
                <p className="text-red-600 mb-4">{missionsError}</p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button
                    onClick={() => refreshMissions()}
                    variant="destructive"
                    className="flex items-center"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Loading
                  </Button>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl">
        <div className="flex flex-col gap-8">
          <AdminHeader isLoadingTooLong={isLoadingTooLong} handleRetry={handleRetry} />
          <AdminTabsContainer
            activeTab={activeTab}
            setActiveTab={setActiveTab}
            rewards={rewards}
            isLoadingRewards={isLoadingRewards}
            addReward={addReward}
            updateReward={updateReward}
            deleteReward={deleteReward}
            requests={requests}
            isLoadingRequests={isLoadingRequests}
            isRefreshingRequests={isRefreshingRequests}
            requestsActiveTab={requestsActiveTab}
            setRequestsActiveTab={setRequestsActiveTab}
            refreshRequests={refreshRequests}
            handleApproveRequest={handleApproveRequest}
            handleRejectRequest={handleRejectRequest}
            missions={missions}
            isLoadingMissions={isLoadingMissions}
            addMission={addMission}
            updateMission={updateMission}
            deleteMission={deleteMission}
            participations={participations}
            isLoadingParticipations={isLoadingParticipations}
            isRefreshingParticipations={isRefreshingParticipations}
            refreshParticipations={refreshParticipations}
            approveParticipation={approveParticipation}
            rejectParticipation={rejectParticipation}
            refreshMissions={refreshMissions}
            maxLoadingTime={maxLoadingTime}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
