
import Navbar from '@/components/Navbar';
import AdminHeader from '@/components/admin/panel/AdminHeader';
import AdminTabsContainer from '@/components/admin/panel/AdminTabsContainer';
import AdminPanelLoadingState from '@/components/admin/panel/AdminPanelLoadingState';
import { Button } from '@/components/ui/button';
import { AlertCircle, RefreshCw } from 'lucide-react';

interface AdminPanelContentProps {
  state: ReturnType<typeof import('./useAdminPanelState').useAdminPanelState>;
}

const AdminPanelContent = ({ state }: AdminPanelContentProps) => {
  const {
    maxLoadingTime,
    handleRetry,
    isLoading,
    retryCount,
    missionsError,
    refreshMissions,
    shouldShowContent,
    isLoadingTooLong,
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
    refreshMissions: tabsRefreshMissions,
    participationsError,
  } = state;

  if (isLoading && !maxLoadingTime && retryCount <= 1) {
    return (
      <AdminPanelLoadingState retryCount={retryCount} handleRetry={handleRetry} />
    );
  }

  if (missionsError && !maxLoadingTime && retryCount <= 1) {
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
                    onClick={() => {
                      refreshMissions();
                      state.setRetryCount && state.setRetryCount((prev: number) => prev + 1);
                    }}
                    variant="destructive"
                    className="flex items-center"
                  >
                    <RefreshCw className="mr-2 h-4 w-4" />
                    Retry Loading
                  </Button>
                  <Button
                    onClick={() => state.maxLoadingTime = true}
                    variant="outline"
                    className="flex items-center"
                  >
                    Force Load Panel
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
          <AdminHeader 
            isLoadingTooLong={state.isLoadingTooLong} 
            handleRetry={state.handleRetry} 
          />
          <AdminTabsContainer
            activeTab={state.activeTab}
            setActiveTab={state.setActiveTab}
            rewards={state.rewards || []}
            isLoadingRewards={state.isLoadingRewards && !state.maxLoadingTime}
            addReward={state.addReward}
            updateReward={state.updateReward}
            deleteReward={state.deleteReward}
            requests={state.requests || []}
            isLoadingRequests={state.isLoadingRequests && !state.maxLoadingTime}
            isRefreshingRequests={state.isRefreshingRequests}
            requestsActiveTab={state.requestsActiveTab}
            setRequestsActiveTab={state.setRequestsActiveTab}
            refreshRequests={state.refreshRequests}
            handleApproveRequest={state.handleApproveRequest}
            handleRejectRequest={state.handleRejectRequest}
            missions={state.missions || []}
            isLoadingMissions={state.isLoadingMissions && !state.maxLoadingTime}
            addMission={state.addMission}
            updateMission={state.updateMission}
            deleteMission={state.deleteMission}
            participations={state.participations || []}
            isLoadingParticipations={state.isLoadingParticipations && !state.maxLoadingTime}
            isRefreshingParticipations={state.isRefreshingParticipations}
            refreshParticipations={state.refreshParticipations}
            approveParticipation={state.approveParticipation}
            rejectParticipation={state.rejectParticipation}
            refreshMissions={state.refreshMissions}
            maxLoadingTime={state.maxLoadingTime}
            participationsError={state.error || state.participationsError}
          />
        </div>
      </div>
    </div>
  );
};

export default AdminPanelContent;
