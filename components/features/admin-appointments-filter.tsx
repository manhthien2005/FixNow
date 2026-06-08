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
import { APPOINTMENT_STATUS_LABEL } from "@/lib/labels";

type StatusFilter = AppointmentStatus | "ALL";

const STATUS_OPTIONS: { value: StatusFilter; label: string }[] = [
  { value: "ALL", label: "Tất cả trạng thái" },
  { value: "RECEIVED", label: APPOINTMENT_STATUS_LABEL.RECEIVED },
  { value: "IN_PROGRESS", label: APPOINTMENT_STATUS_LABEL.IN_PROGRESS },
  { value: "COMPLETED", label: APPOINTMENT_STATUS_LABEL.COMPLETED },
  { value: "CANCELLED", label: APPOINTMENT_STATUS_LABEL.CANCELLED },
];

interface AdminAppointmentsFilterProps {
  initialStatus?: StatusFilter;
  initialQ?: string;
}

export function AdminAppointmentsFilter({
  initialStatus = "ALL",
  initialQ = "",
}: AdminAppointmentsFilterProps) {
  const router = useRouter();
  const [status, setStatus] = useState<StatusFilter>(initialStatus);
  const [q, setQ] = useState(initialQ);

  function applyFilters() {
    const params = new URLSearchParams();
    if (status !== "ALL") params.set("status", status);
    const trimmed = q.trim();
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
        <Label htmlFor="admin-status-filter">Trạng thái</Label>
        <Select
          value={status}
          onValueChange={(value) => setStatus(value as StatusFilter)}
        >
          <SelectTrigger id="admin-status-filter" className="h-11">
            <SelectValue placeholder="Tất cả trạng thái" />
          </SelectTrigger>
          <SelectContent>
            {STATUS_OPTIONS.map((opt) => (
              <SelectItem key={opt.value} value={opt.value}>
                {opt.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex-1 space-y-1.5">
        <Label htmlFor="admin-search-q">Tìm kiếm</Label>
        <Input
          id="admin-search-q"
          type="search"
          inputMode="search"
          value={q}
          onChange={(event) => setQ(event.target.value)}
          onKeyDown={onKeyDown}
          placeholder="Mã hẹn hoặc SĐT"
          className="h-11 text-base md:text-sm"
        />
      </div>

      <div className="flex gap-2">
        <Button
          type="button"
          onClick={applyFilters}
          className="h-11 flex-1 md:flex-none"
        >
          <Search className="size-4" />
          Tìm
        </Button>
        <Button
          type="button"
          variant="ghost"
          onClick={clearFilters}
          className="h-11"
        >
          <X className="size-4" />
          Xoá lọc
        </Button>
      </div>
    </div>
  );
}
