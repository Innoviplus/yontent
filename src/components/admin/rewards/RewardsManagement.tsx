
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

  const handleDuplicateReward = (reward: RedemptionItem) => {
    // Create a new reward based on the selected one, but remove id to create a new one
    const { id, ...rewardWithoutId } = reward;
    
    // Set a new name to indicate it's a duplicate
    const duplicatedReward = {
      ...rewardWithoutId,
      name: `${rewardWithoutId.name} (Copy)`,
    };
    
    // Open the form with the duplicated reward data
    setEditingReward({ id: 'new', ...duplicatedReward } as RedemptionItem);
    
    toast.info('Duplicated reward. Make your changes and save.');
  };

  const handleUpdateOrder = async (id: string, direction: 'up' | 'down') => {
    // Find the reward and get its current display_order
    const rewardIndex = rewards.findIndex(r => r.id === id);
    if (rewardIndex === -1) return false;
    
    let newOrder;
    
    if (direction === 'up' && rewardIndex > 0) {
      // Swap with the previous item
      const currentDisplayOrder = rewards[rewardIndex].display_order || 0;
      const prevDisplayOrder = rewards[rewardIndex - 1].display_order || 0;
      
      // Update the current reward
      const success = await onUpdate(id, { 
        display_order: prevDisplayOrder 
      });
      
      if (success) {
        // Update the previous reward
        await onUpdate(rewards[rewardIndex - 1].id, { 
          display_order: currentDisplayOrder 
        });
        toast.success('Reward order updated');
      }
      
      return success;
    } 
    else if (direction === 'down' && rewardIndex < rewards.length - 1) {
      // Swap with the next item
      const currentDisplayOrder = rewards[rewardIndex].display_order || 0;
      const nextDisplayOrder = rewards[rewardIndex + 1].display_order || 0;
      
      // Update the current reward
      const success = await onUpdate(id, { 
        display_order: nextDisplayOrder 
      });
      
      if (success) {
        // Update the next reward
        await onUpdate(rewards[rewardIndex + 1].id, { 
          display_order: currentDisplayOrder 
        });
        toast.success('Reward order updated');
      }
      
      return success;
    }
    
    return false;
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
            onDuplicate={handleDuplicateReward}
            onUpdateOrder={handleUpdateOrder}
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
          isAdding={editingReward.id === 'new'}
          onSubmit={editingReward.id === 'new' ? handleAddSubmit : handleEditSubmit}
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
