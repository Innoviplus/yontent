import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RewardsManagement from "@/components/admin/rewards/RewardsManagement";
import RequestsManagement from "@/components/admin/rewards/RequestsManagement";
import MissionsManagement from "@/components/admin/missions/MissionsManagement";
import ParticipationsManagement from "@/components/admin/participations/ParticipationsManagement";
import AdminUsersManagement from "@/components/admin/panel/AdminUsersManagement";
import { UserDeletionRequests } from "@/components/admin/panel/users/UserDeletionRequests";
import PointsManagement from "@/components/admin/points/PointsManagement";

// Define proper types for component props to fix TypeScript errors
interface AdminRewardsManagementProps {
  rewards: any[];
  isLoading: boolean;
  onAdd: (reward: any) => Promise<boolean>;
  onUpdate: (id: string, updates: any) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onRefresh: () => Promise<void>;
}

interface AdminRequestsManagementProps {
  requests: any[];
  isLoading: boolean;
  isRefreshing: boolean;
  activeTab: string;
  setActiveTab: (tab: string) => void;
  onRefresh: () => Promise<void>;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
}

interface AdminTabsContainerProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  requests: any[];
  isLoadingRequests: boolean;
  isRefreshingRequests: boolean;
  requestsActiveTab: string;
  setRequestsActiveTab: (tab: string) => void;
  refreshRequests: () => Promise<void>;
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
        <TabsTrigger value="participations">Mission Submissions</TabsTrigger>
        <TabsTrigger value="rewards">Rewards</TabsTrigger>
        <TabsTrigger value="requests">Redemption Requests</TabsTrigger>
        <TabsTrigger value="points">Points Management</TabsTrigger>
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

      <TabsContent value="participations" className="pt-2">
        <ParticipationsManagement />
      </TabsContent>

      <TabsContent value="rewards" className="pt-2">
        <RewardsManagement
          rewards={rewards}
          isLoading={isLoadingRewards && !maxLoadingTime}
          onAdd={addReward}
          onUpdate={updateReward}
          onDelete={deleteReward}
          onRefresh={refreshRewards}
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

      <TabsContent value="points" className="pt-2">
        <PointsManagement />
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
