
import { useIsMobile } from '@/hooks/use-mobile';
import Navbar from '@/components/Navbar';
import RewardsList from '@/components/rewards/RewardsList';
import { Gift } from 'lucide-react';

const Rewards = () => {
  const isMobile = useIsMobile();

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-24 pb-16 max-w-6xl">
        <div className={`flex ${isMobile ? 'flex-col gap-4' : 'items-center justify-between'} mb-8`}>
          <div className="flex items-center gap-3">
            <Gift className="h-6 w-6 text-brand-teal" />
            <h1 className="text-2xl font-bold text-gray-900">Rewards</h1>
          </div>
        </div>
        
        <div className="mb-8">
          <p className="text-gray-600">
            Redeem your points for exciting rewards. Browse our collection of gift vouchers and cash rewards below.
          </p>
        </div>
        
        <RewardsList />
      </div>
    </div>
  );
};

export default Rewards;
