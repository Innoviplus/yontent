
import * as React from "react";
import { format } from "date-fns";
import { Calendar as CalendarIcon } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";

interface DatePickerProps {
  value: Date | null;
  onChange: (date: Date | null) => void;
  placeholder?: string;
  disabled?: boolean;
  fromYear?: number;
  toYear?: number;
}

export function DatePicker({ 
  value, 
  onChange, 
  placeholder = "Select date", 
  disabled = false,
  fromYear,
  toYear
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);
  
  const handleSelect = (date: Date | undefined) => {
    onChange(date || null);
    setOpen(false);
  };
  
  return (
    <Popover open={open && !disabled} onOpenChange={disabled ? undefined : setOpen}>
      <PopoverTrigger asChild>
        <Button
          variant={"outline"}
          className={cn(
            "w-full justify-start text-left font-normal",
            !value && "text-muted-foreground",
            disabled && "opacity-50 cursor-not-allowed"
          )}
          disabled={disabled}
          onClick={() => !disabled && setOpen(!open)}
        >
          <CalendarIcon className="mr-2 h-4 w-4" />
          {value ? format(value, "PPP") : <span>{placeholder}</span>}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0 z-50" align="start">
        <Calendar
          mode="single"
          selected={value || undefined}
          onSelect={handleSelect}
          initialFocus
          disabled={(date) => disabled || 
            (toYear && date > new Date(`${toYear}-12-31`)) || 
            (fromYear && date < new Date(`${fromYear}-01-01`))
          }
          fromYear={fromYear}
          toYear={toYear}
          className="pointer-events-auto"
        />
      </PopoverContent>
    </Popover>
  );
}
