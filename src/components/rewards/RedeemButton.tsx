
import { Button } from "@/components/ui/button";
import { ShoppingBag } from "lucide-react";

interface RedeemButtonProps {
  canRedeem: boolean;
  isRedeeming: boolean;
  onRedeem: () => void;
  label?: string;
}

const RedeemButton = ({ 
  canRedeem, 
  isRedeeming, 
  onRedeem,
  label = "Send Redeem Request" 
}: RedeemButtonProps) => {
  return (
    <Button
      size="lg"
      className="w-full mt-6 py-6 text-base"
      onClick={onRedeem}
      disabled={!canRedeem || isRedeeming}
    >
      {isRedeeming ? (
        <div className="flex items-center gap-2">
          <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white"></div>
          <span>Processing...</span>
        </div>
      ) : (
        <div className="flex items-center gap-2">
          <ShoppingBag className="h-5 w-5" />
          <span>{label}</span>
        </div>
      )}
    </Button>
  );
};

export default RedeemButton;
