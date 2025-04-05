
import { supabase } from "@/integrations/supabase/client";
import { RedemptionItem } from "@/types/redemption";
import { mockRewards } from "@/utils/mockRewards";

// Get redemption items (rewards)
export const getRedemptionItems = async (): Promise<RedemptionItem[]> => {
  try {
    // Fetch redemption items from Supabase
    const { data, error } = await supabase
      .from('redemption_items')
      .select('*')
      .eq('is_active', true)
      .order('display_order', { ascending: true })
      .order('points_required', { ascending: true });
    
    if (error) {
      throw error;
    }
    
    if (!data || data.length === 0) {
      console.log('No redemption items found in database, using mock data');
      return mockRewards;
    }
    
    // Map data to RedemptionItem interface
    return data.map(item => ({
      id: item.id,
      name: item.name,
      description: item.description,
      points_required: item.points_required,
      image_url: item.image_url,
      banner_image: item.banner_image,
      is_active: item.is_active,
      terms_conditions: item.terms_conditions,
      redemption_details: item.redemption_details,
      display_order: item.display_order || 0, // Handle the display_order property
      // Cast string to union type
      redemption_type: (item.redemption_type === 'CASH' ? 'CASH' : 'GIFT_VOUCHER') as 'GIFT_VOUCHER' | 'CASH'
    }));
  } catch (error) {
    console.error("Error getting redemption items:", error);
    // Return mock data as fallback
    return mockRewards;
  }
};
