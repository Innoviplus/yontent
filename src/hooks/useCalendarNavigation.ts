
import { useState, useEffect } from 'react';

interface UseCalendarNavigationProps {
  month?: Date;
  onMonthChange?: (date: Date) => void;
  onMonthSelect?: (month: number) => void;
  onYearSelect?: (year: number) => void;
}

export const useCalendarNavigation = ({
  month,
  onMonthChange,
  onMonthSelect,
  onYearSelect
}: UseCalendarNavigationProps) => {
  const [currentMonth, setCurrentMonth] = useState<Date | undefined>(
    month || new Date()
  );

  useEffect(() => {
    if (month) {
      setCurrentMonth(month);
    }
  }, [month]);

  const handleMonthChange = (monthStr: string) => {
    const monthNum = parseInt(monthStr);
    
    if (currentMonth) {
      const newDate = new Date(currentMonth);
      newDate.setMonth(monthNum);
      setCurrentMonth(newDate);
    }
    
    if (onMonthSelect) {
      onMonthSelect(monthNum);
    }
    
    if (onMonthChange && currentMonth) {
      const newDate = new Date(currentMonth);
      newDate.setMonth(monthNum);
      onMonthChange(newDate);
    }
  };

  const handleYearChange = (yearStr: string) => {
    const yearNum = parseInt(yearStr);
    
    if (currentMonth) {
      const newDate = new Date(currentMonth);
      newDate.setFullYear(yearNum);
      setCurrentMonth(newDate);
    }
    
    if (onYearSelect) {
      onYearSelect(yearNum);
    }
    
    if (onMonthChange && currentMonth) {
      const newDate = new Date(currentMonth);
      newDate.setFullYear(yearNum);
      onMonthChange(newDate);
    }
  };

  return {
    currentMonth,
    setCurrentMonth,
    handleMonthChange,
    handleYearChange
  };
};
