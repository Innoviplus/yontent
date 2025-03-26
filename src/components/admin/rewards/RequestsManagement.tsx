
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { RedemptionRequest } from '@/lib/types';
import RequestsLoadingState from './RequestsLoadingState';
import EmptyRequestsState from './EmptyRequestsState';
import { Button } from '@/components/ui/button';
import { CheckCircle, RefreshCw, XCircle } from 'lucide-react';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import RequestStatusBadge from './RequestStatusBadge';
import { useState } from 'react';
import GenerateDemoRequests from './GenerateDemoRequests';

interface RequestsManagementProps {
  requests: RedemptionRequest[];
  isLoading: boolean;
  refreshRequests?: () => Promise<void>;
  approveRequest?: (requestId: string) => Promise<void>;
  rejectRequest?: (requestId: string) => Promise<void>;
  isApproving?: string | null;
  isRejecting?: string | null;
}

const RequestsManagement = ({ 
  requests, 
  isLoading, 
  refreshRequests,
  approveRequest,
  rejectRequest,
  isApproving,
  isRejecting
}: RequestsManagementProps) => {
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleRefresh = async () => {
    if (refreshRequests) {
      setIsRefreshing(true);
      try {
        await refreshRequests();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  if (isLoading) {
    return <RequestsLoadingState />;
  }

  return (
    <Card>
      <CardHeader className="flex flex-row items-center justify-between">
        <div>
          <CardTitle>Redemption Requests</CardTitle>
          <CardDescription>View user redemption requests</CardDescription>
        </div>
        <div className="flex items-center">
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
          {refreshRequests && (
            <GenerateDemoRequests onSuccess={refreshRequests} />
          )}
        </div>
      </CardHeader>
      
      {requests.length === 0 ? (
        <EmptyRequestsState />
      ) : (
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">User</TableHead>
                <TableHead>Type</TableHead>
                <TableHead className="w-[100px]">Points</TableHead>
                <TableHead className="w-[120px]">Status</TableHead>
                <TableHead className="w-[120px]">Date</TableHead>
                <TableHead className="w-[180px]">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {requests.map((request) => (
                <TableRow 
                  key={request.id}
                  className="hover:bg-slate-50"
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <Avatar className="h-8 w-8">
                        <AvatarImage src={request.user?.avatar} />
                        <AvatarFallback>
                          <User className="h-4 w-4" />
                        </AvatarFallback>
                      </Avatar>
                      <span className="font-medium">{request.user?.username || request.userId.slice(0, 8)}</span>
                    </div>
                  </TableCell>
                  <TableCell>{request.redemptionType === 'CASH' ? 'Cash Transfer' : 'Gift Voucher'}</TableCell>
                  <TableCell>{request.pointsAmount}</TableCell>
                  <TableCell><RequestStatusBadge status={request.status} /></TableCell>
                  <TableCell>{formatDistanceToNow(request.createdAt, { addSuffix: true })}</TableCell>
                  <TableCell>
                    {request.status === 'PENDING' && (
                      <div className="flex items-center gap-2">
                        {approveRequest && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => approveRequest(request.id)}
                            disabled={isApproving === request.id || isRejecting === request.id}
                            className="text-green-600 border-green-600 hover:bg-green-50"
                          >
                            {isApproving === request.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <CheckCircle className="h-4 w-4 mr-2" />
                                Approve
                              </>
                            )}
                          </Button>
                        )}
                        
                        {rejectRequest && (
                          <Button 
                            variant="outline" 
                            size="sm"
                            onClick={() => rejectRequest(request.id)}
                            disabled={isRejecting === request.id || isApproving === request.id}
                            className="text-red-600 border-red-600 hover:bg-red-50"
                          >
                            {isRejecting === request.id ? (
                              <>
                                <RefreshCw className="h-4 w-4 mr-2 animate-spin" />
                                Processing...
                              </>
                            ) : (
                              <>
                                <XCircle className="h-4 w-4 mr-2" />
                                Reject
                              </>
                            )}
                          </Button>
                        )}
                      </div>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      )}
    </Card>
  );
};

export default RequestsManagement;
