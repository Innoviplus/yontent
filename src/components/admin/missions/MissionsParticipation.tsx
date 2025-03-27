
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw } from 'lucide-react';
import { MissionParticipation } from '@/hooks/admin/useMissionParticipations';
import ParticipationsLoadingState from './ParticipationsLoadingState';
import ParticipationCard from './ParticipationCard';
import ParticipationDetailsDialog from './ParticipationDetailsDialog';
import EmptyParticipations from './EmptyParticipations';

interface MissionsParticipationProps {
  participations: MissionParticipation[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
}

const MissionsParticipation = ({
  participations,
  isLoading,
  isRefreshing,
  onRefresh,
  onApprove,
  onReject
}: MissionsParticipationProps) => {
  const [viewingParticipation, setViewingParticipation] = useState<MissionParticipation | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);

  const handleApprove = async (id: string) => {
    setProcessingId(id);
    await onApprove(id);
    setProcessingId(null);
  };

  const handleReject = async (id: string) => {
    setProcessingId(id);
    await onReject(id);
    setProcessingId(null);
  };

  const openReviewLink = (reviewId: string) => {
    if (reviewId) {
      window.open(`/review/${reviewId}`, '_blank');
    }
  };

  if (isLoading) {
    return <ParticipationsLoadingState />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Missions Participation</CardTitle>
            <CardDescription>Review and manage mission submissions from users</CardDescription>
          </div>
          <Button 
            onClick={onRefresh} 
            variant="outline" 
            disabled={isRefreshing}
          >
            {isRefreshing ? (
              <Loader2 className="h-4 w-4 mr-2 animate-spin" />
            ) : (
              <RefreshCw className="h-4 w-4 mr-2" />
            )}
            Refresh
          </Button>
        </CardHeader>
        <CardContent>
          {participations.length === 0 ? (
            <EmptyParticipations />
          ) : (
            <div className="space-y-4">
              {participations.map(participation => (
                <ParticipationCard
                  key={participation.id}
                  participation={participation}
                  processingId={processingId}
                  onViewDetails={setViewingParticipation}
                  onApprove={handleApprove}
                  onReject={handleReject}
                  openReviewLink={openReviewLink}
                />
              ))}
            </div>
          )}
        </CardContent>
      </Card>

      <ParticipationDetailsDialog
        participation={viewingParticipation}
        processingId={processingId}
        onClose={() => setViewingParticipation(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        openReviewLink={openReviewLink}
      />
    </>
  );
};

export default MissionsParticipation;
