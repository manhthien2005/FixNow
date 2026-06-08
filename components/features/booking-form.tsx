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
import { DEVICE_TYPE_LABEL, SERVICE_GROUPS } from "@/lib/labels";
import { bookingSchema, type BookingInput } from "@/lib/validations/booking";
import type { DeviceType } from "@/db/schema";

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

  const form = useForm<BookingInput>({
    resolver: zodResolver(bookingSchema),
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
        customerName: data.customerName,
        phone: data.phone,
        address: data.address,
        deviceType: data.deviceType,
        serviceGroup: data.serviceGroup,
        issueDescription: data.issueDescription,
      };

      if (data.preferredTime && data.preferredTime.length > 0) {
        payload.preferredTime = new Date(data.preferredTime).toISOString();
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
          toast.error("Dữ liệu không hợp lệ, vui lòng kiểm tra lại.");
        }
        return;
      }

      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại sau.");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="mx-auto max-w-2xl">
      <CardHeader>
        <CardTitle className="text-2xl">Đặt lịch sửa chữa</CardTitle>
        <CardDescription>
          Điền thông tin để FixNow liên hệ và lên lịch hẹn.
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
                    <FormLabel>Họ tên</FormLabel>
                    <FormControl>
                      <Input
                        type="text"
                        autoComplete="name"
                        placeholder="Nguyễn Văn A"
                        className="h-11 text-base"
                        {...field}
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
                    <FormLabel>Số điện thoại</FormLabel>
                    <FormControl>
                      <Input
                        type="tel"
                        inputMode="tel"
                        autoComplete="tel"
                        placeholder="0901234567"
                        className="h-11 text-base"
                        {...field}
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
                  <FormLabel>Địa chỉ</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="street-address"
                      placeholder="Số nhà, đường, quận, thành phố"
                      className="h-11 text-base"
                      {...field}
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
                    <FormLabel>Loại thiết bị</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 text-base md:text-sm">
                          <SelectValue placeholder="Chọn loại thiết bị" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {DEVICE_TYPE_OPTIONS.map(([value, label]) => (
                          <SelectItem key={value} value={value}>
                            {label}
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
                    <FormLabel>Nhóm dịch vụ cần sửa</FormLabel>
                    <Select
                      onValueChange={field.onChange}
                      value={field.value}
                    >
                      <FormControl>
                        <SelectTrigger className="h-11 text-base md:text-sm">
                          <SelectValue placeholder="Chọn nhóm dịch vụ" />
                        </SelectTrigger>
                      </FormControl>
                      <SelectContent>
                        {SERVICE_GROUPS.map((group) => (
                          <SelectItem key={group} value={group}>
                            {group}
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
                  <FormLabel>Mô tả lỗi</FormLabel>
                  <FormControl>
                    <Textarea
                      rows={4}
                      placeholder="Mô tả tình trạng máy (ít nhất 10 ký tự)"
                      className="text-base md:text-sm"
                      {...field}
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
                  <FormLabel>Thời gian mong muốn (tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Input
                      type="datetime-local"
                      className="h-11 text-base"
                      {...field}
                      value={field.value ?? ""}
                    />
                  </FormControl>
                  <FormDescription>
                    Để trống nếu bạn không có giờ cụ thể.
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
                {isSubmitting ? "Đang gửi..." : "Gửi yêu cầu"}
              </Button>
              <p className="text-sm text-muted-foreground">
                Sau khi gửi, bạn sẽ nhận được mã lịch hẹn để tra cứu trạng
                thái.
              </p>
            </div>
          </form>
        </Form>
      </CardContent>
    </Card>
  );
}
