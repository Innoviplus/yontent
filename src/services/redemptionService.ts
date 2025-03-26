
import { RedemptionItem } from '@/types/redemption';
import { getRedemptionItems, getRedeemedPoints } from './redemption';

// Provide mock implementations for removed functions
const mockCreateRedemptionRequest = async () => ({ success: false, message: 'Redemption requests are no longer supported' });
const mockGetUserRedemptionRequests = async () => ({ requests: [], totalCount: 0 });
const mockApproveRedemptionRequest = async () => ({ success: false, message: 'Redemption requests are no longer supported' });
const mockRejectRedemptionRequest = async () => ({ success: false, message: 'Redemption requests are no longer supported' });

export {
  getRedemptionItems,
  getRedeemedPoints,
  mockCreateRedemptionRequest as createRedemptionRequest,
  mockGetUserRedemptionRequests as getUserRedemptionRequests,
  mockApproveRedemptionRequest as approveRedemptionRequest,
  mockRejectRedemptionRequest as rejectRedemptionRequest
};
