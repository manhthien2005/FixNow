"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, X } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { AppointmentStatus } from "@/db/schema";
import {
  INPUT_LIMITS,
  limitText,
  normalizeSpaces,
} from "@/lib/input-normalizers";
import { useI18n } from "@/components/i18n/language-provider";

type StatusFilter = AppointmentStatus | "ALL";

interface AdminAppointmentsFilterProps {
  initialStatus?: StatusFilter;
  initialQ?: string;
}

export function AdminAppointmentsFilter({
  initialStatus = "ALL",
  initialQ = "",
}: AdminAppointmentsFilterProps) {
  const router = useRouter();
  const { dictionary, locale } = useI18n();
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [q, setQ] = useState(initialQ);
  const statusOptions: { value: StatusFilter; label: string }[] = [
    {
      value: "ALL",
      label: locale === "vi" ? "Tất cả trạng thái" : "All statuses",
    },
    { value: "RECEIVED", label: dictionary.labels.appointmentStatus.RECEIVED },
    {
      value: "IN_PROGRESS",
      label: dictionary.labels.appointmentStatus.IN_PROGRESS,
    },
    { value: "COMPLETED", label: dictionary.labels.appointmentStatus.COMPLETED },
    { value: "CANCELLED", label: dictionary.labels.appointmentStatus.CANCELLED },
  ];

  function applyFilters() {
    const params = new URLSearchParams();
    if (status !== "ALL") params.set("status", status);
    const trimmed = normalizeSpaces(q);
    if (trimmed) params.set("q", trimmed);
    const qs = params.toString();
    router.push(qs ? `/admin/appointments?${qs}` : "/admin/appointments");
  }

  function clearFilters() {
    setStatus("ALL");
    setQ("");
    router.push("/admin/appointments");
  }

  function onKeyDown(event: React.KeyboardEvent<HTMLInputElement>) {
    if (event.key === "Enter") {
      event.preventDefault();
      applyFilters();
    }
  }

  return (
    <div className="flex flex-col gap-3 md:flex-row md:items-end">
      <div className="flex-1 space-y-1.5 md:max-w-xs">
        <Label htmlFor="admin-status-filter">{dictionary.common.status}</Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as StatusFilter)}
        >
          <SelectTrigger id="admin-status-filter" className="h-11">
            <SelectValue
              placeholder={
                locale === "vi" ? "Tất cả trạng thái" : "All statuses"
              }
            />
          </SelectTrigger>
          <SelectContent>
            {statusOptions.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-1.5">
        <Label htmlFor="admin-search-q">{dictionary.common.search}</Label>
        <Input
          id="admin-search-q"
          type="search"
          inputMode="search"
          value={q}
          onChange={(event) =>
            setQ(limitText(event.target.value, INPUT_LIMITS.search))
          }
          onBlur={(event) => setQ(normalizeSpaces(event.target.value))}
          onKeyDown={onKeyDown}
          placeholder={locale === "vi" ? "Mã hẹn hoặc SĐT" : "Code or phone"}
          className="h-11 text-base md:text-sm"
          maxLength={INPUT_LIMITS.search}
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={applyFilters}
          className="h-11 flex-1 md:flex-none"
        >
          <Search className="size-4" />
          {dictionary.common.search}
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={clearFilters}
          className="h-11"
        >
          <X className="size-4" />
          {locale === "vi" ? "Xoá lọc" : "Clear"}
        </Button>
      </div>
    </div>
  );
}
