
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

interface RequestsManagementProps {
  requests: RedemptionRequest[];
  isLoading: boolean;
  onApprove: (id: string, adminNotes?: string) => Promise<boolean>;
  onReject: (id: string, adminNotes?: string) => Promise<boolean>;
}

const RequestsManagement = ({ 
  requests, 
  isLoading, 
  onApprove, 
  onReject 
}: RequestsManagementProps) => {
  const [actioningRequest, setActioningRequest] = useState<RedemptionRequest | null>(null);
  const [actionType, setActionType] = useState<'approve' | 'reject' | null>(null);
  const [viewingRequest, setViewingRequest] = useState<RedemptionRequest | null>(null);

  const handleAction = async (notes?: string) => {
    if (!actioningRequest?.id || !actionType) return false;
    
    let success = false;
    if (actionType === 'approve') {
      success = await onApprove(actioningRequest.id, notes);
    } else {
      success = await onReject(actioningRequest.id, notes);
    }
    
    if (success) {
      setActioningRequest(null);
      setActionType(null);
    }
    
    return success;
  };

  const handleRowClick = (request: RedemptionRequest) => {
    setViewingRequest(request);
  };

  const handleSaveNotes = async (notes: string) => {
    if (viewingRequest) {
      // We'll use the approve action with the same status to just update notes
      const success = await onApprove(viewingRequest.id, notes);
      if (success) {
        setViewingRequest(null);
      }
      return success;
    } else if (actioningRequest) {
      // Update UI optimistically, but don't change status
      const success = await onApprove(actioningRequest.id, notes);
      if (success) {
        setActioningRequest(null);
        setActionType(null);
      }
      return success;
    }
    return false;
  };

  if (isLoading) {
    return <RequestsLoadingState />;
  }

  return (
    <>
      <Card>
        <CardHeader>
          <CardTitle>Redemption Requests</CardTitle>
          <CardDescription>Review and manage user redemption requests</CardDescription>
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
