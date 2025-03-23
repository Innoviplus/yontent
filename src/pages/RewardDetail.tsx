
import { useParams } from 'react-router-dom';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { useRewardDetail } from '@/hooks/rewards/useRewardDetail';
import { useRewardRedemption } from '@/hooks/rewards/useRewardRedemption';
import { usePoints } from '@/contexts/PointsContext';
import RewardHeader from '@/components/rewards/RewardHeader';
import RewardInfo from '@/components/rewards/RewardInfo';
import RedemptionDetails from '@/components/rewards/RedemptionDetails';
import PointsBalance from '@/components/rewards/PointsBalance';
import RedeemButton from '@/components/rewards/RedeemButton';
import TermsAndConditions from '@/components/rewards/TermsAndConditions';
import RewardDetailLoading from '@/components/rewards/RewardDetailLoading';
import RewardDetailError from '@/components/rewards/RewardDetailError';
import RewardBanner from '@/components/rewards/RewardBanner';

const RewardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const { userPoints } = usePoints();
  const { reward, isLoading } = useRewardDetail(id);
  const { canRedeem, isRedeeming, handleRedeem } = useRewardRedemption(reward);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <RewardHeader title="Reward Details" />
        
        {isLoading ? (
          <RewardDetailLoading />
        ) : !reward ? (
          <RewardDetailError />
        ) : (
          <>
            <Card className="mb-6">
              <CardHeader className="pb-3">
                <RewardBanner bannerImage={reward.banner_image} name={reward.name} />
                <RewardInfo reward={reward} />
              </CardHeader>
              <CardContent>
                <CardDescription className="text-gray-700 whitespace-pre-line mb-6">
                  {reward.description}
                </CardDescription>
                
                <RedemptionDetails />
                <PointsBalance userPoints={userPoints} reward={reward} />
                <RedeemButton 
                  canRedeem={canRedeem} 
                  isRedeeming={isRedeeming} 
                  onRedeem={handleRedeem} 
                />
              </CardContent>
            </Card>
            
            <TermsAndConditions />
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default RewardDetail;
