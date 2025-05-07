
import React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { 
  Select,
  SelectContent,
  SelectItem, 
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Button } from "@/components/ui/button";
import { CaptionProps } from "react-day-picker";
import { useCalendarNavigation } from "@/hooks/useCalendarNavigation";

// Extend the CaptionProps interface to include our custom properties
interface ExtendedCaptionProps extends CaptionProps {
  onMonthSelect?: (month: number) => void;
  onYearSelect?: (year: number) => void;
}

export function CalendarCaption(props: ExtendedCaptionProps) {
  const { currentMonth, handleMonthChange, handleYearChange } = useCalendarNavigation({
    month: props.displayMonth,
    onMonthChange: (newMonth) => {
      if (props.onMonthChange) {
        props.onMonthChange(newMonth);
      }
    },
    onMonthSelect: props.onMonthSelect,
    onYearSelect: props.onYearSelect,
  });
  
  // Generate years array for dropdown (from 1900 to 10 years into the future)
  const currentYear = new Date().getFullYear();
  const years = Array.from({ length: currentYear - 1900 + 11 }, (_, i) => 1900 + i);
  
  // Get month names for dropdown
  const monthNames = [
    "January", "February", "March", "April", "May", "June", 
    "July", "August", "September", "October", "November", "December"
  ];

  return (
    <div className="flex justify-center items-center pt-1 relative w-full">
      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 absolute left-1 opacity-50 hover:opacity-100"
        onClick={() => {
          const newMonth = new Date(currentMonth);
          newMonth.setMonth(currentMonth.getMonth() - 1);
          if (props.onMonthChange) {
            props.onMonthChange(newMonth);
          }
        }}
      >
        <ChevronLeft className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-1">
        <Select
          value={currentMonth.getMonth().toString()}
          onValueChange={handleMonthChange}
        >
          <SelectTrigger className="h-7 text-xs border-none shadow-none bg-transparent focus:ring-0">
            <SelectValue>{monthNames[currentMonth.getMonth()]}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {monthNames.map((month, index) => (
              <SelectItem key={index} value={index.toString()} className="text-xs">
                {month}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
        
        <Select
          value={currentMonth.getFullYear().toString()}
          onValueChange={handleYearChange}
        >
          <SelectTrigger className="h-7 text-xs w-[75px] border-none shadow-none bg-transparent focus:ring-0">
            <SelectValue>{currentMonth.getFullYear()}</SelectValue>
          </SelectTrigger>
          <SelectContent className="max-h-80">
            {years.map((year) => (
              <SelectItem key={year} value={year.toString()} className="text-xs">
                {year}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <Button
        variant="ghost"
        size="icon"
        className="h-7 w-7 absolute right-1 opacity-50 hover:opacity-100"
        onClick={() => {
          const newMonth = new Date(currentMonth);
          newMonth.setMonth(currentMonth.getMonth() + 1);
          if (props.onMonthChange) {
            props.onMonthChange(newMonth);
          }
        }}
      >
        <ChevronRight className="h-4 w-4" />
      </Button>
    </div>
  );
}
