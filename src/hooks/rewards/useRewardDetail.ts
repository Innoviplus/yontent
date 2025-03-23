
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RedemptionItem } from '@/types/redemption';
import { supabase } from '@/integrations/supabase/client';
import { mockRewards } from '@/utils/mockRewards';

export const useRewardDetail = (id: string | undefined) => {
  const navigate = useNavigate();
  const [reward, setReward] = useState<RedemptionItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  
  useEffect(() => {
    const loadReward = async () => {
      if (!id) {
        setIsLoading(false);
        return;
      }

      try {
        setIsLoading(true);
        
        // Fetch reward from Supabase
        // To fix the type error, we need to use a different approach with typecasting
        const { data, error } = await supabase
          .from('redemption_items')
          .select('*')
          .eq('id', id)
          .maybeSingle() as any;
        
        if (error) {
          throw error;
        }
        
        if (data) {
          console.log('Reward data from API:', data);
          // Transform data to match RedemptionItem type
          const rewardData: RedemptionItem = {
            id: data.id,
            name: data.name,
            description: data.description,
            points_required: data.points_required,
            image_url: data.image_url,
            banner_image: data.banner_image,
            is_active: data.is_active
          };
          
          setReward(rewardData);
        } else {
          // If no data found, fallback to mock data
          console.log('Reward not found in API, looking in mock data');
          const foundReward = mockRewards.find(r => r.id === id);
          
          if (foundReward) {
            console.log('Reward found in mock data:', foundReward);
            setReward(foundReward);
          } else {
            toast.error('Reward not found');
            navigate('/redeem');
          }
        }
      } catch (error) {
        console.error('Error loading reward:', error);
        toast.error('Failed to load reward details');
        
        // Try to find the reward in mock data as fallback
        const foundReward = mockRewards.find(r => r.id === id);
        if (foundReward) {
          console.log('Using mock data as fallback after error');
          setReward(foundReward);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadReward();
  }, [id, navigate]);

  return { reward, isLoading };
};
