
import * as React from "react";
import { DayPickerCaption, useDayPicker } from "react-day-picker";
import { MonthSelect } from "./MonthSelect";
import { YearSelect } from "./YearSelect";

interface CalendarCaptionProps extends React.ComponentProps<typeof DayPickerCaption> {
  onMonthSelect?: (month: number) => void;
  onYearSelect?: (year: number) => void;
  onMonthChange?: (month: Date) => void;
}

export const CalendarCaption: React.FC<CalendarCaptionProps> = ({
  onMonthSelect,
  onYearSelect,
  onMonthChange,
  ...props
}) => {
  const { currentMonth, fromDate, toDate } = useDayPicker();
  
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
