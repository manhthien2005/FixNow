"use client";

import { CalendarIcon, X } from "lucide-react";
import { useMemo, useState } from "react";
import { enUS, vi } from "date-fns/locale";

import { Button } from "@/components/ui/button";
import { Calendar } from "@/components/ui/calendar";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { useI18n } from "@/components/i18n/language-provider";

const START_HOUR = 8;
const END_HOUR = 20;
const SLOT_MINUTES = 30;

interface BookingDateTimePickerProps {
  value?: string;
  onChange: (value: string) => void;
  disabled?: boolean;
}

function startOfDay(date: Date): Date {
  return new Date(date.getFullYear(), date.getMonth(), date.getDate());
}

function sameDay(a: Date, b: Date): boolean {
  return (
    a.getFullYear() === b.getFullYear() &&
    a.getMonth() === b.getMonth() &&
    a.getDate() === b.getDate()
  );
}

function toSlotLabel(hour: number, minute: number): string {
  return `${String(hour).padStart(2, "0")}:${String(minute).padStart(2, "0")}`;
}

function applyTime(date: Date, slot: string): Date {
  const [hour, minute] = slot.split(":").map(Number);
  return new Date(
    date.getFullYear(),
    date.getMonth(),
    date.getDate(),
    hour,
    minute,
    0,
    0,
  );
}

function selectedDateFromValue(value?: string): Date | undefined {
  if (!value) return undefined;
  const date = new Date(value);
  return Number.isNaN(date.getTime()) ? undefined : date;
}

export function BookingDateTimePicker({
  value,
  onChange,
  disabled,
}: BookingDateTimePickerProps) {
  const { locale, dictionary } = useI18n();
  const [open, setOpen] = useState(false);
  const now = new Date();
  const selectedDate = selectedDateFromValue(value);
  const selectedSlot = selectedDate
    ? toSlotLabel(selectedDate.getHours(), selectedDate.getMinutes())
    : "";

  const timeSlots = useMemo(() => {
    const slots: string[] = [];
    for (let hour = START_HOUR; hour <= END_HOUR; hour++) {
      for (let minute = 0; minute < 60; minute += SLOT_MINUTES) {
        if (hour === END_HOUR && minute > 0) continue;
        slots.push(toSlotLabel(hour, minute));
      }
    }
    return slots;
  }, []);

  const dateFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
        weekday: "short",
        day: "2-digit",
        month: "2-digit",
        year: "numeric",
      }),
    [locale],
  );

  const timeFormatter = useMemo(
    () =>
      new Intl.DateTimeFormat(locale === "vi" ? "vi-VN" : "en-US", {
        hour: "2-digit",
        minute: "2-digit",
      }),
    [locale],
  );

  function isSlotDisabled(date: Date, slot: string): boolean {
    return applyTime(date, slot).getTime() < now.getTime();
  }

  function firstAvailableSlot(date: Date): string | undefined {
    return timeSlots.find((slot) => !isSlotDisabled(date, slot));
  }

  function isDateDisabled(date: Date): boolean {
    if (startOfDay(date).getTime() < startOfDay(now).getTime()) return true;
    return firstAvailableSlot(date) === undefined;
  }

  function handleSelect(date?: Date) {
    if (!date) return;
    const nextSlot =
      selectedSlot && !isSlotDisabled(date, selectedSlot)
        ? selectedSlot
        : firstAvailableSlot(date);

    if (!nextSlot) {
      onChange("");
      return;
    }

    onChange(applyTime(date, nextSlot).toISOString());
    setOpen(false);
  }

  function handleTimeChange(slot: string) {
    const date = selectedDate ?? now;
    if (isDateDisabled(date) || isSlotDisabled(date, slot)) return;
    onChange(applyTime(date, slot).toISOString());
  }

  return (
    <div className="space-y-3">
      <div className="grid grid-cols-1 gap-3 sm:grid-cols-[1fr_150px]">
        <Popover open={open} onOpenChange={setOpen}>
          <PopoverTrigger asChild>
            <Button
              type="button"
              variant="outline"
              disabled={disabled}
              className={cn(
                "h-11 justify-start px-3 text-left text-base font-normal md:text-sm",
                !selectedDate && "text-muted-foreground",
              )}
            >
              <CalendarIcon className="size-4 shrink-0" aria-hidden="true" />
              <span className="truncate">
                {selectedDate
                  ? dateFormatter.format(selectedDate)
                  : dictionary.booking.datePlaceholder}
              </span>
            </Button>
          </PopoverTrigger>
          <PopoverContent align="start" className="w-auto p-0">
            <Calendar
              mode="single"
              selected={selectedDate}
              onSelect={handleSelect}
              disabled={isDateDisabled}
              locale={locale === "vi" ? vi : enUS}
              autoFocus
            />
          </PopoverContent>
        </Popover>

        <Select
          value={selectedSlot}
          onValueChange={handleTimeChange}
          disabled={disabled || !selectedDate}
        >
          <SelectTrigger className="h-11 text-base md:text-sm">
            <SelectValue placeholder={dictionary.booking.timePlaceholder} />
          </SelectTrigger>
          <SelectContent>
            {timeSlots.map((slot) => {
              const slotDisabled = selectedDate
                ? isSlotDisabled(selectedDate, slot)
                : false;
              return (
                <SelectItem
                  key={slot}
                  value={slot}
                  disabled={slotDisabled}
                >
                  {slot}
                </SelectItem>
              );
            })}
          </SelectContent>
        </Select>
      </div>

      {selectedDate ? (
        <div className="flex flex-wrap items-center gap-2 text-sm text-muted-foreground">
          <span>
            {dictionary.booking.selected}: {dateFormatter.format(selectedDate)},{" "}
            {timeFormatter.format(selectedDate)}
          </span>
          <Button
            type="button"
            variant="ghost"
            size="sm"
            className="h-8 px-2 text-muted-foreground"
            onClick={() => onChange("")}
          >
            <X className="size-4" aria-hidden="true" />
            {dictionary.booking.clearTime}
          </Button>
        </div>
      ) : null}
    </div>
  );
}
