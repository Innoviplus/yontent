import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PointsBadge from '@/components/PointsBadge';
import { useAuth } from '@/contexts/AuthContext';
import { format } from 'date-fns';
import { toast } from 'sonner';

interface MissionParticipation {
  id: string;
  status: string;
  created_at: string;
  mission: {
    id: string;
    title: string;
    points_reward: number;
  };
}

const MissionsTab = () => {
  const [participations, setParticipations] = useState<MissionParticipation[]>([]);
  const [loading, setLoading] = useState(true);
  const { user } = useAuth();

  useEffect(() => {
    const fetchMissionParticipations = async () => {
      if (!user) return;
      
      try {
        setLoading(true);
        const { data, error } = await supabase
          .from('mission_participations')
          .select(`
            id,
            status,
            created_at,
            mission:missions (
              id,
              title,
              points_reward
            )
          `)
          .eq('user_id_p', user.id)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setParticipations(data || []);
      } catch (error) {
        console.error('Error fetching mission participations:', error);
        toast.error('Failed to load mission participations');
      } finally {
        setLoading(false);
      }
    };

    fetchMissionParticipations();
  }, [user]);

  const pendingMissions = participations.filter(p => p.status === 'PENDING');
  const approvedMissions = participations.filter(p => p.status === 'APPROVED');
  const rejectedMissions = participations.filter(p => p.status === 'REJECTED');

  const renderStatusBadge = (status: string) => {
    switch (status) {
      case 'PENDING':
        return <Badge className="bg-yellow-500">Pending</Badge>;
      case 'APPROVED':
        return <Badge className="bg-green-500">Approved</Badge>;
      case 'REJECTED':
        return <Badge className="bg-red-500">Rejected</Badge>;
      default:
        return <Badge>{status}</Badge>;
    }
  };

  const renderMissionTable = (missionsData: MissionParticipation[]) => {
    if (missionsData.length === 0) {
      return (
        <div className="bg-white rounded-xl p-8 text-center shadow-subtle">
          <p className="text-gray-600">No mission submissions found in this category.</p>
        </div>
      );
    }

    return (
      <Table>
        <TableHeader>
          <TableRow>
            <TableHead>Mission</TableHead>
            <TableHead>Submission Date</TableHead>
            <TableHead>Status</TableHead>
            <TableHead>Points</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {missionsData.map((participation) => (
            <TableRow key={participation.id}>
              <TableCell className="font-medium">{participation.mission.title}</TableCell>
              <TableCell>{format(new Date(participation.created_at), 'MMM d, yyyy')}</TableCell>
              <TableCell>{renderStatusBadge(participation.status)}</TableCell>
              <TableCell>
                <PointsBadge 
                  points={participation.mission.points_reward} 
                  size="sm"
                  className={participation.status === 'REJECTED' ? 'line-through' : ''}
                />
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    );
  };

  if (loading) {
    return (
      <div className="space-y-4">
        {[1, 2].map((i) => (
          <div key={i} className="bg-white rounded-xl animate-pulse h-48"></div>
        ))}
      </div>
    );
  }

  if (participations.length === 0) {
    return (
      <div className="bg-white rounded-xl p-8 text-center shadow-card">
        <h3 className="text-lg font-medium text-gray-900 mb-2">No mission submissions yet</h3>
        <p className="text-gray-600">
          You haven't submitted any mission entries yet. Look for missions to complete and earn points!
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>My Mission Participations</CardTitle>
        <CardDescription>
          Track the status of your mission submissions
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="all">
          <TabsList className="mb-4">
            <TabsTrigger value="all">All ({participations.length})</TabsTrigger>
            <TabsTrigger value="pending">Pending ({pendingMissions.length})</TabsTrigger>
            <TabsTrigger value="approved">Approved ({approvedMissions.length})</TabsTrigger>
            <TabsTrigger value="rejected">Rejected ({rejectedMissions.length})</TabsTrigger>
          </TabsList>
          
          <TabsContent value="all">
            {renderMissionTable(participations)}
          </TabsContent>
          
          <TabsContent value="pending">
            {renderMissionTable(pendingMissions)}
          </TabsContent>
          
          <TabsContent value="approved">
            {renderMissionTable(approvedMissions)}
          </TabsContent>
          
          <TabsContent value="rejected">
            {renderMissionTable(rejectedMissions)}
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default MissionsTab;
