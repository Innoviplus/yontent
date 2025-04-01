
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
import { useAuth } from '@/contexts/AuthContext';
import { useEffect, useState } from 'react';
import { supabase } from '@/integrations/supabase/client';

const TransactionsTab = () => {
  const { requests, isLoading } = useUserRedemptionRequests();
  const { user } = useAuth();
  const [welcomePoints, setWelcomePoints] = useState<any | null>(null);

  useEffect(() => {
    const fetchWelcomeTransaction = async () => {
      if (!user) return;
      
      const { data, error } = await supabase
        .from('point_transactions')
        .select('*')
        .eq('user_id', user.id)
        .eq('type', 'WELCOME')
        .order('created_at', { ascending: false })
        .limit(1)
        .single();
        
      if (!error && data) {
        setWelcomePoints(data);
      }
    };
    
    fetchWelcomeTransaction();
  }, [user]);

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

  const hasNoTransactions = requests.length === 0 && !welcomePoints;

  if (hasNoTransactions) {
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
              <TableHead>Transaction</TableHead>
              <TableHead>Date</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Points</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {/* Welcome points transaction */}
            {welcomePoints && (
              <TableRow>
                <TableCell>
                  <div className="flex items-center">
                    <div className="mr-2">
                      <Award className="h-4 w-4 text-green-500" />
                    </div>
                    <div>
                      <div className="font-medium">
                        Welcome Reward
                      </div>
                      <div className="text-sm text-gray-500">
                        {welcomePoints.description}
                      </div>
                    </div>
                  </div>
                </TableCell>
                <TableCell className="text-gray-500 text-sm">
                  {format(new Date(welcomePoints.created_at), 'MMM d, yyyy')}
                </TableCell>
                <TableCell>
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    CREDITED
                  </Badge>
                </TableCell>
                <TableCell className="text-right">
                  <Badge className="bg-green-100 text-green-800 border-green-200">
                    +{welcomePoints.amount}
                  </Badge>
                </TableCell>
              </TableRow>
            )}
            
            {/* Redemption transactions */}
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
                  {request.status === 'REJECTED' ? (
                    <div className="flex flex-col items-end">
                      <Badge className="bg-red-100 text-red-800 border-red-200 line-through">
                        -{request.pointsAmount}
                      </Badge>
                      <span className="text-xs text-green-600 font-medium mt-1">
                        Points returned
                      </span>
                    </div>
                  ) : (
                    <Badge className="bg-red-100 text-red-800 border-red-200">
                      -{request.pointsAmount}
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
