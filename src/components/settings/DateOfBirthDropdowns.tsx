
import React, { useState, useEffect } from 'react';
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
import { cn } from '@/lib/utils';

interface DateOfBirthDropdownsProps {
  control: Control<any>;
  disabled?: boolean;
}

export const DateOfBirthDropdowns: React.FC<DateOfBirthDropdownsProps> = ({ 
  control, 
  disabled = false 
}) => {
  // Calculate minimum date of birth (18 years ago)
  const minAgeDate = subYears(new Date(), 18);
  
  // Generate arrays for days, months, and years
  const days = Array.from({ length: 31 }, (_, i) => i + 1);
  const months = [
    { value: 1, label: 'January' },
    { value: 2, label: 'February' },
    { value: 3, label: 'March' },
    { value: 4, label: 'April' },
    { value: 5, label: 'May' },
    { value: 6, label: 'June' },
    { value: 7, label: 'July' },
    { value: 8, label: 'August' },
    { value: 9, label: 'September' },
    { value: 10, label: 'October' },
    { value: 11, label: 'November' },
    { value: 12, label: 'December' },
  ];
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 1 }, (_, i) => currentYear - i);
  
  // State to track selected values
  const [selectedDay, setSelectedDay] = useState<number | null>(null);
  const [selectedMonth, setSelectedMonth] = useState<number | null>(null);
  const [selectedYear, setSelectedYear] = useState<number | null>(null);
  
  // Check if the selected date is valid
  const isValidDate = (year: number, month: number, day: number) => {
    const date = new Date(year, month - 1, day);
    return date.getDate() === day && 
           date.getMonth() === month - 1 && 
           date.getFullYear() === year;
  };
  
  // Get max days based on month and year
  const getMaxDaysInMonth = (month: number, year: number) => {
    return new Date(year, month, 0).getDate();
  };
  
  // Filter available days based on selected month and year
  const getAvailableDays = () => {
    if (!selectedMonth || !selectedYear) return days;
    const maxDays = getMaxDaysInMonth(selectedMonth, selectedYear);
    return Array.from({ length: maxDays }, (_, i) => i + 1);
  };
  
  return (
    <FormField
      control={control}
      name="birthDate"
      render={({ field }) => {
        // Initialize dropdown values when field.value exists
        useEffect(() => {
          if (field.value && field.value instanceof Date) {
            setSelectedDay(field.value.getDate());
            setSelectedMonth(field.value.getMonth() + 1);
            setSelectedYear(field.value.getFullYear());
          }
        }, [field.value]);
        
        // Update the date when dropdowns change
        const updateDate = (day: number | null, month: number | null, year: number | null) => {
          if (day && month && year) {
            if (isValidDate(year, month, day)) {
              const newDate = new Date(year, month - 1, day);
              field.onChange(newDate);
              
              // Check if under 18
              if (newDate > minAgeDate) {
                return "You must be at least 18 years old";
              }
            } else {
              // Reset the field if invalid date
              field.onChange(undefined);
            }
          } else {
            // Reset if any part is missing
            field.onChange(undefined);
          }
          return null;
        };
        
        const availableDays = getAvailableDays();
        
        return (
          <FormItem className="flex flex-col">
            <FormLabel>Date of Birth</FormLabel>
            <div className="flex flex-row gap-2">
              <div className="w-1/3">
                <Select
                  disabled={disabled}
                  value={selectedMonth?.toString() || ""}
                  onValueChange={(value) => {
                    const month = parseInt(value);
                    setSelectedMonth(month);
                    updateDate(selectedDay, month, selectedYear);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className={cn(disabled ? "bg-gray-100" : "")}>
                      <SelectValue placeholder="Month" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="pointer-events-auto">
                    {months.map(month => (
                      <SelectItem key={month.value} value={month.value.toString()}>
                        {month.label}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-1/4">
                <Select
                  disabled={disabled || !selectedMonth}
                  value={selectedDay?.toString() || ""}
                  onValueChange={(value) => {
                    const day = parseInt(value);
                    setSelectedDay(day);
                    updateDate(day, selectedMonth, selectedYear);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className={cn(disabled ? "bg-gray-100" : "")}>
                      <SelectValue placeholder="Day" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="pointer-events-auto max-h-60">
                    {availableDays.map(day => (
                      <SelectItem key={day} value={day.toString()}>
                        {day}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
              
              <div className="w-5/12">
                <Select
                  disabled={disabled}
                  value={selectedYear?.toString() || ""}
                  onValueChange={(value) => {
                    const year = parseInt(value);
                    setSelectedYear(year);
                    updateDate(selectedDay, selectedMonth, year);
                  }}
                >
                  <FormControl>
                    <SelectTrigger className={cn(disabled ? "bg-gray-100" : "")}>
                      <SelectValue placeholder="Year" />
                    </SelectTrigger>
                  </FormControl>
                  <SelectContent className="pointer-events-auto max-h-60">
                    {years.map(year => (
                      <SelectItem key={year} value={year.toString()}>
                        {year}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>
            </div>
            <FormDescription>
              {disabled 
                ? 'Date of birth cannot be changed once set.' 
                : 'Select your date of birth. You must be at least 18 years old.'}
            </FormDescription>
            <FormMessage />
          </FormItem>
        );
      }}
    />
  );
};
