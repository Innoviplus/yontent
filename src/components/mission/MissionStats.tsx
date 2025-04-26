
import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Mission } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, Target, Gauge } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';
import { formatNumber } from '@/lib/formatUtils';

interface MissionStatsProps {
  mission: Mission;
  participating: boolean;
  participationStatus: string | null;
  userId: string;
  onParticipationUpdate: (isParticipating: boolean, status: string) => void;
  currentSubmissions: number;
}

const MissionStats = ({
  mission,
  participating,
  participationStatus,
  userId,
  onParticipationUpdate,
  currentSubmissions
}: MissionStatsProps) => {
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();
  const isExpired = mission.expiresAt ? isPast(mission.expiresAt) : false;
  const isCompleted = participationStatus === 'APPROVED';
  const isQuotaReached = mission.totalMaxSubmissions !== undefined && 
                        mission.totalMaxSubmissions > 0 && 
                        currentSubmissions >= mission.totalMaxSubmissions;

  const handleMissionParticipation = async () => {
    if (!userId) {
      toast.error('Please log in to join this mission');
      return;
    }
    try {
      setLoading(true);

      // Check mission quota before proceeding
      if (isQuotaReached) {
        toast.error('This mission has reached its maximum number of submissions');
        return;
      }

      // For receipt and review type missions, navigate to the appropriate submission page
      if (mission.type === 'RECEIPT') {
        navigate(`/mission/${mission.id}/receipt`);
        return;
      }
      if (mission.type === 'REVIEW') {
        navigate(`/mission/${mission.id}/review`);
        return;
      }

      // For other mission types, create a participation record directly
      const {
        error
      } = await supabase.from('mission_participations').insert({
        mission_id: mission.id,
        user_id: userId,
        status: 'PENDING'
      });
      if (error) throw error;
      onParticipationUpdate(true, 'PENDING');
      toast.success('You have joined this mission!');
    } catch (error) {
      console.error('Error joining mission:', error);
      toast.error('Failed to join mission. Please try again.');
    } finally {
      setLoading(false);
    }
  };

  const getMissionActionButton = () => {
    if (isCompleted) {
      return <Button disabled className="w-full border-brand-teal text-brand-teal bg-white hover:bg-gray-50">
          Mission Completed
        </Button>;
    }
    if (isExpired) {
      return <Button disabled className="w-full">
          Mission Expired
        </Button>;
    }
    if (participating) {
      return <Button disabled={loading} variant="outline" className="w-full border-brand-teal text-brand-teal bg-white hover:bg-gray-50">
          {participationStatus === 'PENDING' ? 'Submission Pending' : 'Already Joined'}
        </Button>;
    }
    if (isQuotaReached) {
      return <Button disabled className="w-full">
          Mission Quota Reached
        </Button>;
    }
    return <Button onClick={handleMissionParticipation} disabled={loading || !userId || isQuotaReached} className="w-full bg-brand-teal hover:bg-brand-teal/90">
        {userId ? (isQuotaReached ? 'Mission Quota Reached' : 'Join Mission') : 'Log in to Join'}
      </Button>;
  };

  return <Card className="overflow-hidden border-t-4 border-t-brand-teal">
      <CardContent className="p-6">
        <div className="mb-4">
          <h2 className="text-xl font-semibold">Mission - Key Information</h2>
        </div>
        
        <div className="space-y-4">
          <div className="flex items-center">
            <Target className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Mission Type</p>
              <p className="font-medium">{mission.type === 'REVIEW' ? 'Product Review' : 'Receipt Upload'}</p>
            </div>
          </div>
          
          <div className="flex items-center">
            <Clock className="h-5 w-5 text-gray-500 mr-3" />
            <div>
              <p className="text-sm text-gray-500">Timeline</p>
              <p className="font-medium">
                {mission.startDate && format(mission.startDate, 'MMM d, yyyy')} 
                {mission.expiresAt && ' - ' + format(mission.expiresAt, 'MMM d, yyyy')}
              </p>
            </div>
          </div>
          
          {/* Submission information moved here */}
          {mission.maxSubmissionsPerUser && <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Max submission(s) per user</p>
                <p className="font-medium">{mission.maxSubmissionsPerUser}</p>
              </div>
            </div>}
          
          {mission.totalMaxSubmissions !== undefined && <div className="flex items-center">
              <Gauge className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Mission Quota</p>
                <p className="font-medium">
                  {mission.totalMaxSubmissions} ({currentSubmissions} {currentSubmissions === 1 ? 'user' : 'users'} submitted)
                  {isQuotaReached && <span className="text-red-500 ml-2 font-bold">FULL</span>}
                </p>
              </div>
            </div>}
        </div>
        
        <div className="mt-6">
          {getMissionActionButton()}
        </div>
      </CardContent>
    </Card>;
};

export default MissionStats;
