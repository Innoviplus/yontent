
import React from 'react';
import { Control } from 'react-hook-form';
import { subYears } from 'date-fns';
import {
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
  FormDescription,
} from '@/components/ui/form';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useBirthDateInput } from '@/hooks/useBirthDateInput';
import { generateYearRange, getMonthsList, isAtLeast18 } from '@/utils/dateUtils';

interface BirthDateInputProps {
  control: Control<any>;
  disabled?: boolean;
}

export const BirthDateInput: React.FC<BirthDateInputProps> = ({ control, disabled = false }) => {
  // Generate years (18 years ago to 100 years ago)
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  // Maximum year is 18 years ago from now
  const maxYear = currentYear - 18;
  const years = generateYearRange(minYear, maxYear);
  
  // Get months list
  const months = getMonthsList();

  return (
    <div className="flex flex-col space-y-4">
      <FormField
        control={control}
        name="birthDate"
        render={({ field }) => {
          const { 
            selectedYear, 
            selectedMonth, 
            selectedDay, 
            daysInMonth,
            handleDateChange 
          } = useBirthDateInput({
            onChange: field.onChange,
            initialDate: field.value,
            maxYear: maxYear // Pass max year to prevent future dates
          });

          return (
            <FormItem className="space-y-2">
              <FormLabel>Date of Birth</FormLabel>
              <div className="flex gap-2">
                {/* Month Dropdown - Increased width for longer month names */}
                <div className="w-[45%]">
                  <Select
                    value={selectedMonth?.toString() ?? ""}
                    onValueChange={(value) => handleDateChange('month', value)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                    <SelectContent>
                      {months.map((month) => (
                        <SelectItem key={month.value} value={month.value.toString()}>
                          {month.label}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Day Dropdown */}
                <div className="w-[25%]">
                  <Select
                    value={selectedDay?.toString() ?? ""}
                    onValueChange={(value) => handleDateChange('day', value)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                    <SelectContent>
                      {daysInMonth.map((day) => (
                        <SelectItem key={day} value={day.toString()}>
                          {day}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                
                {/* Year Dropdown */}
                <div className="w-[30%]">
                  <Select
                    value={selectedYear?.toString() ?? ""}
                    onValueChange={(value) => handleDateChange('year', value)}
                    disabled={disabled}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                    <SelectContent>
                      {years.map((year) => (
                        <SelectItem key={year} value={year.toString()}>
                          {year}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              </div>
              
              <FormDescription>
                You must be at least 18 years old to use this service.
              </FormDescription>
              
              {field.value && !isAtLeast18(new Date(field.value)) && (
                <p className="text-sm font-medium text-destructive">
                  You must be at least 18 years old.
                </p>
              )}
              
              <FormMessage />
            </FormItem>
          );
        }}
      />
    </div>
  );
};
