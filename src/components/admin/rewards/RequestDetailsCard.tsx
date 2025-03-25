
import { 
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from '@/components/ui/card';
import { RedemptionRequest } from '@/lib/types';
import { User, Calendar } from 'lucide-react';
import { format } from 'date-fns';

interface RequestDetailsCardProps {
  request: RedemptionRequest;
}

const RequestDetailsCard = ({ request }: RequestDetailsCardProps) => {
  return (
    <Card>
      <CardHeader>
        <CardTitle className="text-lg flex items-center gap-2">
          <User className="h-5 w-5 text-gray-500" />
          Request Details
        </CardTitle>
        <CardDescription>
          Request submitted on {format(request.createdAt, 'MMM d, yyyy')}
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid grid-cols-2 gap-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Redemption Type</p>
            <p className="text-base">{request.redemptionType === 'CASH' ? 'Cash Out' : 'Gift Voucher'}</p>
          </div>
          <div>
            <p className="text-sm font-medium text-gray-500">Points Amount</p>
            <p className="text-base font-semibold">{request.pointsAmount} points</p>
          </div>
        </div>
        
        {request.paymentDetails?.reward_name && (
          <div>
            <p className="text-sm font-medium text-gray-500">Reward</p>
            <p className="text-base">{request.paymentDetails.reward_name}</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
};

export default RequestDetailsCard;
