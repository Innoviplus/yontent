
import { useState, useEffect } from 'react';
import { supabase } from '@/integrations/supabase/client';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import PointsBadge from '@/components/PointsBadge';
import { format } from 'date-fns';

interface UserMissionTabProps {
  userId: string;
  isCurrentUser: boolean;
  username: string;
}

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

const UserMissionsTab = ({ userId, isCurrentUser, username }: UserMissionTabProps) => {
  const [participations, setParticipations] = useState<MissionParticipation[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchMissionParticipations = async () => {
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
          .eq('user_id', userId)
          .order('created_at', { ascending: false });

        if (error) throw error;
        setParticipations(data || []);
      } catch (error) {
        console.error('Error fetching mission participations:', error);
      } finally {
        setLoading(false);
      }
    };

    fetchMissionParticipations();
  }, [userId]);

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
          {isCurrentUser
            ? "You haven't submitted any mission entries yet."
            : `${username} hasn't submitted any mission entries yet.`}
        </p>
      </div>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Mission Participations</CardTitle>
        <CardDescription>
          {isCurrentUser
            ? "Track the status of your mission submissions"
            : `${username}'s mission submissions`}
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

export default UserMissionsTab;
