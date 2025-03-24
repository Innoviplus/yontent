
import React from 'react';
import { RedemptionItem } from '@/types/redemption';
import { formatNumber } from '@/lib/formatUtils';

interface PointsBalanceProps {
  userPoints: number;
  reward: RedemptionItem;
}

const PointsBalance: React.FC<PointsBalanceProps> = ({ userPoints, reward }) => {
  const canRedeem = userPoints >= reward.points_required;
  
  return (
    <div className="flex items-center justify-between bg-brand-teal/10 rounded-lg p-4 mb-6">
      <div>
        <span className="text-sm text-gray-600">Your current balance</span>
        <div className="flex items-center gap-1 font-bold text-brand-teal">
          <img 
            src="/images/points-coin.svg" 
            alt="Points" 
            width="20"
            height="20"
            className="h-5 w-5" 
          />
          <span>{formatNumber(userPoints)} points</span>
        </div>
      </div>
      {!canRedeem && (
        <div className="text-right">
          <span className="text-sm text-gray-600">You need</span>
          <div className="font-bold text-red-500">
            {formatNumber(reward.points_required - userPoints)} more points
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsBalance;
