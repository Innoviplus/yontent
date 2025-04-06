
import React from 'react';
import { Eye, EyeOff } from 'lucide-react';

interface PasswordVisibilityToggleProps {
  showPassword: boolean;
  toggleVisibility: () => void;
}

const PasswordVisibilityToggle: React.FC<PasswordVisibilityToggleProps> = ({
  showPassword,
  toggleVisibility
}) => {
  return (
    <button
      type="button"
      onClick={toggleVisibility}
      className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
    >
      {showPassword ? (
        <EyeOff className="h-4 w-4" />
      ) : (
        <Eye className="h-4 w-4" />
      )}
    </button>
  );
};

export default PasswordVisibilityToggle;
