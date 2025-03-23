
import { useNavigate } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { RedemptionItem } from '@/types/redemption';
import { usePoints } from '@/contexts/PointsContext';
import { Gift, ExternalLink } from 'lucide-react';

interface RewardCardProps {
  reward: RedemptionItem;
}

const RewardCard = ({ reward }: RewardCardProps) => {
  const navigate = useNavigate();
  const { userPoints } = usePoints();
  const canRedeem = userPoints >= reward.points_required;
  
  const handleRedeemClick = () => {
    navigate(`/rewards/${reward.id}`);
  };
  
  return (
    <Card className="h-full flex flex-col transition-all hover:shadow-md">
      <CardHeader className="pb-3">
        <div className="w-16 h-16 rounded-lg bg-gray-100 flex items-center justify-center mb-2 overflow-hidden">
          {reward.image_url ? (
            <img 
              src={reward.image_url} 
              alt={reward.name} 
              className="w-12 h-12 object-contain" 
            />
          ) : (
            <Gift className="w-8 h-8 text-gray-400" />
          )}
        </div>
        <CardTitle className="text-lg">{reward.name}</CardTitle>
        <div className="flex items-center gap-1 text-sm text-brand-teal font-semibold">
          <img 
            src="/lovable-uploads/15750ea6-ed41-4d3d-83e2-299853617c30.png" 
            alt="Points" 
            className="h-4 w-4" 
          />
          <span>{reward.points_required} points</span>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <CardDescription className="text-gray-600 line-clamp-3">
          {reward.description}
        </CardDescription>
      </CardContent>
      <CardFooter>
        <Button 
          onClick={handleRedeemClick}
          disabled={!canRedeem} 
          className="w-full flex items-center gap-2"
          variant={canRedeem ? "default" : "outline"}
        >
          {canRedeem ? 'Redeem Now' : 'Not Enough Points'}
          <ExternalLink className="h-4 w-4" />
        </Button>
      </CardFooter>
    </Card>
  );
};

export default RewardCard;
