
import { useParams, Navigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import Navbar from '@/components/Navbar';
import { Card, CardContent, CardHeader } from '@/components/ui/card';
import MissionSubmissionLoading from '@/components/mission/MissionSubmissionLoading';
import MissionSubmissionError from '@/components/mission/MissionSubmissionError';
import MissionRequirementsList from '@/components/mission/MissionRequirementsList';
import MissionReceiptForm from '@/components/mission/MissionReceiptForm';
import { useMissionSubmission } from '@/hooks/mission/useMissionSubmission';

const MissionReceiptSubmission = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  
  // Redirect if user is not logged in
  if (!user) {
    return <Navigate to="/login" replace />;
  }
  
  const { mission, isLoading, error } = useMissionSubmission(id, 'RECEIPT');

  if (isLoading) {
    return <MissionSubmissionLoading />;
  }

  if (error || !mission) {
    return <MissionSubmissionError error={error || "Receipt mission not found"} />;
  }

  const receiptRequirements = [
    'Clear, readable photos of your receipt',
    'Make sure the store name, date, and purchased items are visible',
    'You can upload up to 10 images',
    'Accepted formats: JPG, PNG, WEBP'
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="container mx-auto px-4 pt-28 pb-16 max-w-3xl">
        <Card>
          <CardHeader>
            <h1 className="text-2xl font-bold">Submit Receipt for "{mission.title}"</h1>
            <p className="text-gray-500 mt-2">
              Upload photos of your purchase receipt to complete this mission and earn {mission.pointsReward} points.
            </p>
          </CardHeader>
          
          <CardContent>
            <MissionRequirementsList 
              requirements={receiptRequirements} 
              title="Receipt Requirements:" 
            />
            
            <MissionReceiptForm 
              mission={mission} 
              userId={user.id} 
            />
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MissionReceiptSubmission;
