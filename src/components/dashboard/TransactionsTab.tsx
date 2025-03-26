
import { useState } from 'react';
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
import { useAuth } from '@/contexts/AuthContext';
import { PointTransaction } from '@/lib/types';
import { toast } from 'sonner';
import { TrendingUp, TrendingDown, CircleDollarSign, Gift, Award, Settings } from 'lucide-react';

// Mock transactions since we don't have the point_transactions table in Supabase yet
const mockTransactions: PointTransaction[] = [
  {
    id: '1',
    userId: '1',
    amount: 100,
    type: 'EARNED',
    source: 'MISSION_REVIEW',
    description: 'Completed mission: Product Review',
    createdAt: new Date(Date.now() - 86400000) // yesterday
  },
  {
    id: '2',
    userId: '1',
    amount: 50,
    type: 'REDEEMED',
    source: 'REDEMPTION',
    description: 'Redeemed for Gift Card',
    createdAt: new Date(Date.now() - 172800000) // 2 days ago
  }
];

const TransactionsTab = () => {
  const [transactions, setTransactions] = useState<PointTransaction[]>(mockTransactions);
  const [isLoading, setIsLoading] = useState(false);
  const { user } = useAuth();

  const getTypeIcon = (type: string, source: string) => {
    if (type === 'EARNED') {
      return <TrendingUp className="h-4 w-4 text-green-500" />;
    } else if (type === 'REDEEMED') {
      return source === 'REDEMPTION' && <Gift className="h-4 w-4 text-orange-500" />;
    } else if (type === 'ADJUSTED') {
      return <Settings className="h-4 w-4 text-purple-500" />;
    } else if (type === 'REFUNDED') {
      return <CircleDollarSign className="h-4 w-4 text-blue-500" />;
    }
    return <Award className="h-4 w-4 text-brand-teal" />;
  };

  const getSourceLabel = (source: string, type: string) => {
    switch (source) {
      case 'MISSION_REVIEW':
        return 'Review Post';
      case 'RECEIPT_SUBMISSION':
        return 'Receipt Submission';
      case 'REDEMPTION':
        return type === 'REDEEMED' ? 'Points Redemption' : 'Redemption Refund';
      case 'ADMIN_ADJUSTMENT':
        return 'Manual Adjustment';
      default:
        return source;
    }
  };

  const getTransactionTitle = (transaction: PointTransaction) => {
    const sourceLabel = getSourceLabel(transaction.source, transaction.type);
    
    if (transaction.type === 'EARNED') {
      return `Earned Points - ${sourceLabel}`;
    } else if (transaction.type === 'REDEEMED') {
      return `Redeemed Points - ${sourceLabel}`;
    } else if (transaction.type === 'REFUNDED') {
      return `Refunded Points - ${sourceLabel}`;
    } else if (transaction.type === 'ADJUSTED') {
      return `Adjusted Points - ${sourceLabel}`;
    }
    
    return sourceLabel;
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

  if (transactions.length === 0) {
    return (
      <Card>
        <CardContent className="p-8 text-center">
          <h3 className="text-lg font-medium text-gray-900 mb-2">No transactions yet</h3>
          <p className="text-gray-600">
            You don't have any point transactions yet. Complete missions to earn points!
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
              <TableHead>Transaction</TableHead>
              <TableHead>Date</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {transactions.map((transaction) => (
              <TableRow key={transaction.id}>
                <TableCell>
                  <div className="flex items-center">
                    <div className="mr-2">
                      {getTypeIcon(transaction.type, transaction.source)}
                    </div>
                    <div>
                      <div className="font-medium">
                        {getTransactionTitle(transaction)}
                      </div>
                      {transaction.description && (
                        <div className="text-sm text-gray-500">
                          {transaction.description}
                        </div>
                      )}
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {format(transaction.createdAt, 'MMM d, yyyy')}
                </TableCell>
                <TableCell className="text-right">
                  <Badge className={
                    transaction.type === 'EARNED' || transaction.type === 'REFUNDED' 
                      ? "bg-green-100 text-green-800 border-green-200" 
                      : "bg-red-100 text-red-800 border-red-200"
                  }>
                    {transaction.type === 'EARNED' || transaction.type === 'REFUNDED' ? '+' : '-'}
                    {Math.abs(transaction.amount)}
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
