"use client";

import Link from "next/link";
import { useMemo, useState } from "react";
import {
  ArrowDownWideNarrow,
  ArrowUpWideNarrow,
  CalendarX,
  ChevronRight,
  Wrench,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { DEVICE_TYPE_LABEL } from "@/lib/labels";
import { DEVICE_ICON, STATUS_UI } from "@/lib/appointment-ui";
import { formatDateVi } from "@/lib/utils";
import type { AppointmentStatus, DeviceType } from "@/db/schema";

// Plain serialisable shape passed from the server component.
export type AppointmentListItem = {
  appointmentCode: string;
  deviceType: DeviceType;
  serviceGroup: string;
  status: AppointmentStatus;
  createdAt: string; // ISO
};

type StatusFilter = "ALL" | AppointmentStatus;
type SortOrder = "newest" | "oldest";

const STATUS_ORDER: AppointmentStatus[] = [
  "RECEIVED",
  "IN_PROGRESS",
  "COMPLETED",
  "CANCELLED",
];

export function MyAppointmentsList({
  items,
}: {
  items: AppointmentListItem[];
}) {
  const [status, setStatus] = useState<StatusFilter>("ALL");
  const [sort, setSort] = useState<SortOrder>("newest");

  const counts = useMemo(() => {
    const map: Record<string, number> = { ALL: items.length };
    for (const it of items) map[it.status] = (map[it.status] ?? 0) + 1;
    return map;
  }, [items]);

  const visible = useMemo(() => {
    const filtered =
      status === "ALL" ? items : items.filter((it) => it.status === status);
    const sorted = [...filtered].sort((a, b) => {
      const diff =
        new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime();
      return sort === "newest" ? diff : -diff;
    });
    return sorted;
  }, [items, status, sort]);

  const FILTERS: { value: StatusFilter; label: string }[] = [
    { value: "ALL", label: "Tất cả" },
    ...STATUS_ORDER.filter((s) => counts[s]).map((s) => ({
      value: s,
      label: STATUS_UI[s].label,
    })),
  ];

  return (
    <div className="space-y-6">
      {/* Toolbar: status filter pills + sort toggle */}
      <div className="fade-in-up flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
        <div
          role="tablist"
          aria-label="Lọc theo trạng thái"
          className="flex flex-wrap gap-2"
        >
          {FILTERS.map((f) => {
            const active = status === f.value;
            const ui = f.value === "ALL" ? null : STATUS_UI[f.value];
            return (
              <button
                key={f.value}
                type="button"
                role="tab"
                aria-selected={active}
                onClick={() => setStatus(f.value)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 font-mono text-label-sm uppercase tracking-wider transition-colors",
                  active
                    ? "border-transparent bg-secondary text-on-secondary"
                    : "border-white/10 bg-surface-container/40 text-on-surface-variant hover:border-secondary/40 hover:text-on-surface",
                )}
              >
                {ui ? (
                  <span
                    className={cn(
                      "size-2 rounded-full",
                      active ? "bg-on-secondary" : ui.dot,
                    )}
                  />
                ) : null}
                {f.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px]",
                    active ? "bg-on-secondary/15" : "bg-white/5",
                  )}
                >
                  {counts[f.value] ?? 0}
                </span>
              </button>
            );
          })}
        </div>

        <button
          type="button"
          onClick={() => setSort((s) => (s === "newest" ? "oldest" : "newest"))}
          className="inline-flex min-h-11 w-max items-center gap-2 rounded-full border border-white/10 bg-surface-container/40 px-4 py-2 font-mono text-label-sm uppercase tracking-wider text-on-surface-variant transition-colors hover:border-secondary/40 hover:text-on-surface"
        >
          {sort === "newest" ? (
            <ArrowDownWideNarrow className="size-4" aria-hidden="true" />
          ) : (
            <ArrowUpWideNarrow className="size-4" aria-hidden="true" />
          )}
          {sort === "newest" ? "Mới nhất" : "Cũ nhất"}
        </button>
      </div>

      {/* Results */}
      <p className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant/70">
        {visible.length > 0
          ? `${String(visible.length).padStart(2, "0")} lịch hẹn`
          : "Không có kết quả"}
      </p>

      {visible.length === 0 ? (
        <div className="glass-panel flex flex-col items-center gap-3 rounded-2xl p-10 text-center">
          <CalendarX className="size-9 text-on-surface-variant" aria-hidden="true" />
          <p className="text-body-md text-on-surface-variant">
            Không có lịch hẹn nào ở trạng thái này.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 lg:grid-cols-2">
          {visible.map((appt) => {
            const ui = STATUS_UI[appt.status];
            const StatusIcon = ui.icon;
            const DeviceIcon = DEVICE_ICON[appt.deviceType];
            return (
              <Link
                key={appt.appointmentCode}
                href={`/my-appointments/${appt.appointmentCode}`}
                className="glass-panel group relative overflow-hidden rounded-2xl p-5 transition-colors hover:border-white/20"
              >
                <span
                  aria-hidden
                  className={`absolute left-0 top-0 h-full w-1 ${ui.dot}`}
                />
                <div className="flex items-start justify-between gap-3 pl-2">
                  <div>
                    <p className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant/60">
                      Mã hẹn
                    </p>
                    <p className="font-mono text-lg font-bold text-on-surface">
                      {appt.appointmentCode}
                    </p>
                  </div>
                  <span
                    className={`inline-flex shrink-0 items-center gap-1.5 rounded-full ${ui.bg} px-3 py-1 font-mono text-label-sm ${ui.text}`}
                  >
                    <StatusIcon className="size-3.5" aria-hidden="true" />
                    {ui.label}
                  </span>
                </div>

                <div className="mt-4 grid grid-cols-1 gap-3 pl-2 sm:grid-cols-2">
                  <div className="flex items-center gap-2.5">
                    <DeviceIcon className="size-4 shrink-0 text-on-surface-variant" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant/60">
                        Thiết bị
                      </p>
                      <p className="truncate text-body-md text-on-surface">
                        {DEVICE_TYPE_LABEL[appt.deviceType]}
                      </p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2.5">
                    <Wrench className="size-4 shrink-0 text-on-surface-variant" aria-hidden="true" />
                    <div className="min-w-0">
                      <p className="font-mono text-[11px] uppercase tracking-wider text-on-surface-variant/60">
                        Dịch vụ
                      </p>
                      <p className="truncate text-body-md text-on-surface">
                        {appt.serviceGroup}
                      </p>
                    </div>
                  </div>
                </div>

                <div className="mt-4 flex items-center justify-between border-t border-white/5 pl-2 pt-3">
                  <p className="font-mono text-label-sm text-on-surface-variant">
                    {formatDateVi(appt.createdAt)}
                  </p>
                  <span className="inline-flex items-center gap-1 font-mono text-label-sm uppercase tracking-wider text-secondary transition-transform group-hover:translate-x-0.5">
                    Chi tiết <ChevronRight className="size-4" />
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}
    </div>
  );
}
