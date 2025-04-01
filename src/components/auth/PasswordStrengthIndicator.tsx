
import React from 'react';
import { Check } from 'lucide-react';

interface PasswordValidationResult {
  minLength: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

interface PasswordStrengthIndicatorProps {
  passwordValidation: PasswordValidationResult;
}

const PasswordStrengthIndicator: React.FC<PasswordStrengthIndicatorProps> = ({ passwordValidation }) => {
  return (
    <div className="mt-3 space-y-2">
      <div className="flex items-center gap-2 text-xs">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center
            ${passwordValidation.minLength ? 'bg-brand-teal text-white' : 'bg-gray-200'}`}
        >
          {passwordValidation.minLength && <Check className="h-3 w-3" />}
        </div>
        <span className={passwordValidation.minLength ? 'text-brand-teal' : 'text-gray-500'}>
          At least 8 characters
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center
            ${passwordValidation.hasNumber ? 'bg-brand-teal text-white' : 'bg-gray-200'}`}
        >
          {passwordValidation.hasNumber && <Check className="h-3 w-3" />}
        </div>
        <span className={passwordValidation.hasNumber ? 'text-brand-teal' : 'text-gray-500'}>
          At least 1 number
        </span>
      </div>
      
      <div className="flex items-center gap-2 text-xs">
        <div className={`w-4 h-4 rounded-full flex items-center justify-center
            ${passwordValidation.hasSpecial ? 'bg-brand-teal text-white' : 'bg-gray-200'}`}
        >
          {passwordValidation.hasSpecial && <Check className="h-3 w-3" />}
        </div>
        <span className={passwordValidation.hasSpecial ? 'text-brand-teal' : 'text-gray-500'}>
          At least 1 special character
        </span>
      </div>
    </div>
  );
};

export default PasswordStrengthIndicator;
