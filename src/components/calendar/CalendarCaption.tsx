
import * as React from "react";
import { MonthSelect } from "./MonthSelect";
import { YearSelect } from "./YearSelect";
import { CaptionProps } from "react-day-picker";

interface CalendarCaptionProps extends CaptionProps {
  onMonthSelect?: (month: number) => void;
  onYearSelect?: (year: number) => void;
  onMonthChange?: (date: Date) => void;
}

export const CalendarCaption: React.FC<CalendarCaptionProps> = ({
  displayMonth,
  onMonthSelect,
  onYearSelect,
  onMonthChange
}) => {
  const handleMonthChange = (monthStr: string) => {
    const monthNum = parseInt(monthStr);
    
    if (onMonthSelect) {
      onMonthSelect(monthNum);
    }
    
    if (onMonthChange) {
      const newDate = new Date(displayMonth);
      newDate.setMonth(monthNum);
      onMonthChange(newDate);
    }
  };

  const handleYearChange = (yearStr: string) => {
    const yearNum = parseInt(yearStr);
    
    if (onYearSelect) {
      onYearSelect(yearNum);
    }
    
    if (onMonthChange) {
      const newDate = new Date(displayMonth);
      newDate.setFullYear(yearNum);
      onMonthChange(newDate);
    }
  };

  return (
    <div className="flex justify-center space-x-2 py-1 w-full">
      <MonthSelect
        value={displayMonth.getMonth().toString()}
        onValueChange={handleMonthChange}
        displayMonth={displayMonth}
      />
      <YearSelect
        value={displayMonth.getFullYear().toString()}
        onValueChange={handleYearChange}
        displayMonth={displayMonth}
      />
    </div>
  );
};
