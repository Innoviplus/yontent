
import RewardFormWrapper from "./RewardFormWrapper";
import { RedemptionItem } from "@/types/redemption";

type Props = {
  reward: RedemptionItem | null;
  onSubmit: (data: Partial<RedemptionItem>) => Promise<boolean>;
  onCancel: () => void;
};

const RewardEditModal = ({ reward, onSubmit, onCancel }: Props) => {
  if (!reward) return null;
  const isAdding = reward.id === "new";
  return (
    <RewardFormWrapper
      reward={reward}
      isAdding={isAdding}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default RewardEditModal;
