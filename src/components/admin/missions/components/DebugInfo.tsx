
import React from 'react';
import { Zap } from 'lucide-react';
import { MissionParticipation } from '@/hooks/admin/api/types/participationTypes';

interface DebugInfoProps {
  participations: MissionParticipation[];
  filteredParticipations: MissionParticipation[];
  activeFilter: string | null;
  isLoading: boolean;
  isRefreshing: boolean;
  error?: string;
}

const DebugInfo: React.FC<DebugInfoProps> = ({
  participations,
  filteredParticipations,
  activeFilter,
  isLoading,
  isRefreshing,
  error
}) => {
  if (process.env.NODE_ENV !== 'development') return null;

  const pendingCount = participations.filter(p => p.status === 'PENDING').length;
  const approvedCount = participations.filter(p => p.status === 'APPROVED').length;
  const rejectedCount = participations.filter(p => p.status === 'REJECTED').length;

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
      <div className="flex items-center mb-2">
        <Zap className="h-4 w-4 mr-2 text-amber-500" />
        <h4 className="text-sm font-semibold">Debug Information</h4>
      </div>
      <div className="text-xs text-gray-600 space-y-1">
        <p>Total Participations: {participations.length}</p>
        <p>Filtered Participations: {filteredParticipations.length}</p>
        <p>Status Counts: Pending ({pendingCount}), Approved ({approvedCount}), Rejected ({rejectedCount})</p>
        <p>Active Filter: {activeFilter || 'None'}</p>
        <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
        <p>Is Refreshing: {isRefreshing ? 'Yes' : 'No'}</p>
        <p>Error: {error || 'None'}</p>
      </div>
    </div>
  );
};

export default DebugInfo;
