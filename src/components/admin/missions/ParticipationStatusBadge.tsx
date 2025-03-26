
import React from 'react';
import { Badge } from '@/components/ui/badge';

interface ParticipationStatusBadgeProps {
  status: string;
}

const ParticipationStatusBadge: React.FC<ParticipationStatusBadgeProps> = ({ status }) => {
  const getStatusColor = () => {
    switch (status.toUpperCase()) {
      case 'APPROVED':
        return 'bg-green-100 text-green-800 border-green-200';
      case 'REJECTED':
        return 'bg-red-100 text-red-800 border-red-200';
      case 'PENDING':
        return 'bg-yellow-100 text-yellow-800 border-yellow-200';
      default:
        return 'bg-gray-100 text-gray-800 border-gray-200';
    }
  };

  return (
    <Badge className={`${getStatusColor()} font-medium`} variant="outline">
      {status.toUpperCase()}
    </Badge>
  );
};

export default ParticipationStatusBadge;
