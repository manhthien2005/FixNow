"use client";

import { useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";
import { MapPin, Plus } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormDescription,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Textarea } from "@/components/ui/textarea";
import { BookingDateTimePicker } from "@/components/features/booking-date-time-picker";
import { DEVICE_TYPE_LABEL, SERVICE_GROUPS } from "@/lib/labels";
import {
  bookingFormSchema,
  type BookingInput,
} from "@/lib/validations/booking";
import type { DeviceType } from "@/db/schema";
import {
  INPUT_LIMITS,
  PHONE_RAW_INPUT_MAX_LENGTH,
  limitText,
  normalizeSpaces,
  sanitizePhoneInput,
} from "@/lib/input-normalizers";
import { useI18n } from "@/components/i18n/language-provider";

export interface SavedAddress {
  id: string;
  label: string | null;
  address: string;
  isDefault: boolean;
}

interface BookingFormProps {
  defaultValues?: Partial<BookingInput>;
  discountEligible?: boolean;
  discountPercent?: number;
  savedAddresses?: SavedAddress[];
}

type FieldErrorMap = Partial<Record<keyof BookingInput, string[]>>;

const DRAFT_STORAGE_KEY = "fixnow:booking-draft";

const DEVICE_TYPE_OPTIONS = Object.entries(DEVICE_TYPE_LABEL) as [
  DeviceType,
  string,
][];

