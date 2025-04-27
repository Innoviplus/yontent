
import { ApiResponse, MissionParticipation } from './types/participationTypes';
import { 
  updateMissionParticipationStatus as updateParticipationStatus,
  approveParticipation as approveParticipationAction,
  rejectParticipation as rejectParticipationAction
} from './participationStatusActions';
import { 
  fetchMissionParticipations as fetchParticipations,
  fetchMissionParticipationsWithFilters 
} from './services/participationsService';

// Re-export the status action functions
export const approveParticipation = approveParticipationAction;
export const rejectParticipation = rejectParticipationAction;
export const updateMissionParticipationStatus = updateParticipationStatus;

// Re-export the fetch functions
export const fetchMissionParticipations = fetchParticipations;
export { fetchMissionParticipationsWithFilters };

// Re-export the MissionParticipation type
export type { MissionParticipation } from './types/participationTypes';

// API functions export
export const useMissionParticipationsApi = () => ({
  fetchMissionParticipations,
  fetchMissionParticipationsWithFilters,
  updateMissionParticipationStatus,
  approveParticipation,
  rejectParticipation
});
