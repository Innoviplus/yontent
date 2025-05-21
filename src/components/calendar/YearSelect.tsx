import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface YearSelectProps {
  value?: string;
  onValueChange?: (value: string) => void;
  displayMonth?: Date;
  years?: number[];
  selectedYear: number;
  onChange: (value: string) => void;
}

export const YearSelect: React.FC<YearSelectProps> = ({
  value,
  onValueChange,
  displayMonth,
  years,
  selectedYear,
  onChange
}) => {
  // If we have the new props format, use that
  if (years && selectedYear !== undefined && onChange) {
    return (
      <Select value={selectedYear.toString()} onValueChange={onChange}>
        <SelectTrigger className="w-[90px] focus:ring-0">
          <SelectValue>{selectedYear}</SelectValue>
        </SelectTrigger>
        <SelectContent>
          {years.map(year => (
            <SelectItem key={year} value={year.toString()}>
              {year}
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
        <SelectValue>{displayMonth?.getFullYear()}</SelectValue>
      </SelectTrigger>
      <SelectContent>
        {Array.from(
          { length: 121 }, // 2024 to 1904 = 121 years
          (_, i) => {
            const year = 2024 - i;
            return (
              <SelectItem key={year} value={year.toString()}>
                {year}
              </SelectItem>
            );
          }
        )}
      </SelectContent>
    </Select>
  );
};
