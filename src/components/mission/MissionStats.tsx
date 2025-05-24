import { useState, useEffect } from 'react';
import { Users, Clock, Target, CheckCircle } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Mission } from '@/lib/types';
import { supabase } from '@/integrations/supabase/client';
import { toast } from 'sonner';
import MissionReceiptForm from './MissionReceiptForm';
import MissionReviewForm from './review/MissionReviewForm';
import SocialProofForm from './SocialProofForm';

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
  const [showSubmissionForm, setShowSubmissionForm] = useState(false);
  const [isJoining, setIsJoining] = useState(false);

  // Format dates
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { 
      year: 'numeric', 
      month: 'short', 
      day: 'numeric' 
    }).format(date);
  };

  // Check if mission is still active
  const isActive = mission.status === 'ACTIVE' && 
    (!mission.expiresAt || new Date() < mission.expiresAt);

  // Check if total submissions limit is reached
  const isAtSubmissionLimit = mission.totalMaxSubmissions && 
    currentSubmissions >= mission.totalMaxSubmissions;

  const handleJoinMission = async () => {
    if (!userId) {
      toast.error('You must be logged in to join missions');
      return;
    }

    setIsJoining(true);
    
    try {
      // Check if user is already participating
      const { data: existingParticipation, error: checkError } = await supabase
        .from('mission_participations')
        .select('id, status')
        .eq('mission_id', mission.id)
        .eq('user_id_p', userId)
        .single();

      if (checkError && checkError.code !== 'PGRST116') {
        throw checkError;
      }

      if (existingParticipation) {
        toast.info('You are already participating in this mission');
        onParticipationUpdate(true, existingParticipation.status);
        return;
      }

      // Create participation record with JOINED status
      const { error: joinError } = await supabase
        .from('mission_participations')
        .insert({
          mission_id: mission.id,
          user_id_p: userId,
          status: 'JOINED'
        });

      if (joinError) {
        throw joinError;
      }

      toast.success('Successfully joined the mission!');
      onParticipationUpdate(true, 'JOINED');
      
    } catch (error: any) {
      console.error('Error joining mission:', error);
      toast.error(error.message || 'Failed to join mission');
    } finally {
      setIsJoining(false);
    }
  };

  const handleStartSubmission = () => {
    setShowSubmissionForm(true);
  };

  const handleSubmissionComplete = (success: boolean) => {
    if (success) {
      onParticipationUpdate(true, 'PENDING');
      setShowSubmissionForm(false);
    }
  };

  const renderSubmissionForm = () => {
    if (!showSubmissionForm) return null;

    switch (mission.type) {
      case 'RECEIPT':
        return (
          <MissionReceiptForm
            mission={mission}
            userId={userId}
            onSubmissionComplete={handleSubmissionComplete}
          />
        );
      case 'REVIEW':
        return (
          <MissionReviewForm
            mission={mission}
            userId={userId}
            onSubmissionComplete={handleSubmissionComplete}
          />
        );
      case 'SOCIAL_PROOF':
        return (
          <SocialProofForm
            mission={mission}
            userId={userId}
            onSubmissionComplete={handleSubmissionComplete}
          />
        );
      default:
        return null;
    }
  };

  const getStatusBadge = () => {
    if (!participating) return null;
    
    const statusConfig = {
      'JOINED': { label: 'Joined', variant: 'secondary' as const },
      'PENDING': { label: 'Pending Review', variant: 'default' as const },
      'APPROVED': { label: 'Approved', variant: 'default' as const },
      'REJECTED': { label: 'Rejected', variant: 'destructive' as const }
    };
    
    const config = statusConfig[participationStatus as keyof typeof statusConfig];
    if (!config) return null;
    
    return <Badge variant={config.variant}>{config.label}</Badge>;
  };

  const renderActionButton = () => {
    if (!isActive) {
      return (
        <Button disabled className="w-full">
          Mission Inactive
        </Button>
      );
    }

    if (isAtSubmissionLimit) {
      return (
        <Button disabled className="w-full">
          Submission Limit Reached
        </Button>
      );
    }

    if (!participating) {
      return (
        <Button 
          onClick={handleJoinMission} 
          disabled={isJoining}
          className="w-full"
        >
          {isJoining ? 'Joining...' : 'Join Mission'}
        </Button>
      );
    }

    if (participationStatus === 'JOINED') {
      return (
        <Button 
          onClick={handleStartSubmission}
          className="w-full"
        >
          Start Submission
        </Button>
      );
    }

    if (participationStatus === 'PENDING') {
      return (
        <Button disabled className="w-full">
          Submission Under Review
        </Button>
      );
    }

    if (participationStatus === 'APPROVED') {
      return (
        <div className="flex items-center justify-center w-full p-3 bg-green-50 text-green-700 rounded-lg">
          <CheckCircle className="h-5 w-5 mr-2" />
          Mission Completed
        </div>
      );
    }

    if (participationStatus === 'REJECTED') {
      return (
        <Button 
          onClick={handleStartSubmission}
          variant="outline"
          className="w-full"
        >
          Resubmit
        </Button>
      );
    }

    return null;
  };

  return (
    <div className="space-y-6">
      {/* Mission Stats Card */}
      <div className="bg-white rounded-lg shadow-sm border p-6">
        <div className="flex items-center justify-between mb-4">
          <h3 className="text-lg font-semibold">Mission Details</h3>
          {getStatusBadge()}
        </div>
        
        <div className="grid grid-cols-2 gap-4 mb-6">
          <div className="flex items-center space-x-3">
            <Target className="h-5 w-5 text-brand-teal" />
            <div>
              <p className="text-sm text-gray-600">Reward</p>
              <p className="font-semibold">{mission.pointsReward} points</p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Users className="h-5 w-5 text-brand-teal" />
            <div>
              <p className="text-sm text-gray-600">Participants</p>
              <p className="font-semibold">
                {currentSubmissions}
                {mission.totalMaxSubmissions && ` / ${mission.totalMaxSubmissions}`}
              </p>
            </div>
          </div>
          
          <div className="flex items-center space-x-3">
            <Clock className="h-5 w-5 text-brand-teal" />
            <div>
              <p className="text-sm text-gray-600">Start Date</p>
              <p className="font-semibold">{formatDate(mission.startDate)}</p>
            </div>
          </div>
          
          {mission.expiresAt && (
            <div className="flex items-center space-x-3">
              <Clock className="h-5 w-5 text-brand-teal" />
              <div>
                <p className="text-sm text-gray-600">Expires</p>
                <p className="font-semibold">{formatDate(mission.expiresAt)}</p>
              </div>
            </div>
          )}
        </div>

        {renderActionButton()}
      </div>

      {/* Submission Form */}
      {renderSubmissionForm()}
    </div>
  );
};

export default MissionStats;
