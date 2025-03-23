
import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, DropdownProps, CaptionProps } from "react-day-picker";

import { cn } from "@/lib/utils";
import { buttonVariants } from "@/components/ui/button";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

export type CalendarProps = React.ComponentProps<typeof DayPicker>;

function Calendar({
  className,
  classNames,
  showOutsideDays = true,
  ...props
}: CalendarProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("p-3 pointer-events-auto", className)}
      classNames={{
        months: "flex flex-col sm:flex-row space-y-4 sm:space-x-4 sm:space-y-0",
        month: "space-y-4",
        caption: "flex justify-center pt-1 relative items-center",
        caption_label: "text-sm font-medium",
        nav: "space-x-1 flex items-center",
        nav_button: cn(
          buttonVariants({ variant: "outline" }),
          "h-7 w-7 bg-transparent p-0 opacity-50 hover:opacity-100"
        ),
        nav_button_previous: "absolute left-1",
        nav_button_next: "absolute right-1",
        table: "w-full border-collapse space-y-1",
        head_row: "flex",
        head_cell:
          "text-muted-foreground rounded-md w-9 font-normal text-[0.8rem]",
        row: "flex w-full mt-2",
        cell: "h-9 w-9 text-center text-sm p-0 relative [&:has([aria-selected].day-range-end)]:rounded-r-md [&:has([aria-selected].day-outside)]:bg-accent/50 [&:has([aria-selected])]:bg-accent first:[&:has([aria-selected])]:rounded-l-md last:[&:has([aria-selected])]:rounded-r-md focus-within:relative focus-within:z-20",
        day: cn(
          buttonVariants({ variant: "ghost" }),
          "h-9 w-9 p-0 font-normal aria-selected:opacity-100"
        ),
        day_range_end: "day-range-end",
        day_selected:
          "bg-primary text-primary-foreground hover:bg-primary hover:text-primary-foreground focus:bg-primary focus:text-primary-foreground",
        day_today: "bg-accent text-accent-foreground",
        day_outside:
          "day-outside text-muted-foreground opacity-50 aria-selected:bg-accent/50 aria-selected:text-muted-foreground aria-selected:opacity-30",
        day_disabled: "text-muted-foreground opacity-50",
        day_range_middle:
          "aria-selected:bg-accent aria-selected:text-accent-foreground",
        day_hidden: "invisible",
        ...classNames,
      }}
      components={{
        IconLeft: ({ ..._props }) => <ChevronLeft className="h-4 w-4" />,
        IconRight: ({ ..._props }) => <ChevronRight className="h-4 w-4" />,
        Dropdown: (props: DropdownProps) => {
          const { value, onChange, children, ...rest } = props;
          // Convert value to string for Select component
          const stringValue = String(value);
          
          return (
            <Select
              value={stringValue}
              onValueChange={(newValue) => {
                onChange?.(newValue);
              }}
            >
              <SelectTrigger className="w-[90px] focus:ring-0">
                <SelectValue>{stringValue}</SelectValue>
              </SelectTrigger>
              <SelectContent>
                {React.Children.map(children as React.ReactElement[], (child) => (
                  <SelectItem value={child.props.value.toString()}>{child.props.children}</SelectItem>
                ))}
              </SelectContent>
            </Select>
          );
        },
        Caption: ({ displayMonth, id }: CaptionProps) => {
          // Create handler functions for month and year changes
          const handleMonthChange = (monthStr: string) => {
            const newDate = new Date(displayMonth);
            newDate.setMonth(parseInt(monthStr));
            const customEvent = new CustomEvent("daypicker-month-change", { 
              detail: { date: newDate }
            });
            document.dispatchEvent(customEvent);
          };
          
          const handleYearChange = (yearStr: string) => {
            const newDate = new Date(displayMonth);
            newDate.setFullYear(parseInt(yearStr));
            const customEvent = new CustomEvent("daypicker-month-change", { 
              detail: { date: newDate }
            });
            document.dispatchEvent(customEvent);
          };
          
          React.useEffect(() => {
            const handler = (e: Event) => {
              const customEvent = e as CustomEvent;
              if (props.onMonthChange) {
                props.onMonthChange(customEvent.detail.date);
              }
            };
            
            document.addEventListener('daypicker-month-change', handler);
            
            return () => {
              document.removeEventListener('daypicker-month-change', handler);
            };
          }, [props.onMonthChange]);

          return (
            <div className="flex justify-center space-x-2 py-1 w-full">
              {displayMonth && (
                <>
                  {/* Month dropdown */}
                  <Select 
                    value={displayMonth.getMonth().toString()} 
                    onValueChange={handleMonthChange}
                  >
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
                  
                  {/* Year dropdown */}
                  <Select 
                    value={displayMonth.getFullYear().toString()} 
                    onValueChange={handleYearChange}
                  >
                    <SelectTrigger className="w-[90px] focus:ring-0">
                      <SelectValue>
                        {displayMonth.getFullYear()}
                      </SelectValue>
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
                </>
              )}
            </div>
          );
        }
      }}
      {...props}
    />
  );
}
Calendar.displayName = "Calendar";

export { Calendar };
