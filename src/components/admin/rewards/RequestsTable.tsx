
import { 
  Table, 
  TableBody, 
  TableCell, 
  TableHead, 
  TableHeader, 
  TableRow 
} from '@/components/ui/table';
import { RedemptionRequest } from '@/lib/types';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { User } from 'lucide-react';
import { formatDistanceToNow } from 'date-fns';
import RequestStatusBadge from './RequestStatusBadge';
import RequestRowActions from './RequestRowActions';

interface RequestsTableProps {
  requests: RedemptionRequest[];
  onRowClick: (request: RedemptionRequest) => void;
  onApprove: (request: RedemptionRequest) => void;
  onReject: (request: RedemptionRequest) => void;
}

const RequestsTable = ({ 
  requests, 
  onRowClick, 
  onApprove, 
  onReject 
}: RequestsTableProps) => {
  return (
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
          <TableRow 
            key={request.id}
            className="cursor-pointer hover:bg-slate-50"
            onClick={() => onRowClick(request)}
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
            <TableCell className="text-right" onClick={(e) => e.stopPropagation()}>
              <RequestRowActions 
                request={request}
                onApprove={onApprove}
                onReject={onReject}
              />
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );
};

export default RequestsTable;
