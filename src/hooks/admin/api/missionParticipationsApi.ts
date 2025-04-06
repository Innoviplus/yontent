
// Re-export all types and functions from the other files
export type {
  MissionParticipation,
  MissionParticipationFilters,
  ApiResponse,
  PaginatedResponse,
  ParticipationStatusResponse
} from './types/participationTypes';

export { extractAvatarUrl } from './types/participationTypes';
export { transformParticipationData } from './utils/transformationUtils';
export {
  fetchMissionParticipations,
  fetchMissionParticipationsWithFilters
} from './participationQueries';
export {
  approveParticipation,
  rejectParticipation,
  updateMissionParticipationStatus
} from './participationStatusActions';

/**
 * Utility hook for better organization
 */
export const useMissionParticipationsApi = () => {
  return {
    fetchMissionParticipations,
    fetchMissionParticipationsWithFilters,
    updateMissionParticipationStatus,
    approveParticipation,
    rejectParticipation
  };
};
