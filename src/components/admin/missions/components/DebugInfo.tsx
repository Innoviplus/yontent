
import React, { useState } from 'react';
import { Zap, ChevronDown, ChevronUp, AlertCircle } from 'lucide-react';
import { MissionParticipation } from '@/hooks/admin/api/types/participationTypes';
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table';
import { Button } from '@/components/ui/button';

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
  const [isExpanded, setIsExpanded] = useState(false);
  
  if (process.env.NODE_ENV !== 'development') return null;

  const pendingCount = participations.filter(p => p.status === 'PENDING').length;
  const approvedCount = participations.filter(p => p.status === 'APPROVED').length;
  const rejectedCount = participations.filter(p => p.status === 'REJECTED').length;

  // Group participations by user
  const userCounts: Record<string, number> = {};
  participations.forEach(p => {
    const userName = p.user?.username || 'Unknown';
    userCounts[userName] = (userCounts[userName] || 0) + 1;
  });
  
  // Count missing user data
  const missingUserCount = participations.filter(p => !p.user || !p.user.username).length;
  const missingMissionCount = participations.filter(p => !p.mission || !p.mission.title).length;

  return (
    <div className="mt-6 p-4 border border-gray-200 rounded-md bg-gray-50">
      <Button
        variant="ghost" 
        className="flex w-full items-center justify-between p-2 mb-2"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex items-center">
          <Zap className="h-4 w-4 mr-2 text-amber-500" />
          <h4 className="text-sm font-semibold">Debug Information</h4>
        </div>
        {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
      </Button>
      
      {isExpanded && (
        <>
          <div className="text-xs text-gray-600 space-y-1">
            <p>Total Participations: {participations.length}</p>
            <p>Filtered Participations: {filteredParticipations.length}</p>
            <p>Status Counts: Pending ({pendingCount}), Approved ({approvedCount}), Rejected ({rejectedCount})</p>
            <p>Active Filter: {activeFilter || 'None'}</p>
            <p>Is Loading: {isLoading ? 'Yes' : 'No'}</p>
            <p>Is Refreshing: {isRefreshing ? 'Yes' : 'No'}</p>
            <p>Error: {error || 'None'}</p>
            
            {missingUserCount > 0 && (
              <p className="text-red-600">
                <AlertCircle className="inline h-3 w-3 mr-1" />
                Warning: {missingUserCount} participation(s) have missing or incomplete user data
              </p>
            )}
            
            {missingMissionCount > 0 && (
              <p className="text-red-600">
                <AlertCircle className="inline h-3 w-3 mr-1" />
                Warning: {missingMissionCount} participation(s) have missing or incomplete mission data
              </p>
            )}
          </div>
          
          <div className="mt-3">
            <h5 className="text-xs font-medium mb-1">Participations by User:</h5>
            <Table className="w-full border-collapse">
              <TableHeader>
                <TableRow>
                  <TableHead className="py-1 px-2 text-xs">Username</TableHead>
                  <TableHead className="py-1 px-2 text-xs">Count</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {Object.entries(userCounts).map(([userName, count]) => (
                  <TableRow key={userName}>
                    <TableCell className="py-1 px-2 text-xs">{userName}</TableCell>
                    <TableCell className="py-1 px-2 text-xs">{count}</TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
          
          <div className="mt-3">
            <h5 className="text-xs font-medium mb-1">Raw Participation Data:</h5>
            <div className="overflow-x-auto text-xs max-h-60 overflow-y-auto">
              <Table className="w-full border-collapse">
                <TableHeader>
                  <TableRow>
                    <TableHead className="py-1 px-2 text-xs">ID</TableHead>
                    <TableHead className="py-1 px-2 text-xs">User</TableHead>
                    <TableHead className="py-1 px-2 text-xs">Status</TableHead>
                    <TableHead className="py-1 px-2 text-xs">Created</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {participations.map(p => (
                    <TableRow key={p.id}>
                      <TableCell className="py-1 px-2 text-xs">{p.id.substring(0, 8)}...</TableCell>
                      <TableCell className="py-1 px-2 text-xs">{p.user?.username || `User-${p.userId.substring(0, 6)}`}</TableCell>
                      <TableCell className="py-1 px-2 text-xs">{p.status}</TableCell>
                      <TableCell className="py-1 px-2 text-xs">
                        {p.createdAt instanceof Date 
                          ? p.createdAt.toLocaleDateString() 
                          : new Date(p.createdAt).toLocaleDateString()}
                      </TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            </div>
          </div>
        </>
      )}
    </div>
  );
};

export default DebugInfo;
