
import { useParams, Navigate, useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MissionSubmissionLoading from '@/components/mission/MissionSubmissionLoading';
import MissionSubmissionError from '@/components/mission/MissionSubmissionError';
import MissionRequirementsList from '@/components/mission/MissionRequirementsList';
import SocialProofForm from '@/components/mission/SocialProofForm';
import { useMissionSubmission } from '@/hooks/mission/useMissionSubmission';

const MissionSocialProofSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const navigate = useNavigate();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const { mission, isLoading, error } = useMissionSubmission(id, 'SOCIAL_PROOF');

  if (isLoading) {
    return <MissionSubmissionLoading />;
  }

  if (error || !mission) {
    return <MissionSubmissionError error={error || "Social proof mission not found"} />;
  }

  const handleSubmissionComplete = (success: boolean) => {
    if (success) {
      navigate(`/mission/${mission.id}`);
    }
  };

  // Default requirements to use as fallback if no requirementDescription is provided
  const fallbackRequirements = [
    'Share your experience with the product on social media',
    'Include relevant hashtags and mentions',
    'Upload a screenshot of your social media post',
    'Accepted formats: JPG, PNG, WEBP'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Submit Proof for "{mission.title}" mission</h1>
            <p className="text-gray-500 mt-2">
              Submit the required information to complete this mission and earn {mission.pointsReward} points.
            </p>
          </CardHeader>
          
          <CardContent>
            <MissionRequirementsList 
              requirements={fallbackRequirements} 
              requirementDescription={mission.requirementDescription}
              title="Requirements:" 
            />
            
            <SocialProofForm 
              mission={mission} 
              userId={user.id}
              onSubmissionComplete={handleSubmissionComplete}
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissionSocialProofSubmission;
