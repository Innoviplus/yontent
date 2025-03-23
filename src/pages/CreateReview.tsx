
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';
import { useEffect } from 'react';

// This component is just for redirection now since we've renamed to SubmitReview
const CreateReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  useEffect(() => {
    // Redirect to the proper page
    navigate('/submit-review', { replace: true });
  }, [navigate]);

  return null;
};

export default CreateReview;
