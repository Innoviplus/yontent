
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
      // Determine redemption type based on reward name
      const redemptionType = reward.name.toLowerCase().includes('bank') ? 'CASH' : 'GIFT_VOUCHER';
      
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

  return { canRedeem, isRedeeming, handleRedeem };
};
