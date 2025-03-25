
import { RedemptionItem } from '@/types/redemption';
import RewardForm from './RewardForm';

interface RewardFormWrapperProps {
  reward?: RedemptionItem;
  isAdding: boolean;
  onSubmit: (data: Partial<RedemptionItem>) => Promise<boolean>;
  onCancel: () => void;
}

const RewardFormWrapper = ({ 
  reward, 
  isAdding, 
  onSubmit, 
  onCancel 
}: RewardFormWrapperProps) => {
  if (!isAdding && !reward) return null;
  
  const title = isAdding ? "Add New Reward" : "Edit Reward";
  
  return (
    <RewardForm 
      reward={reward}
      onSubmit={onSubmit}
      onCancel={onCancel}
      title={title}
    />
  );
};

export default RewardFormWrapper;
