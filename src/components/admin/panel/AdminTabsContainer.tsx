
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs';
import RewardsManagement from '@/components/admin/rewards/RewardsManagement';
import RequestsManagement from '@/components/admin/rewards/RequestsManagement';
import MissionsManagement from '@/components/admin/missions/MissionsManagement';
import SiteContentTab from '@/components/admin/siteContent/SiteContentTab';
import AdminUsersManagement from "@/components/admin/panel/AdminUsersManagement";
import PointsManagement from '@/components/admin/points/PointsManagement';

interface AdminTabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  rewards: any[];
  isLoadingRewards: boolean;
  addReward: any;
  updateReward: any;
  deleteReward: any;
  requests: any[];
  isLoadingRequests: boolean;
  isRefreshingRequests: boolean;
  requestsActiveTab: string;
  setRequestsActiveTab: (tab: string) => void;
  refreshRequests: () => Promise<void>;
  handleApproveRequest: any;
  handleRejectRequest: any;
  missions: any[];
  isLoadingMissions: boolean;
  addMission: any;
  updateMission: any;
  deleteMission: any;
  refreshMissions: () => void;
  maxLoadingTime: boolean;
}

const AdminTabsContainer = ({
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
  refreshMissions,
  maxLoadingTime,
}: AdminTabsContainerProps) => (
  <Tabs defaultValue={activeTab} value={activeTab} onValueChange={setActiveTab} className="w-full">
    <TabsList className="mb-6">
      <TabsTrigger value="rewards">Rewards</TabsTrigger>
      <TabsTrigger value="requests">Redemption Requests</TabsTrigger>
      <TabsTrigger value="missions">Missions</TabsTrigger>
      <TabsTrigger value="points">Points Management</TabsTrigger>
      <TabsTrigger value="site-content">Site Content</TabsTrigger>
      <TabsTrigger value="admin-users">Admin Users</TabsTrigger>
    </TabsList>

    <TabsContent value="rewards" className="space-y-4">
      <RewardsManagement
        rewards={rewards}
        isLoading={isLoadingRewards && !maxLoadingTime}
        onAdd={addReward}
        onUpdate={updateReward}
        onDelete={deleteReward}
      />
    </TabsContent>
    
    <TabsContent value="requests" className="space-y-4">
      <RequestsManagement
        requests={requests}
        isLoading={isLoadingRequests && !maxLoadingTime}
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
        isLoading={isLoadingMissions && !maxLoadingTime}
        onAdd={addMission}
        onUpdate={updateMission}
        onDelete={deleteMission}
      />
    </TabsContent>
    
    <TabsContent value="points" className="space-y-4">
      <PointsManagement />
    </TabsContent>
    
    <TabsContent value="site-content" className="space-y-4">
      <SiteContentTab />
    </TabsContent>
    
    <TabsContent value="admin-users" className="space-y-4">
      <AdminUsersManagement />
    </TabsContent>
  </Tabs>
);

export default AdminTabsContainer;
