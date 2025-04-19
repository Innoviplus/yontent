
import { Eye, EyeOff } from 'lucide-react';
import { FormControl, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { UseFormReturn } from 'react-hook-form';
import { PhoneSignUpFormValues } from '@/hooks/auth/usePhoneSignUpForm';

interface PasswordInputProps {
  form: UseFormReturn<PhoneSignUpFormValues>;
  showPassword: boolean;
  onTogglePassword: () => void;
}

const PasswordInput = ({ form, showPassword, onTogglePassword }: PasswordInputProps) => {
  return (
    <FormItem>
      <FormLabel>Password</FormLabel>
      <FormControl>
        <div className="relative">
          <Input
            {...form.register('password')}
            type={showPassword ? "text" : "password"}
            placeholder="Choose a password"
          />
          <button
            type="button"
            onClick={onTogglePassword}
            className="absolute right-3 top-1/2 -translate-y-1/2 text-gray-500 hover:text-gray-700"
          >
            {showPassword ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
          </button>
        </div>
      </FormControl>
      <FormMessage />
    </FormItem>
  );
};

export default PasswordInput;
