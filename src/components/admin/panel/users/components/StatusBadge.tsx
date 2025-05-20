
import { Badge } from '@/components/ui/badge';
import { DeletionRequestStatus } from '../types/DeletionRequestTypes';

interface StatusBadgeProps {
  status: DeletionRequestStatus;
}

export const StatusBadge = ({ status }: StatusBadgeProps) => {
  const getStatusColor = (status: DeletionRequestStatus) => {
    switch (status) {
      case 'PENDING': return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      case 'APPROVED': return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED': return 'bg-red-100 text-red-800 border-red-200';
      default: return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge variant="outline" className={`${getStatusColor(status)} px-2 py-1`}>
      {status}
    </Badge>
  );
};
