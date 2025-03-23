
import { useState } from 'react';
import { useNavigate, useParams } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const EditReview = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  const { id } = useParams<{ id: string }>();
  
  if (!user) {
    return navigate('/login');
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Edit Review #{id}</h1>
      <p className="text-gray-500">
        This page is under construction. Review editing functionality will be available soon.
      </p>
    </div>
  );
};

export default EditReview;
