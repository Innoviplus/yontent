
import { supabase } from "@/integrations/supabase/client";
import { Mission } from "@/lib/types";
import { toast } from "sonner";

/**
 * Fetches all active missions
 */
export const fetchActiveMissions = async (): Promise<Mission[]> => {
  try {
    console.log('Fetching active missions');
    const { data, error } = await supabase
      .from('missions')
      .select('*')
      .eq('status', 'ACTIVE')
      .order('created_at', { ascending: false });

    if (error) {
      throw error;
    }

    if (!data || data.length === 0) {
      console.log('No missions found in database');
    } else {
      console.log(`Found ${data.length} missions in database`);
    }

    const missions = data.map(mission => ({
      id: mission.id,
      title: mission.title,
      description: mission.description,
      pointsReward: mission.points_reward,
      type: mission.type as 'REVIEW' | 'RECEIPT',
      status: mission.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
      merchantName: mission.merchant_name || undefined,
      merchantLogo: mission.merchant_logo || undefined,
      bannerImage: mission.banner_image || undefined,
      maxSubmissionsPerUser: mission.max_submissions_per_user,
      totalMaxSubmissions: mission.total_max_submissions || undefined,
      termsConditions: mission.terms_conditions || undefined,
      requirementDescription: mission.requirement_description || undefined,
      startDate: new Date(mission.start_date),
      expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
      createdAt: new Date(mission.created_at),
      updatedAt: new Date(mission.updated_at),
      completionSteps: mission.completion_steps || undefined,
      productDescription: mission.product_description || undefined,
      productImages: mission.product_images || [],
      faqContent: mission.faq_content || undefined
    }));

    console.log('Transformed missions:', missions);

    return missions;
  } catch (error: any) {
    console.error("Error fetching missions:", error.message);
    toast.error("Failed to load missions");
    return [];
  }
};

/**
 * Fetches participation count for a specific mission
 */
export const fetchMissionParticipationCount = async (missionId: string): Promise<number> => {
  try {
    console.log(`Fetching participation count for mission ${missionId}`);
    
    const { count, error } = await supabase
      .from('mission_participations')
      .select('*', { count: 'exact', head: true })
      .eq('mission_id', missionId);
      
    if (error) {
      console.error(`Error fetching mission participation count: ${error.message}`);
      throw error;
    }
    
    console.log(`Found ${count || 0} participations for mission ${missionId}`);
    return count || 0;
  } catch (error: any) {
    console.error(`Error fetching participation count for mission ${missionId}:`, error.message);
    return 0;
  }
};
