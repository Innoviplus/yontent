
import { fetchActiveMissions, fetchMissionParticipationCount } from './fetchMissions';
import { submitMissionReceipt } from './submitMissions';
import { updateMissionExpiry } from './updateMissionExpiry';
import { getStorageBucket } from './storageBucket';

export const initializeMissionService = () => {
  console.log('Mission service initialized');
};

export {
  fetchActiveMissions,
  fetchMissionParticipationCount,
  submitMissionReceipt,
  updateMissionExpiry,
  getStorageBucket
};
