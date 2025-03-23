
import { useState, useEffect } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Coffee, Gift, Apple, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { fetchRedemptionItems, submitRedemptionRequest } from '@/services/redemptionService';
import { RedemptionItem } from '@/types/redemption';

// Fallback icon mapping for different item types
const getIconForItem = (title: string) => {
  const titleLower = title.toLowerCase();
  
  if (titleLower.includes('bank') || titleLower.includes('cash')) {
    return <CreditCard className="h-8 w-8 text-brand-teal" />;
  } else if (titleLower.includes('coffee') || titleLower.includes('starbucks')) {
    return <Coffee className="h-8 w-8 text-green-600" />;
  } else if (titleLower.includes('apple')) {
    return <Apple className="h-8 w-8 text-gray-800" />;
  } else {
    return <Gift className="h-8 w-8 text-pink-500" />;
  }
};

const RedeemPoints = () => {
  const { user, userProfile } = useAuth();
  const [isRedeeming, setIsRedeeming] = useState(false);
  const [redeemableItems, setRedeemableItems] = useState<RedemptionItem[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  
  const userPoints = userProfile?.points || 0;
  
  useEffect(() => {
    const loadRedemptionItems = async () => {
      setIsLoading(true);
      try {
        const items = await fetchRedemptionItems();
        setRedeemableItems(items);
      } catch (error) {
        console.error("Failed to fetch redemption items:", error);
      } finally {
        setIsLoading(false);
      }
    };
    
    loadRedemptionItems();
  }, []);
  
  const handleRedeem = async (option: RedemptionItem) => {
    if (!user?.id) {
      toast.error("You need to be logged in to redeem points");
      return;
    }
    
    setIsRedeeming(true);
    
    try {
      if (userPoints >= option.points_required) {
        // Determine redemption type based on item name or description
        const redemptionType = option.name.toLowerCase().includes('cash') ? 'CASH' : 'GIFT_VOUCHER';
        
        const success = await submitRedemptionRequest(
          user.id,
          option.id || '',
          option.points_required,
          redemptionType
        );
        
        if (success) {
          toast.success(`Successfully redeemed ${option.name}! You'll receive it soon.`);
        } else {
          toast.error("Failed to process redemption. Please try again.");
        }
      } else {
        toast.error(`Not enough points. You need ${option.points_required - userPoints} more points.`);
      }
    } catch (error) {
      console.error("Redemption error:", error);
      toast.error("An unexpected error occurred during redemption");
    } finally {
      setIsRedeeming(false);
    }
  };
  
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-5xl">
        <div className="mb-8">
          <h1 className="text-3xl font-bold">Redeem Your Points</h1>
          <p className="text-gray-600 mt-2">
            You currently have <span className="font-semibold text-brand-teal">{userPoints} points</span> to redeem
          </p>
        </div>
        
        {isLoading ? (
          <div className="flex justify-center items-center h-64">
            <Loader2 className="h-8 w-8 animate-spin text-brand-teal" />
            <span className="ml-2 text-gray-600">Loading redemption options...</span>
          </div>
        ) : redeemableItems.length === 0 ? (
          <Card className="text-center p-8">
            <div className="flex flex-col items-center justify-center">
              <Gift className="h-12 w-12 text-gray-400 mb-4" />
              <h3 className="text-xl font-medium">No Redemption Options Available</h3>
              <p className="text-gray-500 mt-2">
                Check back later for available redemption options.
              </p>
            </div>
          </Card>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {redeemableItems.map((option) => (
              <Card key={option.id} className="overflow-hidden hover:shadow-md transition-shadow">
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-start">
                    <div className="p-3 bg-gray-100 rounded-lg">
                      {option.image_url ? (
                        <img 
                          src={option.image_url} 
                          alt={option.name} 
                          className="h-8 w-8 object-contain" 
                        />
                      ) : (
                        getIconForItem(option.name)
                      )}
                    </div>
                    <div className="bg-brand-teal/10 px-3 py-1 rounded-full text-brand-teal font-medium">
                      {`$${option.points_required / 100}`}
                    </div>
                  </div>
                  <CardTitle className="mt-4">{option.name}</CardTitle>
                  <CardDescription>{option.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center justify-between">
                    <div className="text-sm text-gray-500">
                      Points required: <span className="font-semibold">{option.points_required}</span>
                    </div>
                    {userPoints < option.points_required && (
                      <div className="text-xs text-red-500">
                        Need {option.points_required - userPoints} more points
                      </div>
                    )}
                  </div>
                </CardContent>
                <CardFooter>
                  <Button 
                    onClick={() => handleRedeem(option)}
                    disabled={userPoints < option.points_required || isRedeeming}
                    className="w-full bg-brand-teal hover:bg-brand-teal/90"
                  >
                    {isRedeeming ? 'Processing...' : 'Redeem Now'}
                  </Button>
                </CardFooter>
              </Card>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};

export default RedeemPoints;
