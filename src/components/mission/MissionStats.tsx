
import { useState } from 'react';
import { Mission } from '@/lib/types';
import { Card, CardContent } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Clock, Users, MapPin, Target } from 'lucide-react';
import { format, isPast } from 'date-fns';
import { toast } from 'sonner';
import { supabase } from '@/integrations/supabase/client';

interface MissionStatsProps {
  mission: Mission;
  participating: boolean;
  participationStatus: string | null;
  userId: string;
  onParticipationUpdate: (isParticipating: boolean, status: string) => void;
}

const MissionStats = ({ 
  mission, 
  participating, 
  participationStatus, 
  userId,
  onParticipationUpdate 
}: MissionStatsProps) => {
  const [loading, setLoading] = useState(false);
  
  const isExpired = mission.expiresAt ? isPast(mission.expiresAt) : false;
  const isCompleted = participationStatus === 'APPROVED';

  const joinMission = async () => {
    if (!userId) {
      toast.error('Please log in to join this mission');
      return;
    }
    
    try {
      setLoading(true);
      
      const { error } = await supabase
        .from('mission_participations')
        .insert({
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

  return (
    <Card className="overflow-hidden border-t-4 border-t-brand-teal">
      <CardContent className="p-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Mission Stats</h2>
          <div className="flex items-center text-brand-teal font-bold text-lg">
            <img 
              src="/lovable-uploads/87f7987e-62e4-4871-b384-8c77779df418.png" 
              alt="Points" 
              className="w-5 h-5 mr-1"
            />
            <span>{mission.pointsReward}</span>
          </div>
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
          
          {mission.maxSubmissionsPerUser && (
            <div className="flex items-center">
              <Users className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Submissions Allowed</p>
                <p className="font-medium">{mission.maxSubmissionsPerUser} per user</p>
              </div>
            </div>
          )}
          
          {mission.merchantName && (
            <div className="flex items-center">
              <MapPin className="h-5 w-5 text-gray-500 mr-3" />
              <div>
                <p className="text-sm text-gray-500">Merchant</p>
                <p className="font-medium">{mission.merchantName}</p>
              </div>
            </div>
          )}
        </div>
        
        <div className="mt-6">
          {isCompleted ? (
            <Button disabled className="w-full border-brand-teal text-brand-teal bg-white hover:bg-gray-50">
              Mission Completed
            </Button>
          ) : isExpired ? (
            <Button disabled className="w-full">
              Mission Expired
            </Button>
          ) : participating ? (
            <Button disabled={loading} variant="outline" className="w-full border-brand-teal text-brand-teal bg-white hover:bg-gray-50">
              {participationStatus === 'PENDING' ? 'Submission Pending' : 'Already Joined'}
            </Button>
          ) : (
            <Button
              onClick={joinMission}
              disabled={loading || !userId}
              className="w-full bg-brand-teal hover:bg-brand-teal/90"
            >
              {userId ? 'Join Mission' : 'Log in to Join'}
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  );
};

export default MissionStats;
