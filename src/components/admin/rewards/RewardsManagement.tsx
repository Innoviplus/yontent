
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { RedemptionItem } from '@/types/redemption';
import RewardList from './RewardList';
import RewardsLoadingState from './RewardsLoadingState';

import { useRewardsManagementHandlers } from './useRewardsManagementHandlers';
import RewardAddModal from './RewardAddModal';
import RewardEditModal from './RewardEditModal';
import RewardDeleteDialog from './RewardDeleteDialog';

interface RewardsManagementProps {
  rewards: RedemptionItem[];
  isLoading: boolean;
  onAdd: (reward: Omit<RedemptionItem, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<RedemptionItem>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
  onRefresh?: () => Promise<void>;
}

const RewardsManagement = ({
  rewards,
  isLoading,
  onAdd,
  onUpdate,
  onDelete,
  onRefresh
}: RewardsManagementProps) => {
  const {
    showAddForm, setShowAddForm,
    editingReward, setEditingReward,
    deletingRewardId, setDeletingRewardId,
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    handleToggleActive,
    handleDuplicateReward,
    handleUpdateOrder,
  } = useRewardsManagementHandlers({ rewards, onAdd, onUpdate, onDelete });

  if (isLoading) {
    return <RewardsLoadingState />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Rewards Management</CardTitle>
            <CardDescription>Add, edit or remove rewards available for redemption</CardDescription>
          </div>
          <Button onClick={() => setShowAddForm(true)}>
            <Plus className="mr-2 h-4 w-4" />
            Add Reward
          </Button>
        </CardHeader>
        <CardContent>
          <RewardList
            rewards={rewards}
            onEdit={setEditingReward}
            onDelete={setDeletingRewardId}
            onToggleStatus={handleToggleActive}
            onDuplicate={handleDuplicateReward}
            onUpdateOrder={handleUpdateOrder}
          />
        </CardContent>
      </Card>

      {/* Form modals */}
      <RewardAddModal
        show={showAddForm}
        onSubmit={handleAddSubmit}
        onCancel={() => setShowAddForm(false)}
      />

      <RewardEditModal
        reward={editingReward}
        onSubmit={editingReward?.id === "new" ? handleAddSubmit : handleEditSubmit}
        onCancel={() => setEditingReward(null)}
      />

      {/* Confirmation dialog */}
      <RewardDeleteDialog
        rewardId={deletingRewardId}
        onConfirm={handleDeleteConfirm}
        onCancel={() => setDeletingRewardId(null)}
      />
    </>
  );
};

export default RewardsManagement;
