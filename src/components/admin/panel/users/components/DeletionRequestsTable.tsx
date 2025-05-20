
import { Button } from '@/components/ui/button';
import { Loader2, ShieldBan, X } from 'lucide-react';
import { DeletionRequest } from '../types/DeletionRequestTypes';
import { StatusBadge } from './StatusBadge';
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from '@/components/ui/table';

interface DeletionRequestsTableProps {
  requests: DeletionRequest[];
  processing: string | null;
  onApprove: (requestId: string, userId: string) => Promise<void>;
  onReject: (requestId: string) => Promise<void>;
}

export const DeletionRequestsTable = ({
  requests,
  processing,
  onApprove,
  onReject
}: DeletionRequestsTableProps) => {
  return (
    <div className="bg-white rounded-lg border border-gray-200 overflow-hidden">
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead className="w-[200px]">User</TableHead>
            <TableHead>Request Date</TableHead>
            <TableHead>Contact Info</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Reason</TableHead>
            <TableHead className="text-right">Actions</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {requests.map((request) => (
            <TableRow key={request.id}>
              <TableCell>
                <div className="text-sm font-medium text-gray-900">{request.username || 'Unknown user'}</div>
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-500">
                  {new Date(request.created_at).toLocaleDateString()}
                  <span className="block text-xs">
                    {new Date(request.created_at).toLocaleTimeString()}
                  </span>
                </div>
              </TableCell>
              <TableCell>
                <div className="text-xs text-gray-500">
                  <div>{request.email || 'No email'}</div>
                  <div>{request.phone || 'No phone'}</div>
                </div>
              </TableCell>
              <TableCell>
                <StatusBadge status={request.status} />
              </TableCell>
              <TableCell>
                <div className="text-sm text-gray-900 max-w-xs truncate">
                  {request.reason}
                </div>
              </TableCell>
              <TableCell className="text-right">
                {request.status === 'PENDING' && (
                  <div className="flex justify-end gap-2">
                    <Button
                      variant="destructive"
                      size="sm"
                      onClick={() => onApprove(request.id, request.user_id)}
                      disabled={!!processing}
                    >
                      {processing === request.id ? 
                        <Loader2 className="h-4 w-4 animate-spin mr-1" /> : 
                        <ShieldBan className="h-4 w-4 mr-1" />
                      }
                      Disable Account
                    </Button>
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => onReject(request.id)}
                      disabled={!!processing}
                    >
                      <X className="h-4 w-4 mr-1" />
                      Reject
                    </Button>
                  </div>
                )}
                {request.status !== 'PENDING' && (
                  <span className="text-gray-500">
                    {request.status === 'APPROVED' ? 'Account disabled' : 'Request rejected'}
                  </span>
                )}
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};
