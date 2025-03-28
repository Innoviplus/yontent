
import { useState, useEffect } from 'react';
import { Toaster } from '@/components/ui/sonner';
import { usePoints } from '@/contexts/PointsContext';
import Navbar from '@/components/Navbar';
import RewardsList from '@/components/rewards/RewardsList';
import { Gift } from 'lucide-react';
import { formatNumber } from '@/lib/formatUtils';

const Rewards = () => {
  const { userPoints } = usePoints();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-brand-teal" />
            <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
          </div>
          <div className="flex items-center gap-2 bg-brand-teal/10 rounded-full px-4 py-2">
            <img 
              src="/lovable-uploads/15750ea6-ed41-4d3d-83e2-299853617c30.png" 
              alt="Points" 
              className="h-5 w-5" 
            />
            <span className="font-semibold text-brand-teal">{formatNumber(userPoints)} points available</span>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-600">
            Redeem your points for exciting rewards. Browse our collection of gift vouchers and cash rewards below.
          </p>
        </div>
        
        <RewardsList />
      </div>
      <Toaster />
    </div>
  );
};

export default Rewards;
