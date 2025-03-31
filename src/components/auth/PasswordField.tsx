
import { useState } from 'react';
import { Eye, EyeOff } from 'lucide-react';
import { Input } from '@/components/ui/input';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import PasswordStrengthIndicator from './PasswordStrengthIndicator';
import { RegisterFormValues } from './schemas/registerSchema';

interface PasswordFieldProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const PasswordField = ({ form }: PasswordFieldProps) => {
  const [showPassword, setShowPassword] = useState(false);
  const passwordValue = form.watch('password');
  
  return (
    <FormField
      control={form.control}
      name="password"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Password</FormLabel>
          <FormControl>
            <div className="relative">
              <Input 
                placeholder="••••••••"
                type={showPassword ? "text" : "password"}
                autoComplete="new-password"
                {...field} 
              />
              <button
                type="button"
                onClick={() => setShowPassword(!showPassword)}
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
          <PasswordStrengthIndicator password={passwordValue || ''} />
        </FormItem>
      )}
    />
  );
};
