
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import RewardCard from './RewardCard';
import { getRedemptionItems } from '@/services/redemptionService';
import { RedemptionItem } from '@/types/redemption';

const RewardsList = () => {
  const [rewards, setRewards] = useState<RedemptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  const mockRewards: RedemptionItem[] = [
    {
      id: '1',
      name: 'Apple Gift Card',
      description: 'Redeem for an Apple Gift Card that can be used on the App Store, iTunes, Apple Store and more.',
      points_required: 5000,
      image_url: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/apple-logo.png',
      is_active: true,
    },
    {
      id: '2',
      name: 'Starbucks Gift Card',
      description: 'Treat yourself to coffee, food and more with a Starbucks Gift Card.',
      points_required: 3000,
      image_url: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/starbucks-logo.png',
      is_active: true,
    },
    {
      id: '3',
      name: 'Bank Transfer Cash Out',
      description: 'Convert your points directly to cash and transfer to your bank account.',
      points_required: 10000,
      image_url: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/bank-logo.png',
      is_active: true,
    },
  ];

  useEffect(() => {
    // For now, use mock data
    // In the future, we'll implement the backend to fetch actual rewards
    setRewards(mockRewards);
    setIsLoading(false);
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
