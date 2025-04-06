
import { Json } from '@/lib/types';

export interface MissionParticipation {
  id: string;
  missionId: string;
  userId: string;
  status: ParticipationStatus;
  createdAt: string;
  updatedAt: string;
  submissionData?: SubmissionData;
  user: UserProfile;
  mission: Mission;
}

export type ParticipationStatus = 'PENDING' | 'APPROVED' | 'REJECTED';

export interface UserProfile {
  id: string;
  username: string;
  email?: string;
  avatar?: string | null;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  type: 'REVIEW' | 'RECEIPT';
}

export interface SubmissionData {
  reviewId?: string;
  reviewImages?: string[];
  receiptImage?: string;
  submission_type?: 'REVIEW' | 'RECEIPT';
  receipt_images?: string[];
  review_id?: string;
  review_images?: string[];
  review_url?: string;
  [key: string]: any;
}

export interface MissionParticipationFilters {
  status?: ParticipationStatus;
  missionId?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  participations?: T[];
  error?: string;
}
