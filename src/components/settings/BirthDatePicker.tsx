import React, { useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface BirthDatePickerProps {
  value?: Date | null;
  onChange: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const BirthDatePicker: React.FC<BirthDatePickerProps> = ({ 
  value, 
  onChange,
  disabled = false 
}) => {
  // Calculate date ranges
  const today = new Date();
  const from = new Date();
  from.setFullYear(today.getFullYear() - 100); // 100 years ago
  const to = new Date();
  to.setFullYear(today.getFullYear() - 18); // 18 years ago

  // State to keep track of the current display month in the calendar
  const [displayMonth, setDisplayMonth] = React.useState<Date | undefined>(
    value ? new Date(value) : undefined
  );

  // Update displayMonth when value changes
  useEffect(() => {
    if (value) {
      setDisplayMonth(new Date(value));
    }
  }, [value]);

  // Custom month/year change handler to ensure the onChange is called
  const handleMonthChange = (date: Date) => {
    console.log("Month/year changed to:", date);
    setDisplayMonth(date);
    
    // If there's already a selected date, update it with the new month/year
    if (value) {
      const newDate = new Date(value);
      newDate.setFullYear(date.getFullYear(), date.getMonth());
      console.log("Updating selected date to:", newDate);
      onChange(newDate);
    } else {
      // If no date is selected, select this one
      console.log("No previous date, selecting new date:", date);
      onChange(date);
    }
  };

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={onChange}
          disabled={disabled || { 
            from: new Date(0), 
            to: from,
            after: to
          }}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={from.getFullYear()}
          toYear={to.getFullYear()}
          onMonthChange={handleMonthChange}
          defaultMonth={displayMonth || value || undefined}
          month={displayMonth}
          onMonthSelect={(newMonth) => {
            if (displayMonth) {
              const newDate = new Date(displayMonth);
              newDate.setMonth(newMonth);
              handleMonthChange(newDate);
            }
          }}
          onYearSelect={(newYear) => {
            if (displayMonth) {
              const newDate = new Date(displayMonth);
              newDate.setFullYear(newYear);
              handleMonthChange(newDate);
            }
          }}
        />
      </PopoverContent>
    </Popover>
  );
};
