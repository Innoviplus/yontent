
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
import CashOutForm from '@/components/rewards/CashOutForm';
import { useState } from 'react';

const RewardDetail = () => {
  const { id } = useParams<{ id: string; }>();
  const { userPoints } = usePoints();
  const { reward, isLoading } = useRewardDetail(id);
  const [showCashOutForm, setShowCashOutForm] = useState(false);
  const { canRedeem, isRedeeming, handleRedeem, handleCashOutRedeem } = useRewardRedemption(reward);
  
  const isCashOut = reward?.redemption_type === 'CASH';

  const handleRedeemClick = () => {
    if (isCashOut) {
      setShowCashOutForm(true);
    } else {
      handleRedeem();
    }
  };

  const handleCashOutSubmit = (bankDetails: any) => {
    handleCashOutRedeem(bankDetails);
    setShowCashOutForm(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-5xl py-[90px]">
        <RewardHeader title="Reward Details" />
        
        {isLoading ? (
          <RewardDetailLoading />
        ) : !reward ? (
          <RewardDetailError />
        ) : (
          <>
            <div className="mb-6">
              <Card>
                <div className="md:grid md:grid-cols-2 md:gap-6">
                  {/* Left column - Banner image and basic reward info */}
                  <div className="md:col-span-1">
                    <CardHeader className="pb-3">
                      <RewardBanner bannerImage={reward.banner_image} name={reward.name} />
                    </CardHeader>
                    <CardContent>
                      <RewardInfo reward={reward} />
                      <CardDescription className="text-gray-700 whitespace-pre-line mt-4 mb-6">
                        {reward.description}
                      </CardDescription>
                    </CardContent>
                  </div>
                  
                  {/* Right column - Redemption details and actions */}
                  <div className="md:col-span-1">
                    <CardHeader className="pb-3 md:pt-10">
                      <RedemptionDetails redemptionDetails={reward.redemption_details} />
                      <PointsBalance userPoints={userPoints} reward={reward} />
                      <div className="mt-8">
                        <RedeemButton 
                          canRedeem={canRedeem} 
                          isRedeeming={isRedeeming} 
                          onRedeem={handleRedeemClick}
                          label={isCashOut ? "Request Cash Out" : "Redeem Reward"}
                        />
                      </div>
                    </CardHeader>
                  </div>
                </div>
              </Card>
            </div>
            
            {/* Terms and conditions section remains below the main card */}
            <TermsAndConditions termsConditions={reward.terms_conditions} />
            
            {/* Cash Out Form Dialog */}
            {showCashOutForm && (
              <CashOutForm 
                onSubmit={handleCashOutSubmit}
                onCancel={() => setShowCashOutForm(false)}
                pointsAmount={reward.points_required}
              />
            )}
          </>
        )}
      </div>
      <Toaster />
    </div>
  );
};

export default RewardDetail;
