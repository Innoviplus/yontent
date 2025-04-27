
import React from 'react';
import { Button } from '@/components/ui/button';
import { MissionParticipation } from '@/hooks/admin/api/types/participationTypes';

interface ParticipationFiltersProps {
  participations: MissionParticipation[];
  activeFilter: string | null;
  setActiveFilter: (filter: string | null) => void;
}

const ParticipationFilters: React.FC<ParticipationFiltersProps> = ({
  participations,
  activeFilter,
  setActiveFilter,
}) => {
  const pendingCount = participations.filter(p => p.status === 'PENDING').length;
  const approvedCount = participations.filter(p => p.status === 'APPROVED').length;
  const rejectedCount = participations.filter(p => p.status === 'REJECTED').length;

  return (
    <div className="flex gap-2 mb-4">
      <Button
        variant={activeFilter === null ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveFilter(null)}
      >
        All ({participations.length})
      </Button>
      <Button
        variant={activeFilter === 'PENDING' ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveFilter('PENDING')}
        className={pendingCount > 0 ? "bg-yellow-500 hover:bg-yellow-600 text-white" : ""}
      >
        Pending ({pendingCount})
      </Button>
      <Button
        variant={activeFilter === 'APPROVED' ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveFilter('APPROVED')}
      >
        Approved ({approvedCount})
      </Button>
      <Button
        variant={activeFilter === 'REJECTED' ? "default" : "outline"}
        size="sm"
        onClick={() => setActiveFilter('REJECTED')}
      >
        Rejected ({rejectedCount})
      </Button>
    </div>
  );
};

export default ParticipationFilters;
