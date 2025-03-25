
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Plus } from 'lucide-react';
import { toast } from 'sonner';
import { RedemptionItem } from '@/types/redemption';
import RewardList from './RewardList';
import RewardFormWrapper from './RewardFormWrapper';
import DeleteConfirmationDialog from './DeleteConfirmationDialog';
import RewardsLoadingState from './RewardsLoadingState';

interface RewardsManagementProps {
  rewards: RedemptionItem[];
  isLoading: boolean;
  onAdd: (reward: Omit<RedemptionItem, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<RedemptionItem>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}

const RewardsManagement = ({ 
  rewards, 
  isLoading, 
  onAdd, 
  onUpdate, 
  onDelete 
}: RewardsManagementProps) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReward, setEditingReward] = useState<RedemptionItem | null>(null);
  const [deletingRewardId, setDeletingRewardId] = useState<string | null>(null);

  const handleAddSubmit = async (reward: Omit<RedemptionItem, 'id'>) => {
    if (!reward.name || !reward.description || !reward.points_required) {
      return false;
    }
    const success = await onAdd(reward);
    if (success) {
      setShowAddForm(false);
    }
    return success;
  };

  const handleEditSubmit = async (updates: Partial<RedemptionItem>) => {
    if (!editingReward?.id) return false;
    
    const success = await onUpdate(editingReward.id, updates);
    if (success) {
      setEditingReward(null);
    }
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRewardId) return false;
    
    const success = await onDelete(deletingRewardId);
    if (success) {
      setDeletingRewardId(null);
    }
    return success;
  };

  const handleToggleActive = async (reward: RedemptionItem) => {
    const newStatus = !reward.is_active;
    const success = await onUpdate(reward.id, { is_active: newStatus });
    
    if (success) {
      toast.success(`Reward ${newStatus ? 'activated' : 'deactivated'} successfully`);
    }
    
    return success;
  };

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
          />
        </CardContent>
      </Card>

      {/* Form modals */}
      {showAddForm && (
        <RewardFormWrapper 
          isAdding={true}
          onSubmit={handleAddSubmit}
          onCancel={() => setShowAddForm(false)}
        />
      )}

      {editingReward && (
        <RewardFormWrapper 
          reward={editingReward}
          isAdding={false}
          onSubmit={handleEditSubmit}
          onCancel={() => setEditingReward(null)}
        />
      )}

      {/* Confirmation dialog */}
      {deletingRewardId && (
        <DeleteConfirmationDialog
          title="Delete Reward"
          description="Are you sure you want to delete this reward? This action cannot be undone."
          onConfirm={handleDeleteConfirm}
          onCancel={() => setDeletingRewardId(null)}
        />
      )}
    </>
  );
};

export default RewardsManagement;
