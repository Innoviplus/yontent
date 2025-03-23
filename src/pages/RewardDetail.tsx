
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { AlertCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RedemptionItem } from '@/types/redemption';
import { createRedemptionRequest } from '@/services/redemptionService';
import RewardHeader from '@/components/rewards/RewardHeader';
import RewardInfo from '@/components/rewards/RewardInfo';
import RedemptionDetails from '@/components/rewards/RedemptionDetails';
import PointsBalance from '@/components/rewards/PointsBalance';
import RedeemButton from '@/components/rewards/RedeemButton';
import TermsAndConditions from '@/components/rewards/TermsAndConditions';

const RewardDetail = () => {
  const { id } = useParams<{ id: string }>();
  const navigate = useNavigate();
  const { user } = useAuth();
  const { userPoints, refreshPoints } = usePoints();
  
  const [reward, setReward] = useState<RedemptionItem | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  // Mock rewards data (to be replaced with actual API call)
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

  useEffect(() => {
    const loadReward = async () => {
      try {
        // Find the reward in our mock data for now
        const foundReward = mockRewards.find(r => r.id === id);
        
        if (foundReward) {
          setReward(foundReward);
        } else {
          toast.error('Reward not found');
          navigate('/redeem');
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

  const canRedeem = userPoints >= (reward?.points_required || 0);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
          <div className="animate-pulse">
            <div className="h-8 bg-gray-200 rounded w-1/3 mb-8"></div>
            <div className="bg-white rounded-lg p-6 shadow-sm">
              <div className="w-20 h-20 bg-gray-200 rounded-lg mb-4"></div>
              <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
              <div className="h-4 bg-gray-200 rounded w-1/4 mb-8"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-full mb-2"></div>
              <div className="h-4 bg-gray-200 rounded w-3/4 mb-8"></div>
              <div className="h-10 bg-gray-200 rounded-full w-full"></div>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!reward) {
    return (
      <div className="min-h-screen bg-gray-50">
        <Navbar />
        <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
          <Alert variant="destructive">
            <AlertCircle className="h-4 w-4" />
            <AlertTitle>Error</AlertTitle>
            <AlertDescription>
              Reward not found. Please return to the rewards page.
            </AlertDescription>
          </Alert>
          <Button 
            onClick={() => navigate('/redeem')}
            className="mt-4"
          >
            Back to Rewards
          </Button>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <RewardHeader title="Reward Details" />
        
        <Card className="mb-6">
          <CardHeader className="pb-3">
            {reward.banner_image && (
              <div className="h-40 w-full mb-4 rounded-lg overflow-hidden">
                <img 
                  src={reward.banner_image} 
                  alt={`${reward.name} Banner`} 
                  className="w-full h-full object-cover"
                  onError={(e) => {
                    (e.target as HTMLImageElement).onerror = null; 
                    (e.target as HTMLImageElement).style.display = 'none';
                  }}
                />
              </div>
            )}
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
      </div>
      <Toaster />
    </div>
  );
};

export default RewardDetail;
