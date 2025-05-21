
import React from 'react';
import { useCalendarNavigation } from '@/hooks/useCalendarNavigation';
import { Button } from '@/components/ui/button';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { MonthSelect } from './MonthSelect';
import { YearSelect } from './YearSelect';
import { getMonthsList } from '@/utils/dateUtils';

interface CalendarCaptionProps {
  displayMonth: Date;
  onMonthChange: (date: Date) => void;
  onMonthSelect?: (month: number) => void;
  onYearSelect?: (year: number) => void;
}

export function CalendarCaption({
  displayMonth,
  onMonthChange,
  onMonthSelect,
  onYearSelect
}: CalendarCaptionProps) {
  const { currentMonth, handleMonthChange, handleYearChange } = useCalendarNavigation({
    month: displayMonth,
    onMonthChange,
    onMonthSelect,
    onYearSelect
  });
  
  const monthsList = getMonthsList();
  const currentYear = currentMonth.getFullYear();
  const currentMonthIndex = currentMonth.getMonth();
  
  // Generate year range (10 years back and 10 years forward)
  const startYear = currentYear - 10;
  const endYear = currentYear + 10;
  const years = Array.from(
    { length: endYear - startYear + 1 }, 
    (_, i) => startYear + i
  );

  const handlePreviousMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() - 1);
    onMonthChange(date);
  };

  const handleNextMonth = () => {
    const date = new Date(currentMonth);
    date.setMonth(date.getMonth() + 1);
    onMonthChange(date);
  };

  return (
    <div className="flex justify-center pt-1 relative items-center">
      <Button
        className="absolute left-1 h-7 w-7 p-0"
        onClick={handlePreviousMonth}
        variant="outline"
        size="icon"
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex gap-1">
        <MonthSelect 
          months={monthsList} 
          selectedMonth={currentMonthIndex}
          onChange={handleMonthChange}
        />
        <YearSelect 
          years={years} 
          selectedYear={currentYear}
          onChange={handleYearChange}
        />
      </div>
      
      <Button
        className="absolute right-1 h-7 w-7 p-0"
        onClick={handleNextMonth}
        variant="outline"
        size="icon"
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
