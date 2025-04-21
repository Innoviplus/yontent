
import RewardFormWrapper from "./RewardFormWrapper";
import { RedemptionItem } from "@/types/redemption";

type Props = {
  show: boolean;
  onSubmit: (data: Omit<RedemptionItem, 'id'>) => Promise<boolean>;
  onCancel: () => void;
};

const RewardAddModal = ({ show, onSubmit, onCancel }: Props) => {
  if (!show) return null;
  return (
    <RewardFormWrapper
      isAdding={true}
      onSubmit={onSubmit}
      onCancel={onCancel}
    />
  );
};

export default RewardAddModal;
