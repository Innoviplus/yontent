
import React from 'react';
import { Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import Navbar from '@/components/Navbar';
import ResetPasswordForm from '@/components/auth/password-reset/ResetPasswordForm';

const ResetPassword = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-md">
          <div className="bg-white rounded-xl shadow-card p-8 animate-scale-in">
            <Link to="/login" className="inline-flex items-center text-brand-teal mb-6 hover:underline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Login
            </Link>
            
            <ResetPasswordForm />
          </div>
        </div>
      </div>
    </div>
  );
};

export default ResetPassword;
