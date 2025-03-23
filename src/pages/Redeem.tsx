
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { usePoints } from '@/contexts/PointsContext';
import { Toaster } from '@/components/ui/sonner';
import Navbar from '@/components/Navbar';
import RewardsList from '@/components/rewards/RewardsList';
import { Button } from '@/components/ui/button';
import { ArrowLeft } from 'lucide-react';

const Redeem = () => {
  const { user } = useAuth();
  const { userPoints } = usePoints();
  const navigate = useNavigate();
  
  const [isLoading, setIsLoading] = useState(false);

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-6xl">
        <div className="flex items-center justify-between mb-8">
          <div className="flex items-center gap-2">
            <Button 
              variant="ghost" 
              size="icon" 
              onClick={() => navigate(-1)}
              className="rounded-full"
            >
              <ArrowLeft className="h-5 w-5" />
            </Button>
            <h1 className="text-2xl font-bold text-gray-900">Redeem Points</h1>
          </div>
          <div className="flex items-center gap-2 bg-brand-teal/10 rounded-full px-4 py-2">
            <img 
              src="/lovable-uploads/15750ea6-ed41-4d3d-83e2-299853617c30.png" 
              alt="Points" 
              className="h-5 w-5" 
            />
            <span className="font-semibold text-brand-teal">{userPoints} points available</span>
          </div>
        </div>
        
        <RewardsList />
      </div>
      <Toaster />
    </div>
  );
};

export default Redeem;
