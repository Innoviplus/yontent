
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
import { subYears } from 'date-fns';

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
  const years = Array.from({ length: maxYear - minYear + 1 }, (_, i) => maxYear - i);
  
  // Generate months
  const months = [
    { value: 0, label: "January" },
    { value: 1, label: "February" },
    { value: 2, label: "March" },
    { value: 3, label: "April" },
    { value: 4, label: "May" },
    { value: 5, label: "June" },
    { value: 6, label: "July" },
    { value: 7, label: "August" },
    { value: 8, label: "September" },
    { value: 9, label: "October" },
    { value: 10, label: "November" },
    { value: 11, label: "December" }
  ];
  
  // Check if the user is at least 18 years old
  const isAtLeast18 = (date: Date): boolean => {
    const eighteenYearsAgo = subYears(new Date(), 18);
    return date <= eighteenYearsAgo;
  };
  
  return (
    <FormField
      control={control}
      name="birthDate"
      render={({ field }) => {
        // Extract day, month, year from the field value
        const selectedDate = field.value ? new Date(field.value) : null;
        const selectedYear = selectedDate ? selectedDate.getFullYear() : null;
        const selectedMonth = selectedDate !== null ? selectedDate.getMonth() : null;
        const selectedDay = selectedDate ? selectedDate.getDate() : null;
        
        // Calculate days in month based on selected month and year
        const getDaysInMonth = (month: number | null, year: number | null) => {
          if (month === null || year === null) return 31; // Default to 31 days
          return new Date(year, month + 1, 0).getDate();
        };
        
        const daysInMonth = getDaysInMonth(selectedMonth, selectedYear);
        const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
        
        // Handle date changes
        const handleDateChange = (type: 'day' | 'month' | 'year', value: string) => {
          const numValue = parseInt(value, 10);
          let newDate: Date;
          
          if (!selectedDate) {
            // If no date is selected, create a new date with defaults
            const now = new Date();
            if (type === 'day') {
              newDate = new Date(maxYear, 0, numValue);
            } else if (type === 'month') {
              newDate = new Date(maxYear, numValue, 1);
            } else {
              newDate = new Date(numValue, 0, 1);
            }
          } else {
            // Clone the existing date
            newDate = new Date(selectedDate);
            
            if (type === 'day') {
              newDate.setDate(numValue);
            } else if (type === 'month') {
              // Adjust day if needed to avoid invalid dates
              const currentDay = selectedDate.getDate();
              const daysInNewMonth = new Date(selectedDate.getFullYear(), numValue + 1, 0).getDate();
              if (currentDay > daysInNewMonth) {
                newDate.setDate(daysInNewMonth);
              }
              newDate.setMonth(numValue);
            } else {
              newDate.setFullYear(numValue);
            }
          }
          
          console.log("Setting new date:", newDate);
          field.onChange(newDate);
        };

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
                    {days.map((day) => (
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
