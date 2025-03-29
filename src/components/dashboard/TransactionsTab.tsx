
import { 
  Card,
  CardContent
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { format } from 'date-fns';
import { Badge } from '@/components/ui/badge';
import { useUserRedemptionRequests } from '@/hooks/useUserRedemptionRequests';
import { TrendingDown, Gift, Award } from 'lucide-react';

const TransactionsTab = () => {
  const { requests, isLoading } = useUserRedemptionRequests();

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'APPROVED':
        return "bg-green-100 text-green-800 border-green-200";
      case 'REJECTED':
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  if (requests.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600">
            You don't have any redemption transactions yet. Redeem your points for rewards to see transactions here!
          </p>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardContent className="p-0 sm:p-0">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Reward</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {requests.map((request) => (
              <TableRow key={request.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Gift className="h-4 w-4 text-orange-500" />
                    </div>
                    <div>
                      <div className="font-medium">
                        {request.itemName}
                      </div>
                      <div className="text-sm text-gray-500">
                        Points Redemption
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {format(request.createdAt, 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge className={getStatusColor(request.status)}>
                    {request.status}
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-red-100 text-red-800 border-red-200">
                    -{request.pointsAmount}
                  </Badge>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
};

export default TransactionsTab;
