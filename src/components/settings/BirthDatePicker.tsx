
import React, { useEffect } from 'react';
import { Calendar } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { Button } from '@/components/ui/button';
import { cn } from '@/lib/utils';
import { format } from 'date-fns';
import { CalendarIcon } from 'lucide-react';

interface BirthDatePickerProps {
  date?: Date | null;
  setDate: (date: Date | undefined) => void;
  disabled?: boolean;
}

export const BirthDatePicker: React.FC<BirthDatePickerProps> = ({ 
  date, 
  setDate,
  disabled = false 
}) => {
  // Calculate date ranges
  const today = new Date();
  const from = new Date();
  from.setFullYear(today.getFullYear() - 100); // 100 years ago
  const to = new Date();
  to.setFullYear(today.getFullYear() - 18); // 18 years ago

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            "w-full justify-start text-left font-normal",
            !date && "text-muted-foreground"
          )}
          disabled={disabled}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {date ? format(date, "PPP") : <span>Pick a date</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date || undefined}
          onSelect={setDate}
          disabled={disabled || { 
            from: new Date(0), 
            to: from,
            after: to
          }}
          initialFocus
          captionLayout="dropdown-buttons"
          fromYear={from.getFullYear()}
          toYear={to.getFullYear()}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
};
