
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import SubmissionReviewDialog from './SubmissionReviewDialog';

interface Participation {
  id: string;
  mission_id: string;
  user_id: string;
  status: string;
  created_at: string;
  mission: {
    title: string;
    type: string;
    points_reward: number;
  };
  profile?: {
    username: string;
  };
  submission_data: {
    receipt_images?: string[];
    review_content?: string;
    review_id?: string;
  };
}

interface ParticipationsTableProps {
  filterStatus: string | null;
}

const ParticipationsTable = ({ filterStatus }: ParticipationsTableProps) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedParticipation, setSelectedParticipation] = useState<Participation | null>(null);

  const fetchParticipations = async () => {
    try {
      let query = supabase
        .from('mission_participations')
        .select(`
          *,
          mission:missions(title, type, points_reward)
        `)
        .order('created_at', { ascending: false });

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      const processedData = await Promise.all((data || []).map(async (participation) => {
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', participation.user_id)
          .single();
        
        const submissionData = participation.submission_data as any || {};
        
        return {
          id: participation.id,
          mission_id: participation.mission_id,
          user_id: participation.user_id,
          status: participation.status,
          created_at: participation.created_at,
          mission: participation.mission,
          profile: {
            username: profileData?.username || 'Unknown User'
          },
          submission_data: {
            receipt_images: submissionData.receipt_images || [],
            review_content: submissionData.review_content || '',
            review_id: submissionData.review_id || ''
          }
        } as Participation;
      }));
      
      setParticipations(processedData);
    } catch (error) {
      console.error('Error fetching participations:', error);
      toast.error('Failed to load participations');
    } finally {
      setLoading(false);
    }
  };

  const handleUpdateStatus = async (id: string, newStatus: string, participation: Participation) => {
    try {
      const { error: updateError } = await supabase
        .from('mission_participations')
        .update({ status: newStatus })
        .eq('id', id);

      if (updateError) throw updateError;

      if (newStatus === 'APPROVED') {
        const pointAmount = participation.mission.points_reward;
        
        // Use the admin_add_point_transaction function to bypass RLS
        const { data: transactionData, error: transactionError } = await supabase.rpc(
          'admin_add_point_transaction',
          {
            p_user_id: participation.user_id,
            p_amount: pointAmount,
            p_type: 'EARNED',
            p_description: `Earned ${pointAmount} points for completing mission: ${participation.mission.title}`
          }
        );

        if (transactionError) throw transactionError;

        // Now update the user's points balance
        const { error: pointsError } = await supabase.rpc(
          'increment_points',
          {
            user_id_param: participation.user_id,
            points_amount_param: pointAmount
          }
        );

        if (pointsError) throw pointsError;

        // Update the profile points directly
        const { data: profileData } = await supabase
          .from('profiles')
          .select('points')
          .eq('id', participation.user_id)
          .single();
          
        const newPoints = (profileData?.points || 0) + pointAmount;
        
        const { error: updatePointsError } = await supabase
          .from('profiles')
          .update({ points: newPoints })
          .eq('id', participation.user_id);
          
        if (updatePointsError) throw updatePointsError;

        toast.success(`Awarded ${pointAmount} points to ${participation.profile?.username}`);
      }

      toast.success(`Submission ${newStatus.toLowerCase()}`);
      fetchParticipations();
    } catch (error: any) {
      console.error('Error updating participation:', error);
      toast.error('Failed to update submission status');
    }
  };

  useEffect(() => {
    fetchParticipations();
  }, [filterStatus]);

  if (loading) {
    return (
      <div className="flex justify-center py-8">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <>
      <div className="rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead>Mission</TableHead>
              <TableHead>User</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Submitted</TableHead>
              <TableHead>Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {participations.map((participation) => (
              <TableRow key={participation.id}>
                <TableCell>{participation.mission?.title}</TableCell>
                <TableCell>{participation.profile?.username}</TableCell>
                <TableCell>{participation.status}</TableCell>
                <TableCell>{new Date(participation.created_at).toLocaleDateString()}</TableCell>
                <TableCell>
                  <div className="flex gap-2">
                    {participation.status === 'PENDING' && (
                      <>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(participation.id, 'APPROVED', participation)}
                        >
                          <Check className="h-4 w-4 mr-1" />
                          Approve
                        </Button>
                        <Button
                          size="sm"
                          variant="outline"
                          onClick={() => handleUpdateStatus(participation.id, 'REJECTED', participation)}
                        >
                          <X className="h-4 w-4 mr-1" />
                          Reject
                        </Button>
                      </>
                    )}
                    <Button 
                      size="sm" 
                      variant="outline"
                      onClick={() => setSelectedParticipation(participation)}
                    >
                      <Search className="h-4 w-4 mr-1" />
                      Review
                    </Button>
                  </div>
                </TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </div>

      <SubmissionReviewDialog
        isOpen={!!selectedParticipation}
        onClose={() => setSelectedParticipation(null)}
        participation={selectedParticipation || undefined}
      />
    </>
  );
};

export default ParticipationsTable;
