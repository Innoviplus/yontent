
import React from 'react';
import { Button } from '@/components/ui/button';

interface RedeemButtonProps {
  canRedeem: boolean;
  isRedeeming: boolean;
  onRedeem: () => void;
}

const RedeemButton: React.FC<RedeemButtonProps> = ({ 
  canRedeem, 
  isRedeeming, 
  onRedeem 
}) => {
  return (
    <>
      <Button 
        onClick={onRedeem}
        disabled={!canRedeem || isRedeeming} 
        className="w-full"
      >
        {isRedeeming ? 'Processing...' : 'Send Redeem Request'}
      </Button>
      
      {!canRedeem && (
        <p className="text-center text-sm text-gray-500 mt-4">
          You don't have enough points yet. Complete more missions to earn points!
        </p>
      )}
    </>
  );
};

export default RedeemButton;
