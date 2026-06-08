"use client";

import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { toast } from "sonner";

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

interface BookingFormProps {
  defaultValues?: Partial<BookingInput>;
}

type FieldErrorMap = Partial<Record<keyof BookingInput, string[]>>;

const DEVICE_TYPE_OPTIONS = Object.entries(DEVICE_TYPE_LABEL) as [
  DeviceType,
  string,
][];

export function BookingForm({ defaultValues }: BookingFormProps) {
  const router = useRouter();
  const { dictionary } = useI18n();

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
      ...defaultValues,
    },
  });

  async function onSubmit(data: BookingInput) {
    try {
      const payload: Record<string, unknown> = {
        customerName: normalizeSpaces(data.customerName),
        phone: sanitizePhoneInput(data.phone),
        address: normalizeSpaces(data.address),
        deviceType: data.deviceType,
        serviceGroup: data.serviceGroup,
        issueDescription: data.issueDescription.trim(),
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
        };
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
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="street-address"
                      placeholder={dictionary.booking.addressPlaceholder}
                      className="h-11 text-base"
                      maxLength={INPUT_LIMITS.address}
                      {...field}
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
