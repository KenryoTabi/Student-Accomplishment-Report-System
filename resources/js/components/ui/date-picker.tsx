import { format } from "date-fns"
import { CalendarIcon, ChevronDownIcon } from "lucide-react"
import * as React from "react"
import type { DateRange } from "react-day-picker"
import { Button } from "@/components/ui/button"
import { Calendar } from "@/components/ui/calendar"
import { Field, FieldLabel } from "@/components/ui/field"
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover"
import type { DatePickerProps, SingleDatePickerProps } from "@/types"

export default function DatePicker({
  date,
  onChange,
  placeholder = "Pick a date",
}: SingleDatePickerProps) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          type="button"
          variant="outline"
          data-empty={!date}
          className="w-[212px] justify-between text-left font-normal data-[empty=true]:text-muted-foreground"
        >
          {date ? format(date, "PPP") : <span>{placeholder}</span>}
          <ChevronDownIcon />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="single"
          selected={date}
          onSelect={onChange}
          defaultMonth={date ?? new Date()}
        />
      </PopoverContent>
    </Popover>
  )
}

export function DatePickerWithRange({
    title,
    date,
    onChange
}:DatePickerProps) {
  return (
    <Field className="mx-auto w-60">
      <FieldLabel htmlFor="date-picker-range">{title}</FieldLabel>
      <Popover>
        <PopoverTrigger asChild>
          <Button
            type="button"
            variant="outline"
            id="date-picker-range"
            className="justify-start px-2.5 font-normal"
          >
            <CalendarIcon />
            {date?.from ? (
              date.to ? (
                <>
                  {format(date.from, "LLL dd, y")} -{" "}
                  {format(date.to, "LLL dd, y")}
                </>
              ) : (
                format(date.from, "LLL dd, y")
              )
            ) : (
              <span>Pick a date</span>
            )}
          </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="start">
          <Calendar
            mode="range"
            defaultMonth={date?.from}
            selected={date}
            onSelect={(range) => onChange?.(range as DateRange)}
            numberOfMonths={1}
          />
        </PopoverContent>
      </Popover>
    </Field>
  )
}
