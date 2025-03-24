
import React from 'react';
import { RedemptionItem } from '@/types/redemption';
import { formatNumber } from '@/lib/formatUtils';

interface RewardInfoProps {
  reward: RedemptionItem;
}

const RewardInfo: React.FC<RewardInfoProps> = ({ reward }) => {
  return (
    <div className="space-y-2">
      <h2 className="text-xl font-semibold text-gray-900">{reward.name}</h2>
      <div className="text-sm text-gray-600">Quantity: 1</div>
      <div className="flex items-center gap-1 text-brand-teal font-medium">
        <span>Redeem</span>
        <img 
          src="/lovable-uploads/b28ed926-e3d1-4215-9e39-e7b91a7ad3f8.png" 
          alt="Points" 
          className="h-5 w-5"
        />
        <span>{formatNumber(reward.points_required)} points</span>
      </div>
    </div>
  );
};

export default RewardInfo;
