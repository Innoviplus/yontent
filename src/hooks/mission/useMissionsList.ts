import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import { fetchMissionParticipationCount } from '@/services/mission';

export type SortOption = 'recent' | 'expiringSoon' | 'highestReward';

export const useMissionsList = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [isLoading, setIsLoading] = useState(true);
  const [loadError, setLoadError] = useState<string | null>(null);
  const [activeMissionsCount, setActiveMissionsCount] = useState(0);
  const [loadAttempts, setLoadAttempts] = useState(0);
  const [missionParticipationCounts, setMissionParticipationCounts] = useState<Record<string, number>>({});

  const fetchParticipationCounts = async (missionIds: string[]) => {
    if (!missionIds.length) return;
    
    try {
      console.log("Fetching participation counts for missions:", missionIds);
      
      const countPromises = missionIds.map(async (missionId) => {
        const count = await fetchMissionParticipationCount(missionId);
        return { missionId, count };
      });
      
      const results = await Promise.all(countPromises);
      
      const countsMap: Record<string, number> = {};
      results.forEach(result => {
        countsMap[result.missionId] = result.count;
      });
      
      console.log('Updated participation counts:', countsMap);
      setMissionParticipationCounts(countsMap);
    } catch (error) {
      console.error('Error fetching participation counts:', error);
    }
  };

  const fetchMissions = async () => {
    setIsLoading(true);
    setLoadError(null);
    
    try {
      console.log("Fetching missions data...");
      let query = supabase
        .from('missions')
        .select('*')
        .eq('status', 'ACTIVE');
      
      const { data, error } = await query;
      
      if (error) throw error;
      
      console.log(`Fetched ${data?.length || 0} missions successfully`);
      
      if (!data || data.length === 0) {
        console.log("No active missions found");
        setMissions([]);
        setActiveMissionsCount(0);
        setIsLoading(false);
        return;
      }
      
      const transformedMissions: Mission[] = data.map(mission => ({
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
        totalMaxSubmissions: mission.total_max_submissions,
        termsConditions: mission.terms_conditions || undefined,
        requirementDescription: mission.requirement_description || undefined,
        startDate: new Date(mission.start_date),
        expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
        createdAt: new Date(mission.created_at),
        updatedAt: new Date(mission.updated_at)
      }));
      
      const now = new Date();
      const activeCount = transformedMissions.filter(
        mission => !mission.expiresAt || now <= mission.expiresAt
      ).length;
      
      setActiveMissionsCount(activeCount);
      
      // Extract mission IDs and fetch participation counts
      const missionIds = transformedMissions.map(m => m.id);
      await fetchParticipationCounts(missionIds);
      
      const sortedMissions = sortMissionsByExpiration(transformedMissions);
      setMissions(sortedMissions);
      setLoadAttempts(0);
    } catch (error: any) {
      console.error('Error fetching missions:', error);
      setLoadError(error?.message || 'Failed to load missions');
      
      if (loadAttempts === 0) {
        toast.error('Failed to load missions');
      }
      
      setLoadAttempts(prev => prev + 1);
    } finally {
      setIsLoading(false);
    }
  };

  const sortMissionsByExpiration = (missionsToSort: Mission[]): Mission[] => {
    const now = new Date();
    return [...missionsToSort].sort((a, b) => {
      const aExpired = a.expiresAt && now > a.expiresAt;
      const bExpired = b.expiresAt && now > b.expiresAt;
      
      if (aExpired && !bExpired) return 1;
      if (!aExpired && bExpired) return -1;
      
      if (!aExpired && !bExpired) {
        switch (sortBy) {
          case 'recent':
            return b.startDate.getTime() - a.startDate.getTime();
          case 'expiringSoon':
            if (!a.expiresAt) return 1;
            if (!b.expiresAt) return -1;
            return a.expiresAt.getTime() - b.expiresAt.getTime();
          case 'highestReward':
            return b.pointsReward - a.pointsReward;
          default:
            return 0;
        }
      }
      
      switch (sortBy) {
        case 'recent':
          return b.startDate.getTime() - a.startDate.getTime();
        case 'expiringSoon':
          if (!a.expiresAt) return 1;
          if (!b.expiresAt) return -1;
          return a.expiresAt.getTime() - b.expiresAt.getTime();
        case 'highestReward':
          return b.pointsReward - a.pointsReward;
        default:
          return 0;
      }
    });
  };

  useEffect(() => {
    fetchMissions();
    
    const retryTimeout = setTimeout(() => {
      if (loadError && loadAttempts <= 1) {
        console.log("Automatically retrying mission fetch...");
        fetchMissions();
      }
    }, 3000);
    
    return () => clearTimeout(retryTimeout);
  }, []);

  useEffect(() => {
    setMissions(sortMissionsByExpiration([...missions]));
  }, [sortBy]);

  return {
    missions,
    isLoading,
    loadError,
    activeMissionsCount,
    sortBy,
    setSortBy,
    fetchMissions,
    getParticipationCount: (missionId: string) => missionParticipationCounts[missionId] || 0
  };
};
