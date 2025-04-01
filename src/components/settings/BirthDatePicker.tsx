
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
          <Popover>
            <PopoverTrigger asChild>
              <FormControl>
                <Button
                  variant={"outline"}
                  className={`w-full justify-start text-left font-normal ${
                    !field.value && "text-muted-foreground"
                  } ${disabled ? "bg-gray-100" : ""}`}
                  disabled={disabled}
                >
                  {field.value ? (
                    format(field.value, "PPP")
                  ) : (
                    <span>Pick a date</span>
                  )}
                  <CalendarIcon className="ml-auto h-4 w-4 opacity-50" />
                </Button>
              </FormControl>
            </PopoverTrigger>
            <PopoverContent className="w-auto p-0 pointer-events-auto" align="start">
              <Calendar
                mode="single"
                selected={field.value}
                onSelect={field.onChange}
                disabled={(date) =>
                  date > maxDate || date < new Date("1900-01-01")
                }
                initialFocus
                fromYear={1900}
                toYear={maxDate.getFullYear()}
                className="p-3 pointer-events-auto"
              />
            </PopoverContent>
          </Popover>
          <FormDescription>
            {disabled ? 'Date of birth cannot be changed once set.' : 'Select your date of birth.'}
          </FormDescription>
          <FormMessage />
        </FormItem>
      )}
    />
  );
};
