
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
  totalMaxSubmissions?: number;
  termsConditions?: string;
  startDate: Date;
  createdAt: Date;
  updatedAt: Date;
}

// Add mock RedemptionRequest type for backward compatibility
// This is just a placeholder to fix TypeScript errors
export interface RedemptionRequest {
  id: string;
  userId: string;
  itemId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  paymentDetails?: {
    bank_details?: {
      bank_name: string;
      account_name: string;
      account_number: string;
      swift_code?: string;
      recipient_name: string;
      recipient_address?: string;
      recipient_mobile?: string;
    }
  }
}

// Define Json type to match Supabase's Json type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
