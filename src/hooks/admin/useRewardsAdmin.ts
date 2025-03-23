
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
      
      // Remove any undefined or null values from the reward object
      const cleanedReward = Object.fromEntries(
        Object.entries(reward).filter(([_, v]) => v !== null && v !== undefined)
      );
      
      const { data, error } = await supabase
        .from('redemption_items')
        .insert(cleanedReward)
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
      // Remove any undefined values from the updates object
      const cleanedUpdates = Object.fromEntries(
        Object.entries(updates).filter(([_, v]) => v !== undefined)
      );
      
      const { data, error } = await supabase
        .from('redemption_items')
        .update(cleanedUpdates)
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
