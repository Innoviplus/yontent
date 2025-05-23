
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MissionSubmissionLoading from '@/components/mission/MissionSubmissionLoading';
import MissionSubmissionError from '@/components/mission/MissionSubmissionError';
import MissionRequirementsList from '@/components/mission/MissionRequirementsList';
import MissionReviewForm from '@/components/mission/review/MissionReviewForm';
import { useMissionSubmission } from '@/hooks/mission/useMissionSubmission';

const MissionReviewSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const { mission, isLoading, error } = useMissionSubmission(id, 'REVIEW');

  if (isLoading) {
    return <MissionSubmissionLoading />;
  }

  if (error || !mission) {
    return <MissionSubmissionError error={error || "Review mission not found"} />;
  }

  // Default requirements to use as fallback if no requirementDescription is provided
  const fallbackRequirements = [
    'Write an honest, detailed review of the product',
    'Upload at least one clear photo of the product',
    'You can upload up to 10 images',
    'Accepted formats: JPG, PNG, WEBP',
    'You can upload 1 video (max 60 seconds) in MP4, MOV, or WEBM format'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Submit Review for "{mission.title}"</h1>
            <p className="text-gray-500 mt-2">
              Share your experience and upload photos or video to complete this mission and earn {mission.pointsReward} points.
            </p>
          </CardHeader>
          
          <CardContent>
            <MissionRequirementsList 
              requirements={fallbackRequirements} 
              requirementDescription={mission.requirementDescription}
              title="Review Requirements:" 
            />
            
            <MissionReviewForm 
              mission={mission} 
              userId={user.id} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissionReviewSubmission;
