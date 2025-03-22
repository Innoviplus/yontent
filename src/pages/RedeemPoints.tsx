
import { useState } from 'react';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { CreditCard, Coffee, Gift, Apple } from 'lucide-react';
import { toast } from 'sonner';

const redeemOptions = [
  {
    id: 'bank-transfer',
    title: 'Bank Transfer Cash Out',
    description: 'Get cash deposited directly to your bank account',
    icon: <CreditCard className="h-8 w-8 text-brand-teal" />,
    pointsRequired: 1000,
    value: '$10'
  },
  {
    id: 'starbucks',
    title: 'Starbucks Coupon',
    description: 'Enjoy a coffee break on us',
    icon: <Coffee className="h-8 w-8 text-green-600" />,
    pointsRequired: 500,
    value: '$5'
  },
  {
    id: 'watsons',
    title: 'Watsons Gift Voucher',
    description: 'Shop for health and beauty products',
    icon: <Gift className="h-8 w-8 text-pink-500" />,
    pointsRequired: 800,
    value: '$8'
  },
  {
    id: 'apple',
    title: 'Apple Gift Card',
    description: 'Use for Apps, Games, Music, Movies, and more',
    icon: <Apple className="h-8 w-8 text-gray-800" />,
    pointsRequired: 2500,
    value: '$25'
  }
];

const RedeemPoints = () => {
  const { user, userProfile } = useAuth();
  const [isRedeeming, setIsRedeeming] = useState(false);
  
  const userPoints = userProfile?.points || 0;
  
  const handleRedeem = (option: typeof redeemOptions[0]) => {
    setIsRedeeming(true);
    
    // Simulate API call
    setTimeout(() => {
      if (userPoints >= option.pointsRequired) {
        toast.success(`Successfully redeemed ${option.title}! You'll receive it soon.`);
      } else {
        toast.error(`Not enough points. You need ${option.pointsRequired - userPoints} more points.`);
      }
      setIsRedeeming(false);
    }, 1500);
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
        
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {redeemOptions.map((option) => (
            <Card key={option.id} className="overflow-hidden hover:shadow-md transition-shadow">
              <CardHeader className="pb-2">
                <div className="flex justify-between items-start">
                  <div className="p-3 bg-gray-100 rounded-lg">{option.icon}</div>
                  <div className="bg-brand-teal/10 px-3 py-1 rounded-full text-brand-teal font-medium">
                    {option.value}
                  </div>
                </div>
                <CardTitle className="mt-4">{option.title}</CardTitle>
                <CardDescription>{option.description}</CardDescription>
              </CardHeader>
              <CardContent>
                <div className="flex items-center justify-between">
                  <div className="text-sm text-gray-500">
                    Points required: <span className="font-semibold">{option.pointsRequired}</span>
                  </div>
                  {userPoints < option.pointsRequired && (
                    <div className="text-xs text-red-500">
                      Need {option.pointsRequired - userPoints} more points
                    </div>
                  )}
                </div>
              </CardContent>
              <CardFooter>
                <Button 
                  onClick={() => handleRedeem(option)}
                  disabled={userPoints < option.pointsRequired || isRedeeming}
                  className="w-full bg-brand-teal hover:bg-brand-teal/90"
                >
                  {isRedeeming ? 'Processing...' : 'Redeem Now'}
                </Button>
              </CardFooter>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default RedeemPoints;
