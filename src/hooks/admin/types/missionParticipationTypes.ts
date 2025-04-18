
export type MissionParticipation = {
  id: string;
  userId: string;
  missionId: string;
  status: string;
  submissionData: {
    receipt_images?: string[];
    review_id?: string;
    review_images?: string[];
    review_url?: string;
    submission_type?: 'RECEIPT' | 'REVIEW'; // Made optional
  } | null;
  createdAt: Date;
  // These fields are added during transformation from API data
  userName: string;
  userAvatar?: string;
  missionTitle: string;
  missionDescription: string;
  missionPointsReward: number;
  missionType: 'RECEIPT' | 'REVIEW';
};

export type FetchParticipationsResult = {
  participations: MissionParticipation[];
  error?: string;
};

export type ParticipationActionResult = {
  success: boolean;
  error?: string;
};
