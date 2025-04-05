
import { useState, useEffect, useCallback } from 'react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { RedemptionItem } from '@/types/redemption';

export const useRewardsAdmin = () => {
  const [rewards, setRewards] = useState<RedemptionItem[]>([]);
  const [isLoadingRewards, setIsLoadingRewards] = useState(true);

  const fetchRewards = useCallback(async () => {
    try {
      setIsLoadingRewards(true);
      const { data, error } = await supabase
        .from('redemption_items')
        .select('*')
        .order('display_order', { ascending: true })
        .order('points_required', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      const typedRewards: RedemptionItem[] = (data || []).map(item => ({
        ...item,
        display_order: item.display_order || 0, // Provide default value for display_order
        redemption_type: (item.redemption_type === 'CASH' ? 'CASH' : 'GIFT_VOUCHER') as 'GIFT_VOUCHER' | 'CASH'
      }));
      
      setRewards(typedRewards);
    } catch (error) {
      console.error('Error fetching rewards:', error);
      toast.error('Failed to load rewards');
    } finally {
      setIsLoadingRewards(false);
    }
  }, []);

  useEffect(() => {
    fetchRewards();
  }, [fetchRewards]);

  const addReward = async (reward: Omit<RedemptionItem, 'id'>) => {
    try {
      console.log('Adding reward:', reward);
      
      // Get the highest display order to put the new item at the end
      let displayOrder = 0;
      if (rewards.length > 0) {
        const maxOrder = Math.max(...rewards.map(r => r.display_order || 0));
        displayOrder = maxOrder + 10; // Use increments of 10 to leave room for manual adjustments
      }
      
      // Ensure the reward has all required fields
      const rewardData: Omit<RedemptionItem, 'id'> = {
        name: reward.name,
        description: reward.description,
        points_required: reward.points_required,
        image_url: reward.image_url,
        banner_image: reward.banner_image,
        is_active: reward.is_active,
        terms_conditions: reward.terms_conditions,
        redemption_details: reward.redemption_details,
        redemption_type: reward.redemption_type,
        display_order: displayOrder
      };
      
      const { data, error } = await supabase
        .from('redemption_items')
        .insert(rewardData)
        .select('*')
        .single();
      
      if (error) {
        console.error('Error creating reward:', error);
        throw error;
      }
      
      setRewards(prev => [...prev, data as RedemptionItem]);
      toast.success('Reward created successfully');
      return true;
    } catch (error: any) {
      console.error('Error creating reward:', error);
      toast.error(`Failed to create reward: ${error.message || 'Unknown error'}`);
      return false;
    }
  };

  const updateReward = async (id: string, updates: Partial<RedemptionItem>) => {
    try {
      // Ensure we're only sending valid fields to update
      const validUpdates: Partial<RedemptionItem> = {};
      
      if (updates.name !== undefined) validUpdates.name = updates.name;
      if (updates.description !== undefined) validUpdates.description = updates.description;
      if (updates.points_required !== undefined) validUpdates.points_required = updates.points_required;
      if (updates.image_url !== undefined) validUpdates.image_url = updates.image_url;
      if (updates.banner_image !== undefined) validUpdates.banner_image = updates.banner_image;
      if (updates.is_active !== undefined) validUpdates.is_active = updates.is_active;
      if (updates.terms_conditions !== undefined) validUpdates.terms_conditions = updates.terms_conditions;
      if (updates.redemption_details !== undefined) validUpdates.redemption_details = updates.redemption_details;
      if (updates.redemption_type !== undefined) validUpdates.redemption_type = updates.redemption_type;
      if (updates.display_order !== undefined) validUpdates.display_order = updates.display_order;
      
      const { data, error } = await supabase
        .from('redemption_items')
        .update(validUpdates)
        .eq('id', id)
        .select('*')
        .single();
      
      if (error) {
        throw error;
      }
      
      setRewards(prev => prev.map(item => item.id === id ? (data as RedemptionItem) : item));
      
      // Refresh rewards data to ensure correct ordering after a display_order update
      if (updates.display_order !== undefined) {
        await fetchRewards();
      }
      
      return true;
    } catch (error) {
      console.error('Error updating reward:', error);
      toast.error('Failed to update reward');
      return false;
    }
  };

  const deleteReward = async (id: string) => {
    try {
      const { error } = await supabase
        .from('redemption_items')
        .delete()
        .eq('id', id);
      
      if (error) {
        throw error;
      }
      
      setRewards(prev => prev.filter(item => item.id !== id));
      toast.success('Reward deleted successfully');
      return true;
    } catch (error) {
      console.error('Error deleting reward:', error);
      toast.error('Failed to delete reward');
      return false;
    }
  };

  return {
    rewards,
    isLoadingRewards,
    addReward,
    updateReward,
    deleteReward,
    refreshRewards: fetchRewards
  };
};
