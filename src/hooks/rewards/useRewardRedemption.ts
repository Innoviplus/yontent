
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import { toast } from 'sonner';
import { RedemptionItem } from '@/types/redemption';
import { createRedemptionRequest } from '@/services/redemptionService';
import { supabase } from '@/integrations/supabase/client';

export const useRewardRedemption = (reward: RedemptionItem | null) => {
  const { user } = useAuth();
  const { userPoints, refreshPoints } = usePoints();
  const [isRedeeming, setIsRedeeming] = useState(false);

  // Determine if user can redeem the reward
  const canRedeem = 
    !!user && 
    !!reward && 
    userPoints >= reward.points_required;

  // Handle reward redemption
  const handleRedeem = async () => {
    if (!canRedeem || !user || !reward) {
      toast.error("You don't have enough points to redeem this reward");
      return false;
    }
    
    setIsRedeeming(true);
    
    try {
      // Create redemption request
      const result = await createRedemptionRequest({
        userId: user.id,
        itemId: reward.id,
        pointsAmount: reward.points_required
      });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Refresh user points after redemption
      await refreshPoints();
      
      toast.success('Reward redemption request submitted successfully!');
      return true;
    } catch (error) {
      console.error('Error in redemption:', error);
      toast.error('There was a problem processing your redemption request');
      return false;
    } finally {
      setIsRedeeming(false);
    }
  };

  // Handle cash out redemption
  const handleCashOutRedeem = async (bankDetails: any) => {
    if (!canRedeem || !user || !reward) {
      toast.error("You don't have enough points to redeem this reward");
      return false;
    }
    
    setIsRedeeming(true);
    
    try {
      // Create redemption request with bank details
      const result = await createRedemptionRequest({
        userId: user.id,
        itemId: reward.id,
        pointsAmount: reward.points_required,
        paymentDetails: {
          bank_details: bankDetails
        }
      });
      
      if (!result.success) {
        throw new Error(result.message);
      }
      
      // Refresh user points after redemption
      await refreshPoints();
      
      toast.success('Cash out request submitted successfully!');
      return true;
    } catch (error) {
      console.error('Error in cash out redemption:', error);
      toast.error('There was a problem processing your cash out request');
      return false;
    } finally {
      setIsRedeeming(false);
    }
  };

  return {
    canRedeem,
    isRedeeming,
    handleRedeem,
    handleCashOutRedeem
  };
};
