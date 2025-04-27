
import { useEffect, useState } from 'react';
import { Table, TableHeader, TableRow, TableHead, TableBody, TableCell } from '@/components/ui/table';
import { Button } from '@/components/ui/button';
import { Check, X, Search, Loader2 } from 'lucide-react';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface Participation {
  id: string;
  mission_id: string;
  user_id: string;
  status: string;
  created_at: string;
  mission: {
    title: string;
  };
  profile?: {
    username: string;
  };
  submission_data: {
    receipt_images?: string[];
    review_content?: string;
  };
}

interface ParticipationsTableProps {
  filterStatus: string | null;
}

const ParticipationsTable = ({ filterStatus }: ParticipationsTableProps) => {
  const [participations, setParticipations] = useState<Participation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchParticipations = async () => {
    try {
      let query = supabase
        .from('mission_participations')
        .select(`
          *,
          mission:missions(title)
        `)
        .order('created_at', { ascending: false });

      if (filterStatus) {
        query = query.eq('status', filterStatus);
      }

      const { data, error } = await query;

      if (error) throw error;
      
      // Process data and fetch usernames separately since the relation doesn't exist
      const processedData = await Promise.all((data || []).map(async (participation) => {
        // Fetch the username from profiles table based on user_id
        const { data: profileData } = await supabase
          .from('profiles')
          .select('username')
          .eq('id', participation.user_id)
          .single();
        
        // Convert submission_data from Json to the expected type structure
        const submissionData = participation.submission_data as any || {};
        
        // Create properly typed participation object
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
            review_content: submissionData.review_content || ''
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

  const handleUpdateStatus = async (id: string, newStatus: string) => {
    try {
      const { error } = await supabase
        .from('mission_participations')
        .update({ status: newStatus })
        .eq('id', id);

      if (error) throw error;

      toast.success(`Submission ${newStatus.toLowerCase()}`);
      fetchParticipations();
    } catch (error) {
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
                        onClick={() => handleUpdateStatus(participation.id, 'APPROVED')}
                      >
                        <Check className="h-4 w-4 mr-1" />
                        Approve
                      </Button>
                      <Button
                        size="sm"
                        variant="outline"
                        onClick={() => handleUpdateStatus(participation.id, 'REJECTED')}
                      >
                        <X className="h-4 w-4 mr-1" />
                        Reject
                      </Button>
                    </>
                  )}
                  <Button size="sm" variant="outline">
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
  );
};

export default ParticipationsTable;
