
// Export the mission date update functions
export * from './updateMissionDates';
// Export the mission expiry function (renamed to avoid conflict)
export { updateItoenMissionExpiry } from './updateMissionExpiry';
export { fetchActiveMissions, fetchMissionParticipationCount } from './fetchMissions';

// Add a simple initialization function that can be used
export const initializeMissionService = () => {
  console.log('Mission service initialized');
  return true;
};
