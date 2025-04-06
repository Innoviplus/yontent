
import { useState, useEffect } from "react";
import { getDaysInMonth } from "@/utils/dateUtils";

interface UseBirthDateInputProps {
  onChange: (date: Date) => void;
  initialDate: Date | null | undefined;
}

export const useBirthDateInput = ({ onChange, initialDate }: UseBirthDateInputProps) => {
  // Extract day, month, year from the initial date
  const selectedDate = initialDate ? new Date(initialDate) : null;
  const initialYear = selectedDate ? selectedDate.getFullYear() : null;
  const initialMonth = selectedDate !== null ? selectedDate.getMonth() : null;
  const initialDay = selectedDate ? selectedDate.getDate() : null;
  
  // State for days in current month
  const [daysInMonth, setDaysInMonth] = useState<number[]>(
    Array.from({ length: getDaysInMonth(initialMonth, initialYear) }, (_, i) => i + 1)
  );
  
  // Update days in month when month or year changes
  useEffect(() => {
    if (initialYear && initialMonth !== null) {
      const daysCount = getDaysInMonth(initialMonth, initialYear);
      setDaysInMonth(Array.from({ length: daysCount }, (_, i) => i + 1));
    }
  }, [initialYear, initialMonth]);
  
  // Handle date changes
  const handleDateChange = (type: 'day' | 'month' | 'year', value: string) => {
    const numValue = parseInt(value, 10);
    
    let newDate: Date;
    const currentYear = new Date().getFullYear();
    const maxYear = currentYear - 18;
    
    if (!selectedDate) {
      // If no date is selected, create a new date with defaults
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
        const currentDay = newDate.getDate();
        const daysInNewMonth = getDaysInMonth(numValue, newDate.getFullYear());
        if (currentDay > daysInNewMonth) {
          newDate.setDate(daysInNewMonth);
        }
        newDate.setMonth(numValue);
      } else {
        newDate.setFullYear(numValue);
      }
    }
    
    onChange(newDate);
  };

  return {
    selectedYear: initialYear,
    selectedMonth: initialMonth,
    selectedDay: initialDay,
    daysInMonth,
    handleDateChange
  };
};
