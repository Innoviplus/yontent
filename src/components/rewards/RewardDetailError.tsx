
import React from 'react';
import { useNavigate } from 'react-router-dom';
import { AlertCircle } from 'lucide-react';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { Button } from '@/components/ui/button';

const RewardDetailError: React.FC = () => {
  const navigate = useNavigate();
  
  return (
    <>
      <Alert variant="destructive">
        <AlertCircle className="h-4 w-4" />
        <AlertTitle>Error</AlertTitle>
        <AlertDescription>
          Reward not found. Please return to the rewards page.
        </AlertDescription>
      </Alert>
      <Button 
        onClick={() => navigate('/redeem')}
        className="mt-4"
      >
        Back to Rewards
      </Button>
    </>
  );
};

export default RewardDetailError;
