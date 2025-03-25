
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { RedemptionItem } from '@/types/redemption';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import { createRedemptionRequest } from '@/services/redemptionService';

export const useRewardRedemption = (reward: RedemptionItem | null) => {
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userPoints, refreshPoints } = usePoints();
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const canRedeem = userPoints >= (reward?.points_required || 0);

  const handleRedeem = async () => {
    if (!user || !reward) return;
    
    setIsRedeeming(true);
    
    try {
      // Determine redemption type based on reward configuration
      const redemptionType = reward.redemption_type || 'GIFT_VOUCHER';
      
      // Create redemption request
      const result = await createRedemptionRequest(
        user.id, 
        reward.points_required,
        redemptionType,
        { reward_id: reward.id, reward_name: reward.name }
      );
      
      if (result) {
        toast.success('Redemption request submitted successfully!');
        refreshPoints(); // Refresh user points
        navigate('/dashboard'); // Redirect to dashboard after successful redemption
      } else {
        throw new Error('Failed to create redemption request');
      }
    } catch (error) {
      console.error('Error redeeming reward:', error);
      toast.error('Failed to redeem reward. Please try again.');
    } finally {
      setIsRedeeming(false);
    }
  };

  const handleCashOutRedeem = async (bankDetails: any) => {
    if (!user || !reward) return;
    
    setIsRedeeming(true);
    
    try {
      // Create redemption request with bank details
      const result = await createRedemptionRequest(
        user.id, 
        reward.points_required,
        'CASH',
        { 
          reward_id: reward.id, 
          reward_name: reward.name,
          bank_details: bankDetails
        }
      );
      
      if (result) {
        toast.success('Cash out request submitted successfully!');
        refreshPoints(); // Refresh user points
        navigate('/dashboard'); // Redirect to dashboard after successful redemption
      } else {
        throw new Error('Failed to create cash out request');
      }
    } catch (error) {
      console.error('Error processing cash out:', error);
      toast.error('Failed to process cash out. Please try again.');
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
