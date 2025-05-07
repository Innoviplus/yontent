
import { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useParticipations, Participation } from '@/hooks/admin/participations/useParticipations';
import { ParticipationsLoading } from './ParticipationsLoading';
import { ParticipationActions } from './ParticipationActions';
import SubmissionReviewDialog from './SubmissionReviewDialog';

interface ParticipationsTableProps {
  filterStatus: string | null;
}

const ParticipationsTable = ({ filterStatus }: ParticipationsTableProps) => {
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | null>(null);
  const { participations, loading, handleUpdateStatus } = useParticipations(filterStatus);

  // Add more detailed logging
  console.log('ParticipationsTable render:', {
    filterStatus,
    loading,
    participationsCount: participations?.length || 0
  });

  if (loading) {
    return <ParticipationsLoading />;
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mission</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participations.length === 0 ? (
              <TableRow>
                <TableCell colSpan={5} className="text-center py-6 text-muted-foreground">
                  No participations found
                </TableCell>
              </TableRow>
            ) : (
              participations.map((participation) => (
                <TableRow key={participation.id}>
                  <TableCell>{participation.mission?.title || 'Unknown Mission'}</TableCell>
                  <TableCell>{participation.profile?.username || 'Unknown User'}</TableCell>
                  <TableCell>
                    <span className={`inline-block px-2 py-1 rounded text-xs ${
                      participation.status === 'APPROVED' ? 'bg-green-100 text-green-800' :
                      participation.status === 'REJECTED' ? 'bg-red-100 text-red-800' :
                      'bg-yellow-100 text-yellow-800'
                    }`}>
                      {participation.status}
                    </span>
                  </TableCell>
                  <TableCell>{new Date(participation.created_at).toLocaleDateString()}</TableCell>
                  <TableCell>
                    <ParticipationActions
                      participation={participation}
                      onStatusUpdate={handleUpdateStatus}
                      onReview={setSelectedParticipation}
                    />
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>

      <SubmissionReviewDialog
        isOpen={!!selectedParticipation}
        onClose={() => setSelectedParticipation(null)}
        participation={selectedParticipation || undefined}
      />
    </>
  );
};

export default ParticipationsTable;
