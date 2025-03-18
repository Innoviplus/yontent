
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  points: number;
  createdAt: Date;
}

export interface Review {
  id: string;
  userId: string;
  productName?: string;  // Made optional
  rating?: number;       // Made optional
  content: string;
  images: string[];
  createdAt: Date;
  user?: User;
  viewsCount?: number;
  likesCount?: number;
}

export interface Mission {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  type: 'REVIEW' | 'RECEIPT';
  status: 'ACTIVE' | 'COMPLETED';
  expiresAt?: Date;
  requirementDescription: string;
}

export interface ReceiptSubmission {
  id: string;
  userId: string;
  missionId: string;
  image: string;
  storeTitle: string;
  purchaseDate: Date;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
}
