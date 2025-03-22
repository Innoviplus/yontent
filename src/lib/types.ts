
export interface User {
  id: string;
  username: string;
  email: string;
  avatar?: string;
  points: number;
  createdAt: Date;
  isAdmin?: boolean;
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
  status?: string;     // Added status field
}

export interface PointTransaction {
  id: string;
  userId: string;
  amount: number;
  type: 'EARNED' | 'REDEEMED' | 'REFUNDED' | 'ADJUSTED';
  source: 'MISSION_REVIEW' | 'RECEIPT_SUBMISSION' | 'REDEMPTION' | 'ADMIN_ADJUSTMENT';
  sourceId?: string;
  description?: string;
  createdAt: Date;
}

export interface RedemptionRequest {
  id: string;
  userId: string;
  pointsAmount: number;
  redemptionType: 'CASH' | 'GIFT_VOUCHER';
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  paymentDetails?: any;
  adminNotes?: string;
  createdAt: Date;
  updatedAt: Date;
}

export interface ExtendedProfile {
  firstName?: string;
  lastName?: string;
  bio?: string;
  gender?: string;
  birthDate?: Date;
  websiteUrl?: string;
  facebookUrl?: string;
  instagramUrl?: string;
  youtubeUrl?: string;
  tiktokUrl?: string;
  phoneNumber?: string;
  country?: string;
  [key: string]: any; // Add index signature to make it compatible with Json type
}

// Define Mission type for UI only
export interface Mission {
  id: string;
  title: string;
  description: string;
  pointsReward: number;
  type: 'REVIEW' | 'RECEIPT';
  status: 'ACTIVE' | 'COMPLETED' | 'DRAFT';
  expiresAt?: Date;
  requirementDescription?: string;
  merchantName?: string;
  merchantLogo?: string;
  bannerImage?: string;
  maxSubmissionsPerUser?: number;
  termsConditions?: string;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Define Json type to match Supabase's Json type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
