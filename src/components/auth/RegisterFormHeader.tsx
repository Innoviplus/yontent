
import { Star } from 'lucide-react';

const RegisterFormHeader = () => {
  return (
    <div className="text-center mb-8">
      <div className="mx-auto w-12 h-12 bg-brand-teal/10 flex items-center justify-center rounded-full mb-4">
        <Star className="h-6 w-6 text-brand-teal" />
      </div>
      <h1 className="heading-3 mb-2">Create Your Account</h1>
      <p className="text-gray-600 text-sm">
        Sign up with your phone number to start earning points
      </p>
    </div>
  );
};

export default RegisterFormHeader;
