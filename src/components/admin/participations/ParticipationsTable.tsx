
import { useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { useParticipations, Participation } from '@/hooks/admin/useParticipations';
import { ParticipationsLoading } from './ParticipationsLoading';
import { ParticipationActions } from './ParticipationActions';
import SubmissionReviewDialog from './SubmissionReviewDialog';

interface ParticipationsTableProps {
  filterStatus: string | null;
}

const ParticipationsTable = ({ filterStatus }: ParticipationsTableProps) => {
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | null>(null);
  const { participations, loading, handleUpdateStatus, fetchParticipations } = useParticipations(filterStatus);

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
            {participations.map((participation) => (
              <TableRow key={participation.id}>
                <TableCell>{participation.mission?.title}</TableCell>
                <TableCell>{participation.profile?.username}</TableCell>
                <TableCell>{participation.status}</TableCell>
                <TableCell>{new Date(participation.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <ParticipationActions
                    participation={participation}
                    onStatusUpdate={handleUpdateStatus}
                    onReview={setSelectedParticipation}
                  />
                </TableCell>
              </TableRow>
            ))}
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
