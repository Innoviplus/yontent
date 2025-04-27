
import * as React from "react";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

interface MonthSelectProps {
  value: string;
  onValueChange: (value: string) => void;
  displayMonth: Date;
}

export const MonthSelect: React.FC<MonthSelectProps> = ({
  value,
  onValueChange,
  displayMonth
}) => {
  return (
    <Select value={value} onValueChange={onValueChange}>
      <SelectTrigger className="w-[90px] focus:ring-0">
        <SelectValue>
          {displayMonth.toLocaleString('default', { month: 'long' })}
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
