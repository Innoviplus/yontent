
import React from 'react';
import { RedemptionItem } from '@/types/redemption';
import { formatNumber } from '@/lib/formatUtils';

interface PointsBalanceProps {
  userPoints: number;
  reward: RedemptionItem;
}

const PointsBalance: React.FC<PointsBalanceProps> = ({
  userPoints,
  reward
}) => {
  const canRedeem = userPoints >= reward.points_required;
  
  return (
    <div className="flex items-center justify-between bg-green-50 rounded-lg p-5 mb-6">
      <div className="flex flex-col">
        <span className="text-sm text-gray-600 mb-1">Your current balance</span>
        <div className="flex items-center gap-1.5">
          <img 
            alt="Points" 
            width="22" 
            height="22" 
            className="h-6 w-6" 
            src="/lovable-uploads/b28ed926-e3d1-4215-9e39-e7b91a7ad3f8.png" 
          />
          <span className="text-xl font-bold text-brand-teal">{formatNumber(userPoints)}</span>
          <span className="text-brand-teal">points</span>
        </div>
      </div>
      
      {!canRedeem && (
        <div className="text-right flex flex-col">
          <span className="text-sm text-gray-600 mb-1">You need</span>
          <div className="font-bold text-xl text-red-500">
            {formatNumber(reward.points_required - userPoints)} <span className="text-base">more points</span>
          </div>
        </div>
      )}
    </div>
  );
};

export default PointsBalance;
