
import React from 'react';
import { Control } from 'react-hook-form';
import { format, subYears } from 'date-fns';
import { CalendarIcon } from 'lucide-react';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import { Button } from '@/components/ui/button';
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover';
import { Calendar } from '@/components/ui/calendar';
import { DatePicker } from '@/components/ui/date-picker';

interface BirthDatePickerProps {
  control: Control<any>;
  disabled?: boolean;
}

export const BirthDatePicker: React.FC<BirthDatePickerProps> = ({ control, disabled = false }) => {
  // Calculate date for 18 years ago from today
  const maxDate = subYears(new Date(), 18);
  
  return (
    <FormField
      control={control}
      name="birthDate"
      render={({ field }) => (
        <FormItem className="flex flex-col">
          <FormLabel>Date of Birth</FormLabel>
          <DatePicker
            value={field.value}
            onChange={field.onChange}
            placeholder="Pick a date"
            disabled={disabled}
            fromYear={1900}
            toYear={maxDate.getFullYear()}
          />
          <FormDescription>
            {disabled ? 'Date of birth cannot be changed once set.' : 'Select your date of birth.'}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