export function BookingForm({
  defaultValues,
  discountEligible = false,
  discountPercent = 10,
  savedAddresses = [],
}: BookingFormProps) {
  const router = useRouter();
  const { dictionary, locale } = useI18n();
  const isVi = locale === "vi";
  const addressInputRef = useRef<HTMLInputElement | null>(null);

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingFormSchema),
    defaultValues: {
      customerName: "",
      phone: "",
      address: "",
      deviceType: "LAPTOP" as const,
      serviceGroup: SERVICE_GROUPS[0],
      issueDescription: "",
      preferredTime: "",
      useVerificationDiscount: false,
      ...defaultValues,
    },
  });

  // Restore a previously saved draft once on mount.
  useEffect(() => {
    if (typeof window === "undefined") return;
    try {
      const raw = window.localStorage.getItem(DRAFT_STORAGE_KEY);
      if (!raw) return;
      const draft = JSON.parse(raw) as Partial<BookingInput>;
      form.reset({ ...form.getValues(), ...draft });
    } catch {
      // ignore malformed drafts
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Persist the form to localStorage as the user types.
  useEffect(() => {
    const subscription = form.watch((values) => {
      try {
        window.localStorage.setItem(DRAFT_STORAGE_KEY, JSON.stringify(values));
      } catch {
        // storage may be unavailable (private mode / quota) — ignore
      }
    });
    return () => subscription.unsubscribe();
  }, [form]);

  async function onSubmit(data: BookingInput) {
    try {
      const payload: Record<string, unknown> = {
        customerName: normalizeSpaces(data.customerName),
        phone: sanitizePhoneInput(data.phone),
        address: normalizeSpaces(data.address),
        deviceType: data.deviceType,
        serviceGroup: data.serviceGroup,
        issueDescription: data.issueDescription.trim(),
        useVerificationDiscount:
          discountEligible && Boolean(data.useVerificationDiscount),
      };

      if (data.preferredTime && data.preferredTime.length > 0) {
        payload.preferredTime = data.preferredTime;
      }

      const res = await fetch("/api/appointments", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      if (res.status === 201) {
        const result = (await res.json()) as {
          appointment: { id: string; appointmentCode: string };
          discountApplied?: boolean;
          discountRequested?: boolean;
        };
        try {
          window.localStorage.removeItem(DRAFT_STORAGE_KEY);
        } catch {
          // ignore
        }
        if (result.discountRequested && result.discountApplied === false) {
          toast.warning(
            locale === "vi"
              ? "Ưu đãi chưa được áp dụng (đã dùng hoặc chưa đủ điều kiện). Đơn vẫn được tạo."
              : "The discount was not applied (already used or not eligible). Your booking was still created.",
          );
        }
        router.push(
          `/booking/success?code=${encodeURIComponent(
            result.appointment.appointmentCode,
          )}`,
        );
        return;
      }

      if (res.status === 400) {
        const body = (await res.json().catch(() => ({}))) as {
          details?: { fieldErrors?: FieldErrorMap };
        };
        const fieldErrors = body.details?.fieldErrors ?? {};
        let matched = false;
        (Object.keys(fieldErrors) as (keyof BookingInput)[]).forEach(
          (field) => {
            const messages = fieldErrors[field];
            if (messages && messages.length > 0) {
              matched = true;
              form.setError(field, { message: messages[0] });
            }
          },
        );
        if (!matched) {
          toast.error(dictionary.booking.invalidData);
        }
        return;
      }

      toast.error(dictionary.booking.genericError);
    } catch {
      toast.error(dictionary.booking.genericError);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">{dictionary.booking.formTitle}</CardTitle>
        <CardDescription>
          {dictionary.booking.formDescription}
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-5"
            noValidate
          >
            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="customerName"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.booking.name}</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="name"
                        placeholder={dictionary.booking.namePlaceholder}
                        className="h-11 text-base"
                        maxLength={INPUT_LIMITS.name}
                        {...field}
                        onChange={(event) =>
                          field.onChange(
                            limitText(event.target.value, INPUT_LIMITS.name),
                          )
                        }
                        onBlur={(event) => {
                          field.onChange(normalizeSpaces(event.target.value));
                          field.onBlur();
                        }}
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="phone"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.booking.phone}</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="0901234567"
                        className="h-11 text-base"
                        maxLength={PHONE_RAW_INPUT_MAX_LENGTH}
                        {...field}
                        onChange={(event) =>
                          field.onChange(sanitizePhoneInput(event.target.value))
                        }
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="address"
              render={({ field }) => (
              <FormItem>
                  <FormLabel>{dictionary.booking.address}</FormLabel>
                  {savedAddresses.length > 0 ? (
                    <div className="flex flex-wrap gap-2 pb-1">
                      {savedAddresses.map((saved) => {
                        const active = field.value === saved.address;
                        return (
                          <button
                            key={saved.id}
                            type="button"
                            onClick={() => field.onChange(saved.address)}
                            className={`inline-flex max-w-full items-center gap-1.5 rounded-full border px-3 py-1.5 text-sm transition-colors ${
                              active
                                ? "border-primary bg-primary/10 text-primary"
                                : "border-border text-muted-foreground hover:bg-accent"
                            }`}
                          >
                            <MapPin className="size-3.5 shrink-0" aria-hidden="true" />
                            <span className="truncate">
                              {saved.label || saved.address}
                            </span>
                          </button>
                        );
                      })}
                      <button
                        type="button"
                        onClick={() => {
                          field.onChange("");
                          window.setTimeout(() => addressInputRef.current?.focus(), 0);
                        }}
                        className="inline-flex items-center gap-1.5 rounded-full border border-dashed border-border px-3 py-1.5 text-sm text-muted-foreground transition-colors hover:bg-accent"
                      >
                        <Plus className="size-3.5" aria-hidden="true" />
                        {isVi ? "Địa chỉ khác" : "Other address"}
                      </button>
                    </div>
                  ) : null}
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="street-address"
                      placeholder={dictionary.booking.addressPlaceholder}
                      className="h-11 text-base"
                      maxLength={INPUT_LIMITS.address}
                      {...field}
                      ref={(el) => {
                        field.ref(el);
                        addressInputRef.current = el;
                      }}
                      onChange={(event) =>
                        field.onChange(
                          limitText(event.target.value, INPUT_LIMITS.address),
                        )
                      }
                      onBlur={(event) => {
                        field.onChange(normalizeSpaces(event.target.value));
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <div className="grid grid-cols-1 gap-5 md:grid-cols-2">
              <FormField
                control={form.control}
                name="deviceType"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.booking.deviceType}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 text-base md:text-sm">
                          <SelectValue
                            placeholder={dictionary.booking.devicePlaceholder}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEVICE_TYPE_OPTIONS.map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {dictionary.labels.deviceType[value] ?? label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />

              <FormField
                control={form.control}
                name="serviceGroup"
                render={({ field }) => (
                  <FormItem>
                    <FormLabel>{dictionary.booking.serviceGroup}</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 text-base md:text-sm">
                          <SelectValue
                            placeholder={dictionary.booking.servicePlaceholder}
                          />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICE_GROUPS.map((group, index) => (
                          <SelectItem key={group} value={group}>
                            {dictionary.labels.serviceGroups[index] ?? group}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>

            <FormField
              control={form.control}
              name="issueDescription"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.booking.issue}</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder={dictionary.booking.issuePlaceholder}
                      className="text-base md:text-sm"
                      maxLength={INPUT_LIMITS.issueDescription}
                      {...field}
                      onChange={(event) =>
                        field.onChange(
                          limitText(
                            event.target.value,
                            INPUT_LIMITS.issueDescription,
                          ),
                        )
                      }
                      onBlur={(event) => {
                        field.onChange(event.target.value.trim());
                        field.onBlur();
                      }}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />

            <FormField
              control={form.control}
              name="preferredTime"
              render={({ field }) => (
                <FormItem className="md:max-w-sm">
                  <FormLabel>{dictionary.booking.preferredTime}</FormLabel>
                  <FormControl>
                    <BookingDateTimePicker
                      value={field.value ?? ""}
                      onChange={field.onChange}
                    />
                  </FormControl>
                  <FormDescription>
                    {dictionary.booking.timeDescription}
                  </FormDescription>
                  <FormMessage />
                </FormItem>
              )}
            />

            {discountEligible ? (
              <FormField
                control={form.control}
                name="useVerificationDiscount"
                render={({ field }) => (
                  <FormItem className="rounded-2xl border border-secondary/20 bg-secondary/5 p-4">
                    <label className="flex cursor-pointer items-start gap-3">
                      <input
                        type="checkbox"
                        checked={Boolean(field.value)}
                        onChange={(event) => field.onChange(event.target.checked)}
                        className="mt-1 size-4 accent-primary"
                      />
                      <span>
                        <span className="block font-semibold text-on-surface">
                          {locale === "vi"
                            ? `Dùng ưu đãi xác thực -${discountPercent}%`
                            : `Use verified discount -${discountPercent}%`}
                        </span>
                        <span className="mt-1 block text-sm text-muted-foreground">
                          {dictionary.booking.useDiscountText ??
                            "Ưu đãi chỉ áp dụng một lần cho tài khoản đã xác thực."}
                        </span>
                      </span>
                    </label>
                  </FormItem>
                )}
              />
            ) : null}

            <div className="space-y-3 pt-2">
              <Button
                type="submit"
                size="lg"
                disabled={isSubmitting}
                className="h-11 w-full md:w-auto md:px-12"
              >
                {isSubmitting
                  ? dictionary.booking.submitting
                  : dictionary.booking.submit}
              </Button>
              <p className="text-sm text-muted-foreground">
                {dictionary.booking.afterSubmit}
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
