
export type DeletionRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface DeletionRequest {
  id: string;
  user_id: string; // We keep this as user_id in our frontend types for consistency
  created_at: string;
  status: DeletionRequestStatus;
  reason: string | null;
  processed_by: string | null;
  profile: {
    username?: string;
    avatar?: string;
    email?: string;
  } | null;
}
