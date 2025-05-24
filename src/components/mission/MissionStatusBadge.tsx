
import { Badge } from '@/components/ui/badge';

interface MissionStatusBadgeProps {
  participating: boolean;
  participationStatus: string | null;
}

const MissionStatusBadge = ({ participating, participationStatus }: MissionStatusBadgeProps) => {
  if (!participating) return null;
  
  const statusConfig = {
    'JOINED': {
      label: 'Joined',
      variant: 'secondary' as const
    },
    'PENDING': {
      label: 'Pending Review',
      variant: 'default' as const
    },
    'APPROVED': {
      label: 'Approved',
      variant: 'default' as const
    },
    'REJECTED': {
      label: 'Rejected',
      variant: 'destructive' as const
    }
  };
  
  const config = statusConfig[participationStatus as keyof typeof statusConfig];
  if (!config) return null;
  
  return <Badge variant={config.variant}>{config.label}</Badge>;
};

export default MissionStatusBadge;
