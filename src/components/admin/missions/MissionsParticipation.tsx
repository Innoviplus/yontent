
import { useState, useEffect } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Loader2, RefreshCw, Zap } from 'lucide-react';
import { MissionParticipation } from '@/hooks/admin/api/types/participationTypes';
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
  
  useEffect(() => {
    console.log('MissionsParticipation rendered with:', {
      participationsCount: participations.length,
      participations: participations,
      isLoading,
      isRefreshing,
      error
    });
  }, [participations, isLoading, isRefreshing, error]);

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

  const pendingCount = participations.filter(p => p.status === 'PENDING').length;
  const approvedCount = participations.filter(p => p.status === 'APPROVED').length;
  const rejectedCount = participations.filter(p => p.status === 'REJECTED').length;

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
          {error && (
            <div className="bg-red-50 border border-red-200 rounded-md p-4 mb-4">
              <p className="text-red-700 text-sm">{error}</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-2"
                onClick={onRefresh}>
                  Retry
              </Button>
            </div>
          )}

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
          
          {/* Debug information (only visible in development) */}
          {process.env.NODE_ENV === 'development' && (
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
