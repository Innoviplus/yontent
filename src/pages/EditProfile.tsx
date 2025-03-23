
import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/contexts/AuthContext';

const EditProfile = () => {
  const { user } = useAuth();
  const navigate = useNavigate();
  
  // Use useEffect for navigation
  useEffect(() => {
    if (!user) {
      navigate('/login');
    }
  }, [user, navigate]);

  // Return JSX element instead of calling navigate directly
  if (!user) {
    return null; // Return null while redirecting
  }

  return (
    <div className="container mx-auto py-8 px-4">
      <h1 className="text-2xl font-bold mb-4">Edit Profile</h1>
      <p className="text-gray-500">
        This page is under construction. Edit profile functionality will be available soon.
      </p>
    </div>
  );
};

export default EditProfile;
