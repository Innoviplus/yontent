
import { useState } from 'react';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import { useRewardsAdmin } from '@/hooks/admin/useRewardsAdmin';
import { useRequestsAdmin } from '@/hooks/admin/useRequestsAdmin';
import RewardsManagement from '@/components/admin/rewards/RewardsManagement';
import RequestsManagement from '@/components/admin/rewards/RequestsManagement';

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
    requests, 
    isLoadingRequests, 
    approveRequest, 
    rejectRequest
  } = useRequestsAdmin();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-7xl">
        <div className="flex flex-col gap-8">
          <div>
            <h1 className="text-3xl font-bold mb-2">Admin Panel</h1>
            <p className="text-gray-600">Manage rewards and redemption requests</p>
          </div>
          
          <Tabs defaultValue="rewards" value={activeTab} onValueChange={setActiveTab} className="w-full">
            <TabsList className="mb-6">
              <TabsTrigger value="rewards">Rewards Management</TabsTrigger>
              <TabsTrigger value="requests">Redemption Requests</TabsTrigger>
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
                onApprove={approveRequest}
                onReject={rejectRequest}
              />
            </TabsContent>
          </Tabs>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default AdminPanel;
