import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  displayMonth?: Date;
  months?: { value: number; label: string; }[];
  selectedMonth: number;
  onChange: (value: string) => void;
}

export const MonthSelect: React.FC<MonthSelectProps> = ({
  value,
  onValueChange,
  displayMonth,
  months,
  selectedMonth,
  onChange
}) => {
  // If we have the new props format, use that
  if (months && selectedMonth !== undefined && onChange) {
    return (
      <Select value={selectedMonth.toString()} onValueChange={onChange}>
        <SelectTrigger className="w-[90px] focus:ring-0">
          <SelectValue>
            {months.find(m => m.value === selectedMonth)?.label}
          </SelectValue>
        </SelectTrigger>
        <SelectContent>
          {months.map(month => (
            <SelectItem key={month.value} value={month.value.toString()}>
              {month.label}
            </SelectItem>
          ))}
        </SelectContent>
      </Select>
    );
  }
  
  // Otherwise fall back to the old props format
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[90px] focus:ring-0">
        <SelectValue>
          {displayMonth?.toLocaleString('default', { month: 'long' })}
        </SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Array.from({ length: 12 }, (_, i) => (
          <SelectItem key={i} value={i.toString()}>
            {new Date(0, i).toLocaleString('default', { month: 'long' })}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
};
