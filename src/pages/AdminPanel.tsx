
import { useState, useEffect } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import Navbar from '@/components/Navbar';
import { useRewardsAdmin } from '@/hooks/admin/useRewardsAdmin';
import { useMissionsAdmin } from '@/hooks/admin/missions';
import { useMissionParticipations } from '@/hooks/admin/useMissionParticipations';
import { useRequestsAdmin } from '@/hooks/admin/useRequestsAdmin';
import RewardsManagement from '@/components/admin/rewards/RewardsManagement';
import MissionsManagement from '@/components/admin/missions/MissionsManagement';
import MissionsParticipation from '@/components/admin/missions/MissionsParticipation';
import RequestsManagement from '@/components/admin/rewards/RequestsManagement';
import SiteContentTab from '@/components/admin/siteContent/SiteContentTab';
import { useAuth } from '@/contexts/AuthContext';
import { Loader2, AlertCircle, RefreshCw } from 'lucide-react';
import { Button } from '@/components/ui/button';

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('rewards');
  const { loading: authLoading, user, session } = useAuth();
  const [retryCount, setRetryCount] = useState(0);
  
  // Force page to retry loading data if needed
  const handleRetry = () => {
    setRetryCount(count => count + 1);
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
    refreshParticipations,
    approveParticipation,
    rejectParticipation
  } = useMissionParticipations();

  const {
    requests,
    isLoading: isLoadingRequests,
    activeTab: requestsActiveTab,
    setActiveTab: setRequestsActiveTab,
    isRefreshing: isRefreshingRequests,
    refreshRequests,
    handleApproveRequest,
    handleRejectRequest
  } = useRequestsAdmin();

  // Check for authentication status
  useEffect(() => {
    console.log("Admin panel auth status:", {
      isLoading: authLoading,
      hasUser: !!user,
      hasSession: !!session,
      userEmail: user?.email,
      retryCount
    });
  }, [authLoading, user, session, retryCount]);

  // Main loading state for the entire admin panel
  const isLoading = authLoading || isLoadingRewards || isLoadingMissions || isLoadingParticipations || isLoadingRequests;
  
  // Check if we're stuck in a loading state
  const isLoadingTooLong = !authLoading && (isLoadingMissions || isLoadingRewards) && retryCount > 0;

  // Check if we're still loading or if there was an error
  if (isLoading && !isLoadingTooLong) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16 flex justify-center items-center">
          <div className="flex flex-col items-center gap-4">
            <Loader2 className="h-12 w-12 text-brand-teal animate-spin" />
            <p className="text-gray-600">Loading admin panel...</p>
            {(retryCount > 0) && (
              <div className="text-sm text-gray-500 max-w-xs text-center mt-2">
                Attempt {retryCount + 1}...
              </div>
            )}
          </div>
        </div>
      </div>
    );
  }
  
  // Check if loading is taking too long
  if (isLoadingTooLong) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16">
          <div className="bg-yellow-50 border border-yellow-200 rounded-lg p-6 max-w-2xl mx-auto">
            <div className="flex items-start">
              <AlertCircle className="text-yellow-500 h-6 w-6 mt-0.5 mr-3" />
              <div>
                <h2 className="text-xl font-semibold text-yellow-700 mb-2">Loading Is Taking Too Long</h2>
                <p className="text-yellow-600 mb-4">
                  We're having trouble loading the data for the admin panel. This could be due to connection issues or authentication problems.
                </p>
                <div className="flex flex-col sm:flex-row gap-3">
                  <Button 
                    onClick={handleRetry}
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
  
  // Check if there's an error with missions
  if (missionsError) {
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
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage your application</p>
          </div>
          
          <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="rewards">Rewards</TabsTrigger>
              <TabsTrigger value="requests">Redemption Requests</TabsTrigger>
              <TabsTrigger value="missions">Missions</TabsTrigger>
              <TabsTrigger value="participations">Participations</TabsTrigger>
              <TabsTrigger value="site-content">Site Content</TabsTrigger>
            </TabsList>
            
            <TabsContent value="rewards" className="space-y-4">
              <RewardsManagement 
                rewards={rewards} 
                isLoading={isLoadingRewards}
                onAdd={addReward}
                onUpdate={updateReward}
                onDelete={deleteReward}
              />
            </TabsContent>

            <TabsContent value="requests" className="space-y-4">
              <RequestsManagement 
                requests={requests}
                isLoading={isLoadingRequests}
                isRefreshing={isRefreshingRequests}
                activeTab={requestsActiveTab}
                setActiveTab={setRequestsActiveTab}
                onRefresh={refreshRequests}
                onApprove={handleApproveRequest}
                onReject={handleRejectRequest}
              />
            </TabsContent>

            <TabsContent value="missions" className="space-y-4">
              <MissionsManagement 
                missions={missions}
                isLoading={isLoadingMissions}
                onAdd={addMission}
                onUpdate={updateMission}
                onDelete={deleteMission}
              />
            </TabsContent>

            <TabsContent value="participations" className="space-y-4">
              <MissionsParticipation 
                participations={participations}
                isLoading={isLoadingParticipations}
                isRefreshing={isRefreshingParticipations}
                onRefresh={refreshParticipations}
                onApprove={approveParticipation}
                onReject={rejectParticipation}
              />
            </TabsContent>
            
            <TabsContent value="site-content" className="space-y-4">
              <SiteContentTab />
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
};

export default AdminPanel;
