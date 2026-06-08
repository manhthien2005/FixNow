export const INPUT_LIMITS = {
  name: 100,
  phone: 10,
  email: 254,
  password: 72,
  address: 255,
  issueDescription: 2000,
  appointmentCode: 12,
  search: 50,
  catalogName: 150,
  price: 50,
  warranty: 50,
  note: 255,
  sortOrderMin: 0,
  sortOrderMax: 999,
} as const;

export const PHONE_RAW_INPUT_MAX_LENGTH = 16;

export function limitText(value: string, max: number): string {
  return value.slice(0, max);
}

export function normalizeSpaces(value: string): string {
  return value.trim().replace(/\s+/g, " ");
}

export function normalizePhoneValue(value: string): string {
  const digits = value.replace(/\D/g, "");
  return digits.startsWith("84") ? `0${digits.slice(2)}` : digits;
}

export function sanitizePhoneInput(value: string): string {
  return normalizePhoneValue(value).slice(0, INPUT_LIMITS.phone);
}

export function sanitizeAppointmentCodeInput(value: string): string {
  const digits = value.replace(/\D/g, "").slice(0, 8);

  if (!digits) {
    return value.trim().toUpperCase().startsWith("F") ? "FN-" : "";
  }

  if (digits.length <= 4) {
    return `FN-${digits}`;
  }

  return `FN-${digits.slice(0, 4)}-${digits.slice(4)}`;
}

export function sanitizeIntegerInput(
  value: string,
  min = INPUT_LIMITS.sortOrderMin,
  max = INPUT_LIMITS.sortOrderMax,
): number {
  const digits = value.replace(/\D/g, "");
  if (!digits) return min;

  const parsed = Number(digits);
  if (!Number.isFinite(parsed)) return min;

  return Math.min(max, Math.max(min, parsed));
}
