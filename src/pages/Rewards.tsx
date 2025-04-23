
import { useState, useEffect } from 'react';
import Navbar from '@/components/Navbar';
import { Gift } from 'lucide-react';
import { useAuth } from '@/contexts/AuthContext';
import { usePageTitle } from '@/hooks/usePageTitle';
import { Card, CardContent } from '@/components/ui/card';
import { useIsMobile } from '@/hooks/use-mobile';
import RewardsList from '@/components/rewards/RewardsList';
import PointsBalance from '@/components/rewards/PointsBalance';

const Rewards = () => {
  usePageTitle('Rewards');
  const { user } = useAuth();
  const isMobile = useIsMobile();
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="container mx-auto px-4 pt-24 pb-16">
        <div className={`flex flex-col md:flex-row justify-between items-start md:items-center ${isMobile ? 'mb-4' : 'mb-8'} gap-4`}>
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-brand-teal" />
            <h1 className="text-2xl font-bold">Rewards</h1>
          </div>
          
          {user && <PointsBalance />}
        </div>
        
        {!user && (
          <Card className="mb-6">
            <CardContent className="p-6">
              <p>Sign in to redeem points for exciting rewards!</p>
            </CardContent>
          </Card>
        )}
        
        <RewardsList />
      </div>
    </div>
  );
};

export default Rewards;
