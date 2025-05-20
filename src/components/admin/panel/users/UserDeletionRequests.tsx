
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';
import { useDeletionRequests } from './hooks/useDeletionRequests';
import { DeletionRequestsTable } from './components/DeletionRequestsTable';
import { EmptyRequestsState } from './components/EmptyRequestsState';
import { LoadingState } from './components/LoadingState';

export function UserDeletionRequests() {
  const { 
    requests, 
    loading, 
    processing, 
    fetchDeletionRequests, 
    approveRequest, 
    rejectRequest 
  } = useDeletionRequests();
  
  return (
    <div className="space-y-4">
      <div className="flex justify-between items-center">
        <h3 className="text-lg font-medium">Account Deletion Requests</h3>
        <Button 
          variant="outline" 
          size="sm"
          onClick={fetchDeletionRequests}
          disabled={loading}
        >
          <RefreshCw className="h-4 w-4 mr-2" />
          Refresh
        </Button>
      </div>
      
      {loading ? (
        <LoadingState />
      ) : requests.length === 0 ? (
        <EmptyRequestsState />
      ) : (
        <DeletionRequestsTable 
          requests={requests}
          processing={processing}
          onApprove={approveRequest}
          onReject={rejectRequest}
        />
      )}
    </div>
  );
}
