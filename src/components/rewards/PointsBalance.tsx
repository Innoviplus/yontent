
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber } from '@/lib/formatUtils';

interface PointsBalanceProps {
  userPoints?: number;
  reward?: { points_required: number };
}

const PointsBalance: React.FC<PointsBalanceProps> = ({ userPoints: externalPoints, reward }) => {
  const { userProfile } = useAuth();
  
  // Use external points if provided, otherwise use points from userProfile
  const points = externalPoints !== undefined ? externalPoints : (userProfile?.points || 0);
  
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 shadow-sm">
      <img 
        src="/lovable-uploads/b28ed926-e3d1-4215-9e39-e7b91a7ad3f8.png" 
        alt="Points" 
        className="h-5 w-5"
      />
      <span className="text-sm font-medium">{formatNumber(points)} points</span>
      
      {reward && (
        <span className="text-sm text-gray-500 ml-2">
          / {formatNumber(reward.points_required)} required
        </span>
      )}
    </div>
  );
};

export default PointsBalance;
