
// This is now just a re-export file for backward compatibility
// All functionality has been moved to the redemption directory

import { 
  getRedeemedPoints,
  createRedemptionRequest,
  getUserRedemptionRequests,
  approveRedemptionRequest,
  getRedemptionItems
} from './redemption';

export {
  getRedeemedPoints,
  createRedemptionRequest,
  getUserRedemptionRequests,
  approveRedemptionRequest,
  getRedemptionItems
};
