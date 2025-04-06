
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { BirthDatePicker } from './BirthDatePicker';
import { Control } from 'react-hook-form';

interface BirthDateInputProps {
  control: Control<any>;
  disabled?: boolean;
}

export const BirthDateInput: React.FC<BirthDateInputProps> = ({ 
  control,
  disabled = false 
}) => {
  return (
    <FormField
      control={control}
      name="birthDate"
      render={({ field }) => (
        <FormItem>
          <FormLabel>Birth Date</FormLabel>
          <FormControl>
            <BirthDatePicker 
              date={field.value} 
              setDate={field.onChange}
              disabled={disabled}
            />
          </FormControl>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
