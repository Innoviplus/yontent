
import React from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { formatNumber } from '@/lib/formatUtils';

const PointsBalance: React.FC = () => {
  const { user } = useAuth();
  
  if (!user) return null;
  
  return (
    <div className="flex items-center gap-2 bg-white rounded-lg px-4 py-2.5 shadow-sm">
      <img 
        src="/lovable-uploads/b28ed926-e3d1-4215-9e39-e7b91a7ad3f8.png" 
        alt="Points" 
        className="h-5 w-5"
      />
      <span className="text-sm font-medium">{formatNumber(user.points || 0)} points</span>
    </div>
  );
};

export default PointsBalance;
