
import { useState, useEffect } from 'react';

interface CalendarNavigationProps {
  month?: Date;
  onMonthChange?: (month: Date) => void;
  onMonthSelect?: (month: number) => void;
  onYearSelect?: (year: number) => void;
}

export const useCalendarNavigation = ({
  month,
  onMonthChange,
  onMonthSelect,
  onYearSelect
}: CalendarNavigationProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date>(month || new Date());

  // Update internal state when month prop changes
  useEffect(() => {
    if (month) {
      setCurrentMonth(month);
    }
  }, [month]);

  // Handle month selection from dropdown
  const handleMonthChange = (value: string) => {
    const newMonth = new Date(currentMonth);
    newMonth.setMonth(parseInt(value, 10));
    setCurrentMonth(newMonth);
    
    // Call external handlers if provided
    if (onMonthChange) {
      onMonthChange(newMonth);
    }
    if (onMonthSelect) {
      onMonthSelect(parseInt(value, 10));
    }
  };

  // Handle year selection from dropdown
  const handleYearChange = (value: string) => {
    const newMonth = new Date(currentMonth);
    newMonth.setFullYear(parseInt(value, 10));
    setCurrentMonth(newMonth);
    
    // Call external handlers if provided
    if (onMonthChange) {
      onMonthChange(newMonth);
    }
    if (onYearSelect) {
      onYearSelect(parseInt(value, 10));
    }
  };

  return {
    currentMonth,
    handleMonthChange,
    handleYearChange
  };
};
