
import { fetchActiveMissions, fetchMissionParticipationCount } from './fetchMissions';
import { submitMissionReceipt } from './submitMissions';
import { updateMissionExpiryDate } from './updateMissionExpiry';
import { ensureMissionStorageBucketExists } from './storageBucket';

export const initializeMissionService = () => {
  console.log('Mission service initialized');
  ensureMissionStorageBucketExists();
};

export {
  fetchActiveMissions,
  fetchMissionParticipationCount,
  submitMissionReceipt,
  updateMissionExpiryDate,
  ensureMissionStorageBucketExists
};
