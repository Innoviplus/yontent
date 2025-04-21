
import DeleteConfirmationDialog from "./DeleteConfirmationDialog";

type Props = {
  rewardId: string | null;
  onConfirm: () => Promise<boolean>;
  onCancel: () => void;
};

const RewardDeleteDialog = ({ rewardId, onConfirm, onCancel }: Props) => {
  if (!rewardId) return null;
  // The DeleteConfirmationDialog does not care about rewardId, only the handlers
  return (
    <DeleteConfirmationDialog
      title="Delete Reward"
      description="Are you sure you want to delete this reward? This action cannot be undone."
      onConfirm={onConfirm}
      onCancel={onCancel}
    />
  );
};

export default RewardDeleteDialog;
