
import { Badge } from '@/components/ui/badge';
import { RedemptionRequest } from '@/lib/types';

interface RequestStatusBadgeProps {
  status: RedemptionRequest['status'];
}

const RequestStatusBadge = ({ status }: RequestStatusBadgeProps) => {
  switch(status) {
    case 'APPROVED':
      return <Badge className="bg-green-600">Approved</Badge>;
    case 'REJECTED':
      return <Badge variant="destructive">Rejected</Badge>;
    default:
      return <Badge variant="outline" className="bg-yellow-100 text-yellow-800 border-yellow-200">Pending</Badge>;
  }
};

export default RequestStatusBadge;
