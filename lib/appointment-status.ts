import type { AppointmentStatus } from "@/db/schema";

/**
 * Allowed status transitions for admin updates.
 * Terminal states (COMPLETED, CANCELLED) cannot be changed.
 */
export const ADMIN_STATUS_TRANSITIONS: Record<
  AppointmentStatus,
  AppointmentStatus[]
> = {
  RECEIVED: ["IN_PROGRESS", "CANCELLED"],
  IN_PROGRESS: ["COMPLETED", "CANCELLED"],
  COMPLETED: [],
  CANCELLED: [],
};

export function isTransitionAllowed(
  from: AppointmentStatus,
  to: AppointmentStatus,
): boolean {
  return ADMIN_STATUS_TRANSITIONS[from].includes(to);
}

export function isTerminalStatus(s: AppointmentStatus): boolean {
  return ADMIN_STATUS_TRANSITIONS[s].length === 0;
}
