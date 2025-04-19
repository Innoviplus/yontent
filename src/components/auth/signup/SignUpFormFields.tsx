
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { UseFormReturn } from 'react-hook-form';
import { PhoneSignUpFormValues } from '@/hooks/auth/usePhoneSignUpForm';
import PhoneNumberInput from '../PhoneNumberInput';
import PasswordInput from './PasswordInput';

interface SignUpFormFieldsProps {
  form: UseFormReturn<PhoneSignUpFormValues>;
  userCountry: string;
  showPassword: boolean;
  isSubmitting: boolean;
  onTogglePassword: () => void;
}

const SignUpFormFields = ({
  form,
  userCountry,
  showPassword,
  isSubmitting,
  onTogglePassword
}: SignUpFormFieldsProps) => {
  return (
    <>
      <FormField
        control={form.control}
        name="username"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Username</FormLabel>
            <FormControl>
              <Input {...field} placeholder="Choose a username" />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="email"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Email Address</FormLabel>
            <FormControl>
              <Input 
                {...field} 
                placeholder="Enter your email address" 
                type="email" 
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />

      <FormField
        control={form.control}
        name="password"
        render={() => (
          <PasswordInput
            form={form}
            showPassword={showPassword}
            onTogglePassword={onTogglePassword}
          />
        )}
      />

      <FormField
        control={form.control}
        name="phone"
        render={({ field }) => (
          <FormItem>
            <FormLabel>Phone Number</FormLabel>
            <FormControl>
              <PhoneNumberInput
                value={field.value}
                onChange={field.onChange}
                defaultCountry={userCountry}
              />
            </FormControl>
            <FormMessage />
          </FormItem>
        )}
      />
      
      <Button 
        type="submit" 
        className="w-full bg-brand-teal hover:bg-brand-darkTeal" 
        disabled={isSubmitting}
      >
        {isSubmitting ? 'Processing...' : 'Continue'}
      </Button>
    </>
  );
};

export default SignUpFormFields;
