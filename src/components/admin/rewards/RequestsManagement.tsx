
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { ClipboardList, Check, X, User } from 'lucide-react';
import { RedemptionRequest } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { formatDistanceToNow } from 'date-fns';
import RequestActionDialog from './RequestActionDialog';

interface RequestsManagementProps {
  requests: RedemptionRequest[];
  isLoading: boolean;
  onApprove: (id: string, adminNotes?: string) => Promise<boolean>;
  onReject: (id: string, adminNotes?: string) => Promise<boolean>;
}

const RequestsManagement = ({ 
  requests, 
  isLoading, 
  onApprove, 
  onReject 
}: RequestsManagementProps) => {
  const [actioningRequest, setActioningRequest] = useState<RedemptionRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);

  const handleAction = async (notes?: string) => {
    if (!actioningRequest?.id || !actionType) return false;
    
    let success = false;
    if (actionType === 'approve') {
      success = await onApprove(actioningRequest.id, notes);
    } else {
      success = await onReject(actioningRequest.id, notes);
    }
    
    if (success) {
      setActioningRequest(null);
      setActionType(null);
    }
    
    return success;
  };

  const getStatusBadge = (status: RedemptionRequest['status']) => {
    switch(status) {
      case 'APPROVED':
        return <Badge className="bg-green-600">Approved</Badge>;
      case 'REJECTED':
        return <Badge variant="destructive">Rejected</Badge>;
      default:
        return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
    }
  };

  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Redemption Requests</CardTitle>
          <CardDescription>Loading requests...</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="h-64 flex items-center justify-center">
            <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-blue-500"></div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Redemption Requests</CardTitle>
          <CardDescription>Review and manage user redemption requests</CardDescription>
        </CardHeader>
        <CardContent>
          {requests.length === 0 ? (
            <div className="text-center py-8">
              <ClipboardList className="mx-auto h-12 w-12 text-gray-400 mb-3" />
              <h3 className="text-lg font-medium">No redemption requests</h3>
              <p className="text-sm text-gray-500 mt-1">Requests will appear here when users redeem their points</p>
            </div>
          ) : (
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-[180px]">User</TableHead>
                  <TableHead>Type</TableHead>
                  <TableHead className="w-[100px]">Points</TableHead>
                  <TableHead className="w-[120px]">Status</TableHead>
                  <TableHead className="w-[120px]">Date</TableHead>
                  <TableHead className="w-[160px] text-right">Actions</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {requests.map((request) => (
                  <TableRow key={request.id}>
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
                    <TableCell>{getStatusBadge(request.status)}</TableCell>
                    <TableCell>{formatDistanceToNow(request.createdAt, { addSuffix: true })}</TableCell>
                    <TableCell className="text-right">
                      {request.status === 'PENDING' ? (
                        <div className="flex justify-end gap-2">
                          <Button 
                            variant="outline" 
                            size="sm" 
                            className="text-green-600 border-green-200 hover:bg-green-50"
                            onClick={() => {
                              setActioningRequest(request);
                              setActionType('approve');
                            }}
                          >
                            <Check className="h-4 w-4 mr-1" />
                            Approve
                          </Button>
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="text-red-600 border-red-200 hover:bg-red-50"
                            onClick={() => {
                              setActioningRequest(request);
                              setActionType('reject');
                            }}
                          >
                            <X className="h-4 w-4 mr-1" />
                            Reject
                          </Button>
                        </div>
                      ) : (
                        <span className="text-sm text-gray-500">
                          {request.updatedAt && formatDistanceToNow(request.updatedAt, { addSuffix: true })}
                        </span>
                      )}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          )}
        </CardContent>
      </Card>

      {actioningRequest && actionType && (
        <RequestActionDialog
          request={actioningRequest}
          action={actionType}
          onAction={handleAction}
          onCancel={() => {
            setActioningRequest(null);
            setActionType(null);
          }}
        />
      )}
    </>
  );
};

export default RequestsManagement;
