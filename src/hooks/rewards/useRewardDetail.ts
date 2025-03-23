
import { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RedemptionItem } from '@/types/redemption';
import { supabase } from '@/integrations/supabase/client';

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
        const { data, error } = await supabase
          .from('redemption_items')
          .select('*')
          .eq('id', id)
          .maybeSingle();
        
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
          // If no data found, fallback to mock data for now (for backward compatibility)
          // This can be removed once the API is fully implemented
          const mockRewards: RedemptionItem[] = [
            {
              id: '1',
              name: 'Apple Gift Card',
              description: 'Redeem for an Apple Gift Card that can be used on the App Store, iTunes, Apple Store and more. This gift card can be used to purchase apps, games, music, movies, TV shows, books, and more from the Apple ecosystem.',
              points_required: 5000,
              image_url: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/apple-logo.png',
              is_active: true,
            },
            {
              id: '2',
              name: 'Starbucks Gift Card',
              description: 'Treat yourself to coffee, food and more with a Starbucks Gift Card. Use it at any participating Starbucks store to purchase your favorite beverages, food items, or merchandise. Perfect for coffee lovers!',
              points_required: 3000,
              image_url: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/starbucks-logo.png',
              banner_image: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/starbucks-banner.jpg',
              is_active: true,
            },
            {
              id: '3',
              name: 'Bank Transfer Cash Out',
              description: 'Convert your points directly to cash and transfer to your bank account. The cash equivalent will be calculated based on the current conversion rate and transferred to your registered bank account within 3-5 business days.',
              points_required: 10000,
              image_url: 'https://qoycoypkyqxrcqdpfqhd.supabase.co/storage/v1/object/public/brand-images/bank-logo.png',
              is_active: true,
            },
          ];
          
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
      } finally {
        setIsLoading(false);
      }
    };

    loadReward();
  }, [id, navigate]);

  return { reward, isLoading };
};
