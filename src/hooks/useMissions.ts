
import { useState, useEffect } from 'react';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';

type SortOption = 'recent' | 'expiring' | 'points';

const ITEMS_PER_PAGE = 9;

export const useMissions = () => {
  const [missions, setMissions] = useState<Mission[]>([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState<SortOption>('recent');
  const [page, setPage] = useState(0);
  const [hasMore, setHasMore] = useState(true);
  
  const fetchMissions = async (pageNum: number, sort: SortOption) => {
    try {
      setLoading(true);
      let query = supabase
        .from('missions')
        .select('*')
        .eq('status', 'ACTIVE')
        .range(pageNum * ITEMS_PER_PAGE, (pageNum + 1) * ITEMS_PER_PAGE - 1);

      switch (sort) {
        case 'recent':
          query = query.order('created_at', { ascending: false });
          break;
        case 'expiring':
          // Fix: use nullsFirst instead of nullsLast to handle properly
          query = query.order('expires_at', { ascending: true, nullsFirst: false });
          break;
        case 'points':
          query = query.order('points_reward', { ascending: false });
          break;
      }
        
      const { data, error } = await query;
        
      if (error) {
        console.error('Error fetching missions:', error);
        toast.error('Failed to load missions');
        return;
      }
      
      const transformedMissions: Mission[] = data.map(mission => ({
        id: mission.id,
        title: mission.title,
        description: mission.description,
        pointsReward: mission.points_reward,
        type: mission.type as 'REVIEW' | 'RECEIPT',
        status: mission.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
        expiresAt: mission.expires_at ? new Date(mission.expires_at) : undefined,
        requirementDescription: mission.requirement_description,
        merchantName: mission.merchant_name,
        merchantLogo: mission.merchant_logo,
        bannerImage: mission.banner_image,
        maxSubmissionsPerUser: mission.max_submissions_per_user,
        termsConditions: mission.terms_conditions,
        startDate: new Date(mission.start_date),
        createdAt: new Date(mission.created_at),
        updatedAt: new Date(mission.updated_at)
      }));

      if (pageNum === 0) {
        setMissions(transformedMissions);
      } else {
        setMissions(prev => [...prev, ...transformedMissions]);
      }
      
      setHasMore(transformedMissions.length === ITEMS_PER_PAGE);
      
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };
  
  useEffect(() => {
    setPage(0);
    fetchMissions(0, sortBy);
  }, [sortBy]);
  
  useEffect(() => {
    if (page > 0) {
      fetchMissions(page, sortBy);
    }
  }, [page]);
  
  return {
    missions,
    loading,
    sortBy,
    setSortBy,
    setPage,
    hasMore,
  };
};

export const useMissionDetails = (missionId: string) => {
  const [mission, setMission] = useState<Mission | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [participation, setParticipation] = useState<{ status: string } | null>(null);

  const fetchMissionDetails = async () => {
    if (!missionId) {
      setError('Mission ID is required');
      setLoading(false);
      return;
    }
    
    try {
      setLoading(true);
      
      const { data, error } = await supabase
        .from('missions')
        .select('*')
        .eq('id', missionId)
        .single();
        
      if (error) {
        console.error('Error fetching mission details:', error);
        setError('Failed to load mission details');
        return;
      }
      
      if (data) {
        setMission({
          id: data.id,
          title: data.title,
          description: data.description,
          pointsReward: data.points_reward,
          type: data.type as 'REVIEW' | 'RECEIPT',
          status: data.status as 'ACTIVE' | 'COMPLETED' | 'DRAFT',
          expiresAt: data.expires_at ? new Date(data.expires_at) : undefined,
          requirementDescription: data.requirement_description,
          merchantName: data.merchant_name,
          merchantLogo: data.merchant_logo,
          bannerImage: data.banner_image,
          maxSubmissionsPerUser: data.max_submissions_per_user,
          termsConditions: data.terms_conditions,
          startDate: new Date(data.start_date),
          createdAt: new Date(data.created_at),
          updatedAt: new Date(data.updated_at)
        });
        
        // Check if user is already participating in this mission
        const { data: userSession } = await supabase.auth.getSession();
        if (userSession?.session?.user?.id) {
          const { data: participationData } = await supabase
            .from('mission_participations')
            .select('status')
            .eq('mission_id', missionId)
            .eq('user_id', userSession.session.user.id)
            .maybeSingle();
            
          if (participationData) {
            setParticipation(participationData);
          }
        }
      }
    } catch (err) {
      console.error('Unexpected error:', err);
      setError('An unexpected error occurred');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchMissionDetails();
  }, [missionId]);

  const joinMission = async () => {
    try {
      const { data: userSession } = await supabase.auth.getSession();
      if (!userSession?.session?.user) {
        toast.error('You must be logged in to join a mission');
        return;
      }
      
      const { error } = await supabase
        .from('mission_participations')
        .insert({
          user_id: userSession.session.user.id,
          mission_id: missionId,
          status: 'IN_PROGRESS'
        });
        
      if (error) {
        console.error('Error joining mission:', error);
        toast.error('Failed to join mission');
        return;
      }
      
      toast.success('Successfully joined mission');
      setParticipation({ status: 'IN_PROGRESS' });
    } catch (error) {
      console.error('Unexpected error:', error);
      toast.error('An unexpected error occurred');
    }
  };

  return {
    mission,
    loading,
    error,
    participation,
    joinMission
  };
};
