"use client";

import * as React from "react";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { DayPicker, type DayPickerProps } from "react-day-picker";

import { cn } from "@/lib/utils";

function Calendar({ className, classNames, showOutsideDays = true, ...props }: DayPickerProps) {
  return (
    <DayPicker
      showOutsideDays={showOutsideDays}
      className={cn("rounded-2xl border border-slate-200 bg-white p-3", className)}
      classNames={{
        months: "flex flex-col gap-4 sm:flex-row",
        month: "space-y-4",
        caption: "flex items-center justify-between px-1",
        caption_label: "text-sm font-semibold text-slate-900",
        nav: "flex items-center gap-1",
        button_previous:
          "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50",
        button_next:
          "inline-flex h-8 w-8 items-center justify-center rounded-lg border border-slate-200 text-slate-700 hover:bg-slate-50",
        month_grid: "w-full border-collapse space-y-1",
        weekdays: "flex",
        weekday: "w-9 text-[0.8rem] font-medium text-slate-500",
        week: "mt-2 flex w-full",
        day: "h-9 w-9 p-0 text-center text-sm",
        day_button:
          "h-9 w-9 rounded-lg text-slate-800 transition-colors hover:bg-slate-100 aria-selected:bg-slate-900 aria-selected:text-white",
        selected: "bg-slate-900 text-white",
        today: "border border-sky-300 bg-sky-50 text-slate-900",
        outside: "text-slate-300 aria-selected:bg-slate-100 aria-selected:text-slate-500",
        disabled: "text-slate-300",
        range_start: "bg-slate-900 text-white",
        range_middle: "bg-slate-100 text-slate-900",
        range_end: "bg-slate-900 text-white",
        hidden: "invisible",
        ...classNames,
      }}
      components={{
        Chevron: ({ orientation, className: iconClassName, ...iconProps }) =>
          orientation === "left" ? (
            <ChevronLeft className={cn("h-4 w-4", iconClassName)} {...iconProps} />
          ) : (
            <ChevronRight className={cn("h-4 w-4", iconClassName)} {...iconProps} />
          ),
      }}
      {...props}
    />
  );
}

export { Calendar };
