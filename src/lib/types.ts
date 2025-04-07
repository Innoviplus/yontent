
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
  type: 'EARNED' | 'REDEEMED' | 'REFUNDED' | 'ADJUSTED' | 'WELCOME';
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
  completionSteps?: string; // New field for "How To Complete This Mission"
  productDescription?: string; // New field for "About the product or service"
  productImages?: string[]; // New field for product images
  faqContent?: string; // Field for FAQ content
}

// RedemptionRequest type updated with more fields for the UI
export interface RedemptionRequest {
  id: string;
  userId: string;
  itemId: string;
  status: 'PENDING' | 'APPROVED' | 'REJECTED';
  createdAt: Date;
  updatedAt: Date;
  pointsAmount: number;
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
  } | null;
  // Additional fields for display purposes
  userName?: string;
  itemName?: string;
}

// Define Json type to match Supabase's Json type
export type Json =
  | string
  | number
  | boolean
  | null
  | { [key: string]: Json | undefined }
  | Json[];
