
import { useState } from 'react';
import { 
  Card, 
  CardContent, 
  CardDescription, 
  CardHeader, 
  CardTitle 
} from '@/components/ui/card';
import { RedemptionRequest } from '@/lib/types';
import RequestActionDialog from './RequestActionDialog';
import RequestsLoadingState from './RequestsLoadingState';
import EmptyRequestsState from './EmptyRequestsState';
import RequestsTable from './RequestsTable';
import { Button } from '@/components/ui/button';
import { RefreshCw } from 'lucide-react';

interface RequestsManagementProps {
  requests: RedemptionRequest[];
  isLoading: boolean;
  onApprove: (id: string, adminNotes?: string) => Promise<boolean>;
  onReject: (id: string, adminNotes?: string) => Promise<boolean>;
  refreshRequests?: () => Promise<void>;
}

const RequestsManagement = ({ 
  requests, 
  isLoading, 
  onApprove, 
  onReject,
  refreshRequests
}: RequestsManagementProps) => {
  const [actioningRequest, setActioningRequest] = useState<RedemptionRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [viewingRequest, setViewingRequest] = useState<RedemptionRequest | null>(null);
  const [isRefreshing, setIsRefreshing] = useState(false);

  const handleAction = async (notes?: string) => {
    if (!actioningRequest?.id || !actionType) return false;
    
    let success = false;
    try {
      if (actionType === 'approve') {
        success = await onApprove(actioningRequest.id, notes);
      } else {
        success = await onReject(actioningRequest.id, notes);
      }
      
      if (success) {
        // Don't close the dialog yet, we'll do that in the component
        
        // Refresh the requests list after successful action
        if (refreshRequests) {
          await refreshRequests();
        }
      }
      
      return success;
    } catch (error) {
      console.error(`Error during ${actionType} action:`, error);
      return false;
    }
  };

  const handleRowClick = (request: RedemptionRequest) => {
    setViewingRequest(request);
  };

  const handleSaveNotes = async (notes: string) => {
    if (viewingRequest) {
      // We'll use the approve action with the same status to just update notes
      const success = await onApprove(viewingRequest.id, notes);
      if (success && refreshRequests) {
        await refreshRequests();
      }
      return success;
    } else if (actioningRequest) {
      // Update UI optimistically, but don't change status
      const success = await onApprove(actioningRequest.id, notes);
      if (success && refreshRequests) {
        await refreshRequests();
      }
      return success;
    }
    return false;
  };

  const handleRefresh = async () => {
    if (refreshRequests) {
      setIsRefreshing(true);
      try {
        await refreshRequests();
      } finally {
        setIsRefreshing(false);
      }
    }
  };

  if (isLoading) {
    return <RequestsLoadingState />;
  }

  return (
    <>
      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Redemption Requests</CardTitle>
            <CardDescription>Review and manage user redemption requests</CardDescription>
          </div>
          <Button 
            variant="outline" 
            size="sm" 
            onClick={handleRefresh} 
            disabled={isRefreshing}
          >
            <RefreshCw className={`h-4 w-4 mr-2 ${isRefreshing ? 'animate-spin' : ''}`} />
            Refresh
          </Button>
        </CardHeader>
        
        {requests.length === 0 ? (
          <EmptyRequestsState />
        ) : (
          <CardContent>
            <RequestsTable 
              requests={requests}
              onRowClick={handleRowClick}
              onApprove={(request) => {
                setActioningRequest(request);
                setActionType('approve');
              }}
              onReject={(request) => {
                setActioningRequest(request);
                setActionType('reject');
              }}
            />
          </CardContent>
        )}
      </Card>

      {actioningRequest && actionType && (
        <RequestActionDialog
          request={actioningRequest}
          action={actionType}
          onAction={handleAction}
          onSaveNotes={handleSaveNotes}
          onCancel={() => {
            setActioningRequest(null);
            setActionType(null);
          }}
        />
      )}

      {viewingRequest && (
        <RequestActionDialog
          request={viewingRequest}
          action={viewingRequest.status === 'PENDING' ? 'approve' : 'approve'}
          onAction={async () => {
            setViewingRequest(null);
            return true;
          }}
          onSaveNotes={handleSaveNotes}
          onCancel={() => {
            setViewingRequest(null);
          }}
        />
      )}
    </>
  );
};

export default RequestsManagement;
