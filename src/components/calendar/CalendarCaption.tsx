
import * as React from "react";
import { useDayPicker } from "react-day-picker";
import { MonthSelect } from "./MonthSelect";
import { YearSelect } from "./YearSelect";

interface CalendarCaptionProps {
  onMonthSelect?: (month: number) => void;
  onYearSelect?: (year: number) => void;
  onMonthChange?: (month: Date) => void;
}

export const CalendarCaption: React.FC<CalendarCaptionProps> = ({
  onMonthSelect,
  onYearSelect,
  onMonthChange,
}) => {
  const context = useDayPicker();
  
  if (!context || !context.month) {
    return null;
  }
  
  const currentMonth = context.month;
  
  const handleMonthChange = (value: string) => {
    const monthNum = parseInt(value);
    const newDate = new Date(currentMonth);
    newDate.setMonth(monthNum);
    
    if (onMonthSelect) {
      onMonthSelect(monthNum);
    }
    
    if (onMonthChange) {
      onMonthChange(newDate);
    }
    
    // Fix: Use toMonth instead of goToMonth
    if (context.toMonth) {
      context.toMonth(newDate);
    }
  };
  
  const handleYearChange = (value: string) => {
    const yearNum = parseInt(value);
    const newDate = new Date(currentMonth);
    newDate.setFullYear(yearNum);
    
    if (onYearSelect) {
      onYearSelect(yearNum);
    }
    
    if (onMonthChange) {
      onMonthChange(newDate);
    }
    
    // Fix: Use toMonth instead of goToMonth
    if (context.toMonth) {
      context.toMonth(newDate);
    }
  };

  return (
    <div className="flex justify-center items-center space-x-1">
      <MonthSelect 
        value={currentMonth.getMonth().toString()} 
        onValueChange={handleMonthChange}
        displayMonth={currentMonth}
      />
      <YearSelect 
        value={currentMonth.getFullYear().toString()} 
        onValueChange={handleYearChange}
        displayMonth={currentMonth}
      />
    </div>
  );
};
