
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import RewardsManagement from "@/components/admin/rewards/RewardsManagement";
import RequestsManagement from "@/components/admin/rewards/RequestsManagement";
import MissionsManagement from "@/components/admin/missions/MissionsManagement";
import AdminUsersManagement from "@/components/admin/panel/AdminUsersManagement";
import { UserDeletionRequests } from "@/components/admin/panel/users/UserDeletionRequests";

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
}

const AdminTabsContainer: React.FC<AdminTabsContainerProps> = ({
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
          addReward={addReward}
          updateReward={updateReward}
          deleteReward={deleteReward}
        />
      </TabsContent>

      <TabsContent value="requests" className="pt-2">
        <RequestsManagement
          requests={requests}
          isLoading={isLoadingRequests && !maxLoadingTime}
          isRefreshing={isRefreshingRequests}
          activeTab={requestsActiveTab}
          setActiveTab={setRequestsActiveTab}
          refreshRequests={refreshRequests}
          handleApproveRequest={handleApproveRequest}
          handleRejectRequest={handleRejectRequest}
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
