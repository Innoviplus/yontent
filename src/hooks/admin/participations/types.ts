
import { Json } from '@/integrations/supabase/types';

// Define types for submission data to help with type checking
export interface ReviewSubmissionData {
  submission_type: 'REVIEW';
  review_id: string;
  content?: string;
  review_images?: string[];
  review_video?: string;
}

export interface ReceiptSubmissionData {
  submission_type: 'RECEIPT';
  receipt_images: string[];
}

export interface SocialProofSubmissionData {
  submission_type?: 'SOCIAL_PROOF';
  type: 'SOCIAL_PROOF';
  proofUrl?: string;
  additionalRemarks?: string;
  proofImages: string[];
  submittedAt: string;
}

export type SubmissionData = ReviewSubmissionData | ReceiptSubmissionData | SocialProofSubmissionData | Record<string, any>;

export interface Participation {
  id: string;
  mission_id: string;
  user_id_p: string;
  status: string;
  submission_data?: Json;
  created_at: string;
  updated_at: string;
  mission?: {
    id: string;
    title: string;
    points_reward: number;
    type: 'REVIEW' | 'RECEIPT' | 'SOCIAL_PROOF';
  };
  profile?: {
    id: string;
    username: string;
    avatar?: string;
  };
}

// Define interface for handle_mission_approval function response
export interface MissionApprovalResponse {
  success: boolean;
  user_id: string;
  points_awarded: number;
  new_points_total: number;
  transaction_id: string;
}
