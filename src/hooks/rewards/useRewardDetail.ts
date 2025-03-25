
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
        
        // Validate UUID format before querying
        const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
        if (!uuidRegex.test(id)) {
          throw new Error('Invalid reward ID format');
        }
        
        // Fetch reward from Supabase
        const { data, error } = await supabase
          .from('redemption_items')
          .select('*')
          .eq('id', id)
          .single();
        
        if (error) {
          throw error;
        }
        
        if (data) {
          console.log('Reward data from API:', data);
          
          // Map data to RedemptionItem interface
          const rewardData: RedemptionItem = {
            id: data.id,
            name: data.name,
            description: data.description,
            points_required: data.points_required,
            image_url: data.image_url,
            banner_image: data.banner_image,
            is_active: data.is_active,
            terms_conditions: data.terms_conditions,
            redemption_details: data.redemption_details,
            redemption_type: data.redemption_type
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
            console.error('Reward not found in API or mock data');
            setReward(null);
          }
        }
      } catch (error) {
        console.error('Error loading reward:', error);
        
        // Try to find the reward in mock data as fallback
        const foundReward = mockRewards.find(r => r.id === id);
        if (foundReward) {
          console.log('Using mock data as fallback after error');
          setReward(foundReward);
        } else {
          setReward(null);
        }
      } finally {
        setIsLoading(false);
      }
    };

    loadReward();
  }, [id, navigate]);

  return { reward, isLoading };
};
