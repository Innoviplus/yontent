
export type DeletionRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface DeletionRequest {
  id: string;
  user_id: string; // We keep this as user_id in our frontend types for consistency
  created_at: string;
  status: DeletionRequestStatus;
  reason: string | null;
  username: string;
  email: string;
  phone: string;
}
