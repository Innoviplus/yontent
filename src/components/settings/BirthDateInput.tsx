
import React from 'react';
import { FormControl, FormField, FormItem, FormLabel, FormMessage } from '@/components/ui/form';
import { Control } from 'react-hook-form';
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

export const BirthDateInput: React.FC<BirthDateInputProps> = ({ 
  control,
  disabled = false 
}) => {
  // Generate years (18 years ago to 100 years ago)
  const currentYear = new Date().getFullYear();
  const minYear = currentYear - 100;
  const maxYear = currentYear - 18;
  const years = generateYearRange(minYear, maxYear);
  
  // Get months list
  const months = getMonthsList();
  
  return (
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
          initialDate: field.value
        });
        
        return (
          <FormItem>
            <FormLabel>Date of Birth</FormLabel>
            <div className="flex flex-col sm:flex-row gap-2">
              {/* Month Dropdown */}
              <div className="w-full sm:w-1/3">
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
              <div className="w-full sm:w-1/3">
                <Select
                  value={selectedDay?.toString() ?? ""}
                  onValueChange={(value) => handleDateChange('day', value)}
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
              <div className="w-full sm:w-1/3">
                <Select
                  value={selectedYear?.toString() ?? ""}
                  onValueChange={(value) => handleDateChange('year', value)}
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
            
            {field.value && !isAtLeast18(new Date(field.value)) && (
              <p className="text-sm font-medium text-destructive mt-2">
                You must be at least 18 years old.
              </p>
            )}
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
