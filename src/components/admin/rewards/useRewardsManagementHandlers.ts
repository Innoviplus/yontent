
import { useState } from 'react';
import { toast } from 'sonner';
import { RedemptionItem } from '@/types/redemption';

export const useRewardsManagementHandlers = ({
  rewards,
  onAdd,
  onUpdate,
  onDelete,
}: {
  rewards: RedemptionItem[];
  onAdd: (reward: Omit<RedemptionItem, 'id'>) => Promise<boolean>;
  onUpdate: (id: string, updates: Partial<RedemptionItem>) => Promise<boolean>;
  onDelete: (id: string) => Promise<boolean>;
}) => {
  const [showAddForm, setShowAddForm] = useState(false);
  const [editingReward, setEditingReward] = useState<RedemptionItem | null>(null);
  const [deletingRewardId, setDeletingRewardId] = useState<string | null>(null);

  const handleAddSubmit = async (reward: Omit<RedemptionItem, 'id'>) => {
    if (!reward.name || !reward.description || !reward.points_required) return false;
    const success = await onAdd(reward);
    if (success) setShowAddForm(false);
    return success;
  };

  const handleEditSubmit = async (updates: Partial<RedemptionItem>) => {
    if (!editingReward?.id) return false;
    const success = await onUpdate(editingReward.id, updates);
    if (success) setEditingReward(null);
    return success;
  };

  const handleDeleteConfirm = async () => {
    if (!deletingRewardId) return false;
    const success = await onDelete(deletingRewardId);
    if (success) setDeletingRewardId(null);
    return success;
  };

  const handleToggleActive = async (reward: RedemptionItem) => {
    const newStatus = !reward.is_active;
    const success = await onUpdate(reward.id, { is_active: newStatus });
    if (success) toast.success(`Reward ${newStatus ? 'activated' : 'deactivated'} successfully`);
    return success;
  };

  const handleDuplicateReward = (reward: RedemptionItem) => {
    const { id, ...rewardWithoutId } = reward;
    const duplicatedReward = { ...rewardWithoutId, name: `${rewardWithoutId.name} (Copy)` };
    setEditingReward({ id: 'new', ...duplicatedReward } as RedemptionItem);
    toast.info('Duplicated reward. Make your changes and save.');
  };

  const handleUpdateOrder = async (id: string, direction: 'up' | 'down') => {
    const rewardIndex = rewards.findIndex(r => r.id === id);
    if (rewardIndex === -1) return false;
    if (direction === 'up' && rewardIndex > 0) {
      const currentDisplayOrder = rewards[rewardIndex].display_order || 0;
      const prevDisplayOrder = rewards[rewardIndex - 1].display_order || 0;
      const success = await onUpdate(id, { display_order: prevDisplayOrder });
      if (success) {
        await onUpdate(rewards[rewardIndex - 1].id, { display_order: currentDisplayOrder });
        toast.success('Reward order updated');
      }
      return success;
    }
    if (direction === 'down' && rewardIndex < rewards.length - 1) {
      const currentDisplayOrder = rewards[rewardIndex].display_order || 0;
      const nextDisplayOrder = rewards[rewardIndex + 1].display_order || 0;
      const success = await onUpdate(id, { display_order: nextDisplayOrder });
      if (success) {
        await onUpdate(rewards[rewardIndex + 1].id, { display_order: currentDisplayOrder });
        toast.success('Reward order updated');
      }
      return success;
    }
    return false;
  };

  return {
    showAddForm, setShowAddForm,
    editingReward, setEditingReward,
    deletingRewardId, setDeletingRewardId,
    handleAddSubmit,
    handleEditSubmit,
    handleDeleteConfirm,
    handleToggleActive,
    handleDuplicateReward,
    handleUpdateOrder,
  };
};

