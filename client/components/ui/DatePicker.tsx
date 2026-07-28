"use client";

import React, { useState, useEffect, useRef } from "react";
import { CalendarIcon, ChevronLeft, ChevronRight, X } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import Button from "./Button";

export type DateRange = { from: Date | null; to: Date | null };

export interface DatePickerProps {
  mode?: "single" | "range";
  value?: Date | DateRange | null;
  onChange?: (value: any) => void;
  placeholder?: string;
  className?: string;
  minDate?: Date;
  maxDate?: Date;
  disabled?: boolean;
}

const DatePicker = React.forwardRef<HTMLDivElement, DatePickerProps>(
  (
    {
      mode = "single",
      value,
      onChange,
      placeholder = "Select date",
      className = "",
      minDate,
      maxDate,
      disabled = false,
    },
    ref
  ) => {
    const [isOpen, setIsOpen] = useState(false);
    
    // Initialize currentMonth correctly based on value
    const getInitialMonth = () => {
        if (!value) return new Date();
        if (mode === "single" && value instanceof Date) return new Date(value);
        if (mode === "range" && (value as DateRange).from) return new Date((value as DateRange).from!);
        return new Date();
    };

    const [currentMonth, setCurrentMonth] = useState(getInitialMonth());
    const [hoverDate, setHoverDate] = useState<number | null>(null);
    const [dragStartDate, setDragStartDate] = useState<number | null>(null);
    const containerRef = useRef<HTMLDivElement>(null);

    // Close when clicking outside
    useEffect(() => {
      const handleClickOutside = (event: MouseEvent) => {
        if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
          setIsOpen(false);
          setHoverDate(null);
          setDragStartDate(null);
        }
      };
      const handleGlobalMouseUp = () => {
        setDragStartDate(null);
      };
      document.addEventListener("mousedown", handleClickOutside);
      document.addEventListener("mouseup", handleGlobalMouseUp);
      return () => {
        document.removeEventListener("mousedown", handleClickOutside);
        document.removeEventListener("mouseup", handleGlobalMouseUp);
      };
    }, []);

    // Update currentMonth if value changes externally
    useEffect(() => {
      if (value) {
        if (mode === "single" && value instanceof Date) setCurrentMonth(new Date(value));
        else if (mode === "range" && (value as DateRange).from) setCurrentMonth(new Date((value as DateRange).from!));
      }
    }, [value, mode]);

    const daysInMonth = (month: number, year: number) => new Date(year, month + 1, 0).getDate();
    const startDayOfMonth = (month: number, year: number) => new Date(year, month, 1).getDay();

    const normalizeDate = (d: Date) => {
        const nd = new Date(d);
        nd.setHours(0, 0, 0, 0);
        return nd.getTime();
    }



    const generateCalendar = () => {
      const month = currentMonth.getMonth();
      const year = currentMonth.getFullYear();
      const totalDays = daysInMonth(month, year);
      const startDay = startDayOfMonth(month, year);
      const todayTime = normalizeDate(new Date());

      const days = [];
      const singleValue = mode === "single" ? (value as Date) : null;
      const rangeValue = mode === "range" ? (value as DateRange) : null;

      const fromTime = rangeValue?.from ? normalizeDate(rangeValue.from) : null;
      const toTime = rangeValue?.to ? normalizeDate(rangeValue.to) : null;
      const singleTime = singleValue ? normalizeDate(singleValue) : null;

      // Empty cells for previous month
      for (let i = 0; i < startDay; i++) {
        days.push(<div key={`empty-${i}`} className="h-8 w-8" />);
      }

      for (let i = 1; i <= totalDays; i++) {
        const date = new Date(year, month, i);
        const dateTime = date.getTime();

        const isToday = dateTime === todayTime;
        const isDisabled =
          (minDate && dateTime < normalizeDate(minDate)) ||
          (maxDate && dateTime > normalizeDate(maxDate));

        let isSelected = false;
        let isRangeStart = false;
        let isRangeEnd = false;
        let isBetween = false;

        if (mode === "single") {
            isSelected = singleTime === dateTime;
        } else {
            isRangeStart = fromTime === dateTime;
            isRangeEnd = toTime === dateTime;
            
            if (dragStartDate !== null && hoverDate !== null) {
                const start = Math.min(dragStartDate, hoverDate);
                const end = Math.max(dragStartDate, hoverDate);
                isBetween = Boolean(dateTime > start && dateTime < end);
                if (dateTime === start) isRangeStart = true;
                if (dateTime === end && start !== end) isRangeEnd = true;
            } else if (fromTime && toTime) {
                isBetween = Boolean(dateTime > fromTime && dateTime < toTime);
            }
            
            isSelected = isRangeStart || isRangeEnd || (fromTime === dateTime && !toTime);
        }

        days.push(
          <div 
            key={`day-wrap-${i}`} 
            className={`relative h-8 w-8 rounded-full  
              ${isBetween ? "bg-cayenne-red-50" : ""} 
              ${isRangeStart && toTime && dateTime !== toTime ? "bg-cayenne-red-50 rounded-l-full" : ""} 
              ${isRangeEnd && fromTime && dateTime !== fromTime ? "bg-cayenne-red-50 rounded-r-full" : ""}
            `}
          >
              <button
                type="button"
                disabled={isDisabled}
                onMouseDown={() => {
                  if (mode === "range" && !isDisabled) {
                    setDragStartDate(dateTime);
                    setHoverDate(dateTime);
                  }
                }}
                onMouseUp={(e) => {
                  e.stopPropagation();
                  if (isDisabled) return;
                  if (mode === "single") {
                    onChange?.(date);
                    setIsOpen(false);
                  } else if (mode === "range" && dragStartDate !== null) {
                    if (dragStartDate === dateTime) {
                      onChange?.({ from: date, to: null });
                    } else {
                      const from = new Date(Math.min(dragStartDate, dateTime));
                      const to = new Date(Math.max(dragStartDate, dateTime));
                      onChange?.({ from, to });
                    }
                    setDragStartDate(null);
                    setIsOpen(false);
                    setHoverDate(null);
                  }
                }}
                onMouseEnter={() => {
                  if (!isDisabled && dragStartDate !== null) {
                    setHoverDate(dateTime);
                  }
                }}
                className={`
                  absolute inset-0 rounded-full flex items-center justify-center text-sm transition-colors cursor-pointer
                  ${isDisabled ? "text-gray-300 cursor-not-allowed opacity-50" : "hover:bg-cayenne-red-100"}
                  ${isSelected ? "bg-cayenne-red-500 text-white hover:bg-cayenne-red-600 font-medium shadow-sm z-10" : ""}
                  ${!isSelected && isToday ? "text-cayenne-red-500 font-semibold border border-cayenne-red-200" : ""}
                  ${!isSelected && !isToday && !isDisabled && !isBetween ? "text-carbon-black-800" : ""}
                  ${isBetween && !isSelected ? "text-cayenne-red-800 font-medium" : ""}
                `}
              >
                {i}
              </button>
          </div>
        );
      }
      return days;
    };

    const nextMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() + 1, 1));
    };

    const prevMonth = () => {
      setCurrentMonth(new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1));
    };

    const months = [
      "January", "February", "March", "April", "May", "June",
      "July", "August", "September", "October", "November", "December",
    ];
    const weekDays = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

    const renderValue = () => {
        if (!value) return placeholder;
        if (mode === "single") {
            return new Date(value as Date).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
        } else {
            const rv = value as DateRange;
            if (!rv.from && !rv.to) return placeholder;
            const fromStr = rv.from ? new Date(rv.from).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
            const toStr = rv.to ? new Date(rv.to).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" }) : "";
            
            if (rv.from && rv.to) {
                if (rv.from.getTime() === rv.to.getTime()) return fromStr;
                return `${fromStr} - ${toStr}`;
            }
            if (rv.from) return fromStr;
            return placeholder;
        }
    };

    return (
      <div className={`relative ${className}`} ref={ref || containerRef}>
        <Button
          variant="ghost"
          disabled={disabled}
          onClick={() => setIsOpen(!isOpen)}
          className={`
            w-full flex items-center !justify-between px-4 py-2.5 border shadow-sm font-normal
            ${
              disabled
                ? "bg-gray-50 border-gray-200 cursor-not-allowed opacity-60"
                : "bg-white border-gray-200 hover:border-gray-300 hover:bg-white focus:ring-cayenne-red-500"
            }
          `}
          rightIcon={
            value && (mode === "single" || (mode === "range" && (value as DateRange).from)) ? (
              <div 
                className="p-1 -mr-1 hover:bg-gray-100 rounded-md transition-colors"
                onClick={(e) => {
                  e.stopPropagation();
                  onChange?.(mode === "single" ? null : { from: null, to: null });
                }}
              >
                <X className={`w-4 h-4 ${disabled ? "text-gray-400" : "text-gray-500"}`} />
              </div>
            ) : (
              <CalendarIcon className={`w-4 h-4 ${disabled ? "text-gray-400" : "text-gray-500"}`} />
            )
          }
        >
          <span className={value && (mode === "single" || (mode === "range" && (value as DateRange).from)) ? "text-carbon-black-800 font-medium" : "text-gray-500"}>
            {renderValue()}
          </span>
        </Button>

        <AnimatePresence>
          {isOpen && !disabled && (
            <>
              {/* Mobile Backdrop */}
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                className="fixed inset-0 bg-gray-900/20 backdrop-blur-sm z-[90] sm:hidden"
                onClick={(e) => {
                  e.stopPropagation();
                  setIsOpen(false);
                }}
              />
              <motion.div
                initial={{ opacity: 0, y: 10, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: 10, scale: 0.95 }}
                transition={{ duration: 0.2, ease: "easeOut" }}
                className={`fixed inset-x-4 bottom-4 sm:absolute sm:inset-auto sm:z-50 sm:top-full sm:mt-2 sm:left-0 z-[100] p-4 bg-white rounded-2xl sm:rounded-xl shadow-2xl sm:shadow-xl border border-gray-100 ${mode === "range" ? "sm:min-w-[320px]" : "sm:min-w-[280px]"}`}
              >
              {/* Header */}
              <div className="flex items-center justify-between mb-4">
                <Button
                  variant="ghost"
                  size="icon"
                  onClick={prevMonth}
                  className="h-8 w-8 !p-0 rounded-full text-gray-500 hover:text-carbon-black-800 hover:bg-gray-100"
                >
                  <ChevronLeft className="w-4 h-4" />
                </Button>

                <span className="font-semibold text-carbon-black-800 text-sm">
                  {months[currentMonth.getMonth()]} {currentMonth.getFullYear()}
                </span>

                <Button
                  variant="ghost"
                  size="icon"
                  onClick={nextMonth}
                  className="h-8 w-8 !p-0 rounded-full text-gray-500 hover:text-carbon-black-800 hover:bg-gray-100"
                >
                  <ChevronRight className="w-4 h-4" />
                </Button>
              </div>

              {/* Weekdays */}
              <div className="grid grid-cols-7 gap-1 mb-2">
                {weekDays.map((day) => (
                  <div key={day} className="text-center text-xs font-medium text-gray-400">
                    {day}
                  </div>
                ))}
              </div>

              {/* Days */}
              <div className="grid grid-cols-7 gap-1">
                {generateCalendar()}
              </div>

              {/* Footer */}
              <div className="mt-4 pt-3 border-t border-gray-100 flex gap-2">
                <Button
                  variant="ghost"
                  onClick={() => {
                    onChange?.(mode === "single" ? null : { from: null, to: null });
                    setIsOpen(false);
                  }}
                  className="flex-1 text-gray-600 font-medium hover:bg-gray-50"
                >
                  Clear
                </Button>
                <Button
                  variant="ghost"
                  onClick={() => {
                    const today = new Date();
                    today.setHours(0, 0, 0, 0);
                    if (mode === "single") {
                        onChange?.(today);
                        setIsOpen(false);
                    } else {
                        onChange?.({ from: today, to: today });
                        setIsOpen(false);
                    }
                  }}
                  className="flex-1 text-cayenne-red-600 font-medium hover:bg-cayenne-red-50 hover:text-cayenne-red-700"
                >
                  Today
                </Button>
              </div>
            </motion.div>
            </>
          )}
        </AnimatePresence>
      </div>
    );
  }
);

export default React.memo(DatePicker);