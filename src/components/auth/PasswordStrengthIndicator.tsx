
import { Check } from 'lucide-react';

interface PasswordValidationProps {
  password: string;
}

interface ValidationResult {
  minLength: boolean;
  hasNumber: boolean;
  hasSpecial: boolean;
  isValid: boolean;
}

export const validatePassword = (password: string): ValidationResult => {
  const minLength = password.length >= 8;
  const hasNumber = /\d/.test(password);
  const hasSpecial = /[!@#$%^&*(),.?":{}|<>]/.test(password);
  
  return {
    minLength,
    hasNumber,
    hasSpecial,
    isValid: minLength && hasNumber && hasSpecial
  };
};

const PasswordStrengthIndicator = ({ password }: PasswordValidationProps) => {
  const passwordValidation = validatePassword(password || '');
  
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
