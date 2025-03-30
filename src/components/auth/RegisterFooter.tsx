
import { Link } from 'react-router-dom';
import { Lock } from 'lucide-react';

const RegisterFooter = () => {
  return (
    <>
      <div className="mt-6 flex items-center gap-2 text-sm text-gray-600">
        <Lock className="h-4 w-4 text-brand-slate" />
        <span>Your data is securely encrypted and never shared.</span>
      </div>
      
      <div className="mt-8 pt-6 border-t border-gray-100 text-center">
        <p className="text-sm text-gray-600">
          Already have an account?{' '}
          <Link 
            to="/login" 
            className="font-medium text-brand-teal hover:text-brand-darkTeal transition-colors"
          >
            Sign in
          </Link>
        </p>
      </div>
    </>
  );
};

export default RegisterFooter;
