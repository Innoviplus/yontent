
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
        .order('points_required', { ascending: true });
      
      if (error) {
        throw error;
      }
      
      setRewards(data || []);
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
      
      // Ensure the reward has all required fields
      const rewardData: Omit<RedemptionItem, 'id'> = {
        name: reward.name,
        description: reward.description,
        points_required: reward.points_required,
        image_url: reward.image_url,
        banner_image: reward.banner_image,
        is_active: reward.is_active
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
      toast.success('Reward updated successfully');
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
