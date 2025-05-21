
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
      setCurrentMonth(new Date(month));
    }
  }, [month]);

  // Handle month selection from dropdown
  const handleMonthChange = (value: string) => {
    const monthValue = parseInt(value, 10);
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthValue);
    
    // Update internal state
    setCurrentMonth(newDate);
    
    // Call external handlers if provided
    if (onMonthChange) {
      onMonthChange(newDate);
    }
    if (onMonthSelect) {
      onMonthSelect(monthValue);
    }
    
    console.log('Month changed to:', newDate.toISOString(), 'Month index:', monthValue);
  };

  // Handle year selection from dropdown
  const handleYearChange = (value: string) => {
    const yearValue = parseInt(value, 10);
    const newDate = new Date(currentMonth);
    newDate.setFullYear(yearValue);
    
    // Update internal state
    setCurrentMonth(newDate);
    
    // Call external handlers if provided
    if (onMonthChange) {
      onMonthChange(newDate);
    }
    if (onYearSelect) {
      onYearSelect(yearValue);
    }
    
    console.log('Year changed to:', newDate.toISOString(), 'Year value:', yearValue);
  };

  return {
    currentMonth,
    handleMonthChange,
    handleYearChange
  };
};
