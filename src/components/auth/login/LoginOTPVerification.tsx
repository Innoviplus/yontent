
import { Star } from 'lucide-react';
import Navbar from '@/components/Navbar';
import OTPVerification from '@/components/auth/OTPVerification';

interface LoginOTPVerificationProps {
  phoneNumber: string;
  onVerify: (otp: string) => Promise<void>;
  onResend: () => Promise<void>;
  onCancel: () => void;
}

const LoginOTPVerification = ({ 
  phoneNumber, 
  onVerify, 
  onResend, 
  onCancel 
}: LoginOTPVerificationProps) => {
  return (
    <div className="min-h-screen bg-gray-50">
      <Navbar />
      <div className="pt-24 pb-16">
        <div className="container mx-auto px-4 sm:px-6 max-w-md">
          <div className="bg-white rounded-xl shadow-card p-8 animate-scale-in">
            <div className="text-center mb-8">
              <div className="mx-auto w-12 h-12 bg-brand-teal/10 flex items-center justify-center rounded-full mb-4">
                <Star className="h-6 w-6 text-brand-teal" />
              </div>
              <h1 className="heading-3 mb-2">Verify Your Phone</h1>
              <p className="text-gray-600 text-sm">
                Enter the verification code sent to {phoneNumber}
              </p>
            </div>

            <OTPVerification
              phoneNumber={phoneNumber}
              onVerify={onVerify}
              onResend={onResend}
              onCancel={onCancel}
            />

            <div className="mt-6 text-center">
              <button
                onClick={onCancel}
                className="text-sm text-gray-500 hover:text-gray-700"
              >
                Back to login
              </button>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default LoginOTPVerification;
