
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import RewardCard from './RewardCard';
import { RedemptionItem } from '@/types/redemption';
import { getRedemptionItems } from '@/services/redemption/getRedemptionItems';

const RewardsList = () => {
  const [rewards, setRewards] = useState<RedemptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        setIsLoading(true);
        const rewardsData = await getRedemptionItems();
        setRewards(rewardsData);
      } catch (error) {
        console.error('Error fetching rewards:', error);
        toast.error('Failed to load rewards. Using sample data instead.');
      } finally {
        setIsLoading(false);
      }
    };

    fetchRewards();
  }, []);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {[1, 2, 3].map((i) => (
          <div key={i} className="bg-white rounded-lg p-6 shadow-sm h-64 animate-pulse">
            <div className="w-16 h-16 bg-gray-200 rounded-lg mb-4"></div>
            <div className="h-6 bg-gray-200 rounded w-3/4 mb-2"></div>
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-20 bg-gray-200 rounded mb-4"></div>
            <div className="h-8 bg-gray-200 rounded-full w-full"></div>
          </div>
        ))}
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
      {rewards.map((reward) => (
        <RewardCard key={reward.id} reward={reward} />
      ))}
    </div>
  );
};

export default RewardsList;
