
import { Json } from '@/lib/types';

export interface MissionParticipation {
  id: string;
  missionId: string;
  userId: string;
  status: string;
  submissionData: any;
  createdAt: Date;
  updatedAt: Date;
  userName?: string;
  userAvatar?: string;
  missionTitle?: string;
  missionDescription?: string;
  missionPointsReward?: number;
  missionType?: string;
}

export interface MissionParticipationFilters {
  status?: string;
  missionId?: string;
  userId?: string;
  page?: number;
  pageSize?: number;
}

export interface ApiResponse<T> {
  success: boolean;
  error?: string;
  participations?: T[];
}

export interface PaginatedResponse<T> {
  data: T[];
  total: number;
}

export interface ParticipationStatusResponse {
  success: boolean;
  error?: string;
}

// Helper function to safely extract avatar URL from extended_data
export const extractAvatarUrl = (extendedData: Json | null): string | undefined => {
  if (!extendedData) return undefined;
  
  try {
    // Handle string case (needs parsing)
    if (typeof extendedData === 'string') {
      try {
        const parsed = JSON.parse(extendedData);
        return parsed?.avatarUrl;
      } catch (e) {
        return undefined;
      }
    }
    
    // Handle object case
    if (typeof extendedData === 'object' && extendedData !== null) {
      // Make sure it's not an array
      if (!Array.isArray(extendedData) && 'avatarUrl' in extendedData) {
        return extendedData.avatarUrl as string | undefined;
      }
    }
    
    return undefined;
  } catch (e) {
    console.error('Error extracting avatar URL:', e);
    return undefined;
  }
};
