
export type DeletionRequestStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export type DeletionRequest = {
  id: string;
  user_id: string;
  created_at: string;
  status: DeletionRequestStatus;
  reason: string | null;
  username: string | null;
  email: string | null;
};
