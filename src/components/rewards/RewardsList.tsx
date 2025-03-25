
import { useState, useEffect } from 'react';
import { toast } from 'sonner';
import RewardCard from './RewardCard';
import { RedemptionItem } from '@/types/redemption';
import { supabase } from '@/integrations/supabase/client';
import { mockRewards } from '@/utils/mockRewards';

const RewardsList = () => {
  const [rewards, setRewards] = useState<RedemptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const fetchRewards = async () => {
      try {
        // Fetch rewards from Supabase
        const { data, error } = await supabase
          .from('redemption_items')
          .select('*')
          .eq('is_active', true)
          .order('points_required', { ascending: true });
        
        if (error) {
          throw error;
        }
        
        if (data && data.length > 0) {
          console.log('Rewards data from API:', data);
          // Map data to RedemptionItem interface
          const rewardsData: RedemptionItem[] = data.map(item => ({
            id: item.id,
            name: item.name,
            description: item.description,
            points_required: item.points_required,
            image_url: item.image_url,
            banner_image: item.banner_image,
            is_active: item.is_active,
            // Cast string to union type 
            redemption_type: (item.redemption_type === 'CASH' ? 'CASH' : 'GIFT_VOUCHER') as 'GIFT_VOUCHER' | 'CASH'
          }));
          
          setRewards(rewardsData);
        } else {
          // Fallback to mock data if no data in Supabase
          console.log('No rewards found in API, using mock data');
          setRewards(mockRewards);
        }
      } catch (error) {
        console.error('Error fetching rewards:', error);
        toast.error('Failed to load rewards. Using sample data instead.');
        // Fallback to mock data on error
        setRewards(mockRewards);
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
