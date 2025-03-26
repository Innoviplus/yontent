
import { supabase } from "@/integrations/supabase/client";
import { RedemptionRequest } from "@/lib/types";

/**
 * Creates sample redemption requests for demo purposes
 * @returns An array of created redemption requests or null if error
 */
export const createDemoRedemptionRequests = async (): Promise<RedemptionRequest[] | null> => {
  try {
    console.log("Creating demo redemption requests...");
    
    // Define sample user IDs - in a real app, you would use real user IDs
    const userIds = [
      '1',  // Sample user from sampleUserData
      '2',  // Another sample user
      '3',  // Another sample user
      '4'   // Another sample user
    ];
    
    // Define demo requests with different types and statuses
    const demoRequests = [
      {
        user_id: userIds[0],
        points_amount: 500,
        redemption_type: 'GIFT_VOUCHER',
        payment_details: { 
          reward_name: 'Amazon Gift Card',
          email: 'user1@example.com'
        },
        status: 'PENDING',
        admin_notes: null,
        created_at: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000).toISOString() // 7 days ago
      },
      {
        user_id: userIds[1],
        points_amount: 1000,
        redemption_type: 'CASH',
        payment_details: { 
          reward_name: 'Bank Transfer',
          account_name: 'Jane Smith',
          account_number: '****4567',
          bank_name: 'Chase Bank'
        },
        status: 'APPROVED',
        admin_notes: 'Payment processed via ACH transfer',
        created_at: new Date(Date.now() - 14 * 24 * 60 * 60 * 1000).toISOString() // 14 days ago
      },
      {
        user_id: userIds[2],
        points_amount: 250,
        redemption_type: 'GIFT_VOUCHER',
        payment_details: { 
          reward_name: 'Starbucks Gift Card',
          email: 'user3@example.com'
        },
        status: 'REJECTED',
        admin_notes: 'Insufficient points balance',
        created_at: new Date(Date.now() - 3 * 24 * 60 * 60 * 1000).toISOString() // 3 days ago
      },
      {
        user_id: userIds[3],
        points_amount: 750,
        redemption_type: 'CASH',
        payment_details: { 
          reward_name: 'PayPal Transfer',
          email: 'user4@example.com'
        },
        status: 'PENDING',
        admin_notes: null,
        created_at: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString() // 1 day ago
      }
    ];
    
    console.log(`Inserting ${demoRequests.length} demo requests...`);
    
    // Insert the demo requests into the database
    const { data, error } = await supabase
      .from('redemption_requests')
      .insert(demoRequests)
      .select();
    
    if (error) {
      console.error("Error creating demo redemption requests:", error);
      return null;
    }
    
    console.log("Demo redemption requests created successfully:", data);
    
    // Format the returned data to match the RedemptionRequest type
    const formattedRequests: RedemptionRequest[] = data.map(item => ({
      id: item.id,
      userId: item.user_id,
      pointsAmount: item.points_amount,
      redemptionType: item.redemption_type as "CASH" | "GIFT_VOUCHER",
      status: item.status as "PENDING" | "APPROVED" | "REJECTED",
      paymentDetails: item.payment_details,
      adminNotes: item.admin_notes,
      createdAt: new Date(item.created_at),
      updatedAt: new Date(item.updated_at)
    }));
    
    return formattedRequests;
  } catch (error) {
    console.error("Error in createDemoRedemptionRequests:", error);
    return null;
  }
};
