
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
import { useUserPointTransactions } from '@/hooks/points/useUserPointTransactions';
import { TrendingDown, Gift, Award, LogIn } from 'lucide-react';

const TransactionsTab = () => {
  const { requests, isLoading: isLoadingRedemptions } = useUserRedemptionRequests();
  const { transactions, isLoading: isLoadingTransactions } = useUserPointTransactions();

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

  const isLoading = isLoadingRedemptions || isLoadingTransactions;

  if (isLoading) {
    return (
      <div className="space-y-4">
        {[1, 2, 3].map(i => (
          <div key={i} className="h-16 bg-gray-100 rounded-md animate-pulse" />
        ))}
      </div>
    );
  }

  // Combine redemption requests and point transactions into a unified list
  const allTransactions = [
    ...requests.map(request => ({
      id: request.id,
      type: 'REDEMPTION',
      name: request.itemName,
      date: request.createdAt,
      status: request.status,
      points: -request.pointsAmount,
      isRejected: request.status === 'REJECTED'
    })),
    ...transactions.map(transaction => ({
      id: transaction.id,
      type: transaction.type,
      name: transaction.type === 'WELCOME' ? 'Welcome Bonus' : transaction.description,
      date: transaction.createdAt,
      status: 'COMPLETED',
      points: transaction.amount,
      isRejected: false
    }))
  ].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  if (allTransactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600">
            You don't have any point transactions yet.
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
              <TableHead>Activity</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {allTransactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="mr-2">
                      {transaction.type === 'REDEMPTION' ? (
                        <Gift className="h-4 w-4 text-orange-500" />
                      ) : transaction.type === 'WELCOME' ? (
                        <LogIn className="h-4 w-4 text-green-500" />
                      ) : (
                        <Award className="h-4 w-4 text-blue-500" />
                      )}
                    </div>
                    <div>
                      <div className="font-medium">
                        {transaction.name}
                      </div>
                      <div className="text-sm text-gray-500">
                        {transaction.type === 'REDEMPTION' ? 'Points Redemption' : 'Points Earned'}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {format(new Date(transaction.date), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  {transaction.type === 'REDEMPTION' ? (
                    <Badge className={getStatusColor(transaction.status)}>
                      {transaction.status}
                    </Badge>
                  ) : (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      COMPLETED
                    </Badge>
                  )}
                </TableCell>
                <TableCell className="text-right">
                  {transaction.points < 0 ? (
                    transaction.isRejected ? (
                      <div className="flex flex-col items-end">
                        <Badge className="bg-red-100 text-red-800 border-red-200 line-through">
                          {transaction.points}
                        </Badge>
                        <span className="text-xs text-green-600 font-medium mt-1">
                          Points returned
                        </span>
                      </div>
                    ) : (
                      <Badge className="bg-red-100 text-red-800 border-red-200">
                        {transaction.points}
                      </Badge>
                    )
                  ) : (
                    <Badge className="bg-green-100 text-green-800 border-green-200">
                      +{transaction.points}
                    </Badge>
                  )}
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
