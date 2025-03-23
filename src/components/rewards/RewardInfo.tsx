
import React from 'react';
import { Gift } from 'lucide-react';
import { RedemptionItem } from '@/types/redemption';
import { CardTitle } from '@/components/ui/card';
import { formatNumber } from '@/lib/formatUtils';

interface RewardInfoProps {
  reward: RedemptionItem;
}

const RewardInfo: React.FC<RewardInfoProps> = ({ reward }) => {
  return (
    <div className="flex flex-row items-start">
      <div className="w-20 h-20 rounded-lg bg-gradient-to-br from-slate-100 to-slate-200 flex items-center justify-center mr-4 overflow-hidden shadow-sm">
        {reward.image_url ? (
          <img 
            src={reward.image_url} 
            alt={reward.name} 
            className="w-16 h-16 object-contain"
            onError={(e) => {
              (e.target as HTMLImageElement).onerror = null; 
              (e.target as HTMLImageElement).src = "/placeholder.svg";
            }}
          />
        ) : (
          <div className="bg-gradient-to-br from-blue-50 to-blue-100 w-full h-full flex items-center justify-center">
            <Gift className="w-10 h-10 text-blue-400" />
          </div>
        )}
      </div>
      <div>
        <CardTitle className="text-xl">{reward.name}</CardTitle>
        <div className="flex items-center gap-1 text-brand-teal font-semibold mt-1">
          <img 
            src="/lovable-uploads/15750ea6-ed41-4d3d-83e2-299853617c30.png" 
            alt="Points" 
            className="h-4 w-4" 
          />
          <span>{formatNumber(reward.points_required)} points required</span>
        </div>
        <div className="text-sm text-gray-600 mt-1">Quantity: 1</div>
      </div>
    </div>
  );
};

export default RewardInfo;
