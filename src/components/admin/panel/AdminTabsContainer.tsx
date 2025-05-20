
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RewardsManagement from "@/components/admin/rewards/RewardsManagement";
import RequestsManagement from "@/components/admin/rewards/RequestsManagement";
import MissionsManagement from "@/components/admin/missions/MissionsManagement";
import AdminUsersManagement from "@/components/admin/panel/AdminUsersManagement";
import { UserDeletionRequests } from "@/components/admin/panel/users/UserDeletionRequests";

// Define proper types for component props to fix TypeScript errors
interface AdminRewardsManagementProps {
  rewards: any[];
  isLoading: boolean;
  addReward: (reward: any) => Promise<boolean>;
  updateReward: (id: string, updates: any) => Promise<boolean>;
  deleteReward: (id: string) => Promise<boolean>;
  refreshRewards: () => Promise<void>;
}

interface AdminRequestsManagementProps {
  requests: any[];
  isLoading: boolean;
  isRefreshing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  refreshRequests: () => Promise<void>;
  handleApproveRequest: (id: string) => Promise<boolean>;
  handleRejectRequest: (id: string) => Promise<boolean>;
}

interface AdminTabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  requests: any[];
  isLoadingRequests: boolean;
  isRefreshingRequests: boolean;
  requestsActiveTab: string;
  setRequestsActiveTab: (tab: string) => void;
  refreshRequests: any;
  handleApproveRequest: (id: string) => Promise<boolean>;
  handleRejectRequest: (id: string) => Promise<boolean>;
  missions: any[];
  isLoadingMissions: boolean;
  addMission: any;
  updateMission: any;
  deleteMission: any;
  refreshMissions: () => Promise<void>;
  maxLoadingTime: boolean;
  rewards: any[];
  isLoadingRewards: boolean;
  addReward: any;
  updateReward: any;
  deleteReward: any;
  refreshRewards: () => Promise<void>;
}

const AdminTabsContainer: React.FC<AdminTabsContainerProps> = ({
  activeTab,
  setActiveTab,
  rewards,
  isLoadingRewards,
  addReward,
  updateReward,
  deleteReward,
  refreshRewards,
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
  maxLoadingTime
}) => {
  return (
    <Tabs value={activeTab} onValueChange={setActiveTab} className="w-full">
      <TabsList className="mb-6 flex flex-wrap gap-2">
        <TabsTrigger value="missions">Missions</TabsTrigger>
        <TabsTrigger value="rewards">Rewards</TabsTrigger>
        <TabsTrigger value="requests">Redemption Requests</TabsTrigger>
        <TabsTrigger value="users">Users</TabsTrigger>
        <TabsTrigger value="deletionRequests">Deletion Requests</TabsTrigger>
      </TabsList>

      <TabsContent value="missions" className="pt-2">
        <MissionsManagement
          missions={missions}
          isLoading={isLoadingMissions && !maxLoadingTime}
          addMission={addMission}
          updateMission={updateMission}
          deleteMission={deleteMission}
          refreshMissions={refreshMissions}
        />
      </TabsContent>

      <TabsContent value="rewards" className="pt-2">
        <RewardsManagement
          rewards={rewards}
          isLoading={isLoadingRewards && !maxLoadingTime}
          onAdd={addReward}
          onUpdate={updateReward}
          onDelete={deleteReward}
        />
      </TabsContent>

      <TabsContent value="requests" className="pt-2">
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

      <TabsContent value="users" className="pt-2">
        <AdminUsersManagement />
      </TabsContent>

      <TabsContent value="deletionRequests" className="pt-2">
        <UserDeletionRequests />
      </TabsContent>
    </Tabs>
  );
};

export default AdminTabsContainer;
