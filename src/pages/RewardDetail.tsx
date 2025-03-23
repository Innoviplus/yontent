
import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import { toast } from 'sonner';
import Navbar from '@/components/Navbar';
import { Toaster } from '@/components/ui/sonner';
import { Button } from '@/components/ui/button';
import { ArrowLeft, Gift, AlertCircle, Check } from 'lucide-react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { RedemptionItem } from '@/types/redemption';
import { createRedemptionRequest } from '@/services/redemptionService';

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
        <div className="flex items-center gap-2 mb-8">
          <Button 
            variant="ghost" 
            size="icon" 
            onClick={() => navigate('/redeem')}
            className="rounded-full"
          >
            <ArrowLeft className="h-5 w-5" />
          </Button>
          <h1 className="text-2xl font-bold text-gray-900">Reward Details</h1>
        </div>
        
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
            <div className="flex flex-row items-start">
              <div className="w-20 h-20 rounded-lg bg-gray-100 flex items-center justify-center mr-4 overflow-hidden">
                {reward.image_url ? (
                  <img 
                    src={reward.image_url} 
                    alt={reward.name} 
                    className="w-16 h-16 object-contain"
                    onError={(e) => {
                      (e.target as HTMLImageElement).onerror = null; 
                      (e.target as HTMLImageElement).src = "/placeholder.svg";
                    }}
                  />
                ) : (
                  <Gift className="w-10 h-10 text-gray-400" />
                )}
              </div>
              <div>
                <CardTitle className="text-xl">{reward.name}</CardTitle>
                <div className="flex items-center gap-1 text-brand-teal font-semibold mt-1">
                  <img 
                    src="/lovable-uploads/15750ea6-ed41-4d3d-83e2-299853617c30.png" 
                    alt="Points" 
                    className="h-4 w-4" 
                  />
                  <span>{reward.points_required} points required</span>
                </div>
                <div className="text-sm text-gray-600 mt-1">Quantity: 1</div>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <CardDescription className="text-gray-700 whitespace-pre-line mb-6">
              {reward.description}
            </CardDescription>
            
            <div className="bg-gray-50 p-4 rounded-lg mb-6">
              <h3 className="font-medium mb-2">Redemption Details</h3>
              <ul className="space-y-2 text-sm">
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Redemption requests are typically processed within 3-5 business days.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>You will receive a notification once your redemption is approved.</span>
                </li>
                <li className="flex items-start gap-2">
                  <Check className="h-5 w-5 text-green-500 shrink-0 mt-0.5" />
                  <span>Gift cards will be sent to your registered email address.</span>
                </li>
              </ul>
            </div>
            
            <div className="flex items-center justify-between bg-brand-teal/10 rounded-lg p-4 mb-6">
              <div>
                <span className="text-sm text-gray-600">Your current balance</span>
                <div className="flex items-center gap-1 font-bold text-brand-teal">
                  <img 
                    src="/lovable-uploads/15750ea6-ed41-4d3d-83e2-299853617c30.png" 
                    alt="Points" 
                    className="h-5 w-5" 
                  />
                  <span>{userPoints} points</span>
                </div>
              </div>
              {!canRedeem && (
                <div className="text-right">
                  <span className="text-sm text-gray-600">You need</span>
                  <div className="font-bold text-red-500">
                    {reward.points_required - userPoints} more points
                  </div>
                </div>
              )}
            </div>
            
            <Button 
              onClick={handleRedeem}
              disabled={!canRedeem || isRedeeming} 
              className="w-full"
            >
              {isRedeeming ? 'Processing...' : 'Send Redeem Request'}
            </Button>
            
            {!canRedeem && (
              <p className="text-center text-sm text-gray-500 mt-4">
                You don't have enough points yet. Complete more missions to earn points!
              </p>
            )}
          </CardContent>
        </Card>
        
        <div className="bg-white rounded-lg p-6 shadow-sm">
          <h2 className="text-xl font-bold mb-4">Terms & Conditions</h2>
          <div className="prose text-sm text-gray-700">
            <p>By redeeming this reward, you agree to the following terms and conditions:</p>
            <ol className="list-decimal pl-5 space-y-2 mt-2">
              <li>Redemption requests are subject to review and approval.</li>
              <li>Points will be deducted from your account upon approval of your redemption request.</li>
              <li>Rewards cannot be exchanged for cash or other rewards once the redemption request is approved.</li>
              <li>Gift cards and vouchers are subject to the terms and conditions of the issuing company.</li>
              <li>We reserve the right to modify or cancel rewards at any time.</li>
              <li>Please allow 3-5 business days for processing of redemption requests.</li>
              <li>If you choose bank transfer, you must provide valid banking information upon request.</li>
              <li>Rewards are non-transferable and cannot be sold or transferred to another account.</li>
            </ol>
          </div>
        </div>
      </div>
      <Toaster />
    </div>
  );
};

export default RewardDetail;
