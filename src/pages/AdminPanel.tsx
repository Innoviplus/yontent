
import { useState } from 'react';
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

const AdminPanel = () => {
  const [activeTab, setActiveTab] = useState('rewards');
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
    deleteMission
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
