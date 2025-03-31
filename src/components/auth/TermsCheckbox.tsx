
import { Link } from 'react-router-dom';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { UseFormReturn } from 'react-hook-form';
import { RegisterFormValues } from './schemas/registerSchema';

interface TermsCheckboxProps {
  form: UseFormReturn<RegisterFormValues>;
}

export const TermsCheckbox = ({ form }: TermsCheckboxProps) => {
  return (
    <FormField
      control={form.control}
      name="acceptTerms"
      render={({ field }) => (
        <FormItem className="flex items-start space-y-0 space-x-2">
          <FormControl>
            <input
              type="checkbox"
              checked={field.value}
              onChange={field.onChange}
              className="mt-0.5 h-4 w-4 text-brand-teal border-gray-300 rounded focus:ring-brand-teal focus:ring-offset-0"
            />
          </FormControl>
          <div className="space-y-1 leading-none">
            <FormLabel className="text-sm font-normal">
              I agree to the{' '}
              <Link to="/terms" className="text-brand-teal hover:underline">Terms of Service</Link>
              {' '}and{' '}
              <Link to="/privacy" className="text-brand-teal hover:underline">Privacy Policy</Link>
            </FormLabel>
            <FormMessage />
          </div>
        </FormItem>
      )}
    />
  );
};
