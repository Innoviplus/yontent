
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
import { MissionParticipation } from '@/hooks/admin/api/types/participationTypes';
import ParticipationsLoadingState from './ParticipationsLoadingState';
import ParticipationCard from './ParticipationCard';
import ParticipationDetailsDialog from './ParticipationDetailsDialog';
import EmptyParticipations from './EmptyParticipations';
import ParticipationFilters from './components/ParticipationFilters';
import ParticipationError from './components/ParticipationError';
import DebugInfo from './components/DebugInfo';

interface MissionsParticipationProps {
  participations: MissionParticipation[];
  isLoading: boolean;
  isRefreshing: boolean;
  onRefresh: () => Promise<void>;
  onApprove: (id: string) => Promise<boolean>;
  onReject: (id: string) => Promise<boolean>;
  error?: string;
}

const MissionsParticipation = ({
  participations,
  isLoading,
  isRefreshing,
  onRefresh,
  onApprove,
  onReject,
  error
}: MissionsParticipationProps) => {
  const [viewingParticipation, setViewingParticipation] = useState<MissionParticipation | null>(null);
  const [processingId, setProcessingId] = useState<string | null>(null);
  const [activeFilter, setActiveFilter] = useState<string | null>(null);

  const handleApprove = async (id: string): Promise<boolean> => {
    setProcessingId(id);
    const result = await onApprove(id);
    setProcessingId(null);
    return result;
  };

  const handleReject = async (id: string): Promise<boolean> => {
    setProcessingId(id);
    const result = await onReject(id);
    setProcessingId(null);
    return result;
  };

  const openReviewLink = (reviewId: string) => {
    if (reviewId) {
      window.open(`/review/${reviewId}`, '_blank');
    }
  };

  // Filter participations based on activeFilter
  const filteredParticipations = activeFilter 
    ? participations.filter(p => p.status === activeFilter)
    : participations;

  if (isLoading) {
    return <ParticipationsLoadingState />;
  }

  return (
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
        {error && <ParticipationError error={error} onRefresh={onRefresh} />}

        <ParticipationFilters
          participations={participations}
          activeFilter={activeFilter}
          setActiveFilter={setActiveFilter}
        />

        {filteredParticipations.length === 0 ? (
          <EmptyParticipations onRefreshClick={onRefresh} error={error} />
        ) : (
          <div className="space-y-4">
            {filteredParticipations.map(participation => (
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
        
        <DebugInfo
          participations={participations}
          filteredParticipations={filteredParticipations}
          activeFilter={activeFilter}
          isLoading={isLoading}
          isRefreshing={isRefreshing}
          error={error}
        />
      </CardContent>

      <ParticipationDetailsDialog
        participation={viewingParticipation}
        processingId={processingId}
        onClose={() => setViewingParticipation(null)}
        onApprove={handleApprove}
        onReject={handleReject}
        openReviewLink={openReviewLink}
      />
    </Card>
  );
};

export default MissionsParticipation;
