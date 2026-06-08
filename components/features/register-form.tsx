"use client";

import Link from "next/link";
import { useRouter } from "next/navigation";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import { toast } from "sonner";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from "@/components/ui/form";
import { Input } from "@/components/ui/input";
import { registerSchema, type RegisterInput } from "@/lib/validations/auth";

interface RegisterFormProps {
  callbackUrl?: string;
}

type FieldErrorMap = Partial<Record<keyof RegisterInput, string[]>>;

export function RegisterForm({ callbackUrl }: RegisterFormProps) {
  const router = useRouter();

  const form = useForm<RegisterInput>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      fullName: "",
      phone: "",
      email: "",
      password: "",
      confirmPassword: "",
    },
  });

  const loginHref = callbackUrl
    ? `/login?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/login";

  async function onSubmit(data: RegisterInput) {
    try {
      const res = await fetch("/api/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(data),
      });

      if (res.status === 201) {
        toast.success("Đăng ký thành công, đang đăng nhập...");
        const result = await signIn("credentials", {
          identifier: data.phone,
          password: data.password,
          redirect: false,
        });
        if (result?.ok) {
          router.push(callbackUrl ?? "/");
          router.refresh();
        } else {
          toast.message("Đăng ký thành công. Vui lòng đăng nhập.");
          router.push("/login");
        }
        return;
      }

      if (res.status === 409) {
        const body = (await res.json().catch(() => ({}))) as {
          error?: string;
        };
        if (body.error === "phone_taken") {
          form.setError("phone", {
            message: "Số điện thoại đã được đăng ký",
          });
        } else if (body.error === "email_taken") {
          form.setError("email", { message: "Email đã được sử dụng" });
        } else {
          toast.error("Thông tin đã tồn tại, vui lòng kiểm tra lại.");
        }
        return;
      }

      if (res.status === 400) {
        const body = (await res.json().catch(() => ({}))) as {
          details?: { fieldErrors?: FieldErrorMap };
        };
        const fieldErrors = body.details?.fieldErrors ?? {};
        let matched = false;
        (Object.keys(fieldErrors) as (keyof RegisterInput)[]).forEach(
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

      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    } catch {
      toast.error("Có lỗi xảy ra, vui lòng thử lại.");
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card>
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">Đăng ký tài khoản</CardTitle>
        <CardDescription>
          Tạo tài khoản để theo dõi lịch hẹn dễ dàng hơn.
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Form {...form}>
          <form
            onSubmit={form.handleSubmit(onSubmit)}
            className="space-y-4"
            noValidate
          >
            <FormField
              control={form.control}
              name="fullName"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Họ tên</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="name"
                      placeholder="Nguyễn Văn A"
                      className="text-base"
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
                      className="text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Email (tuỳ chọn)</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="ban@example.com"
                      className="text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      className="text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <FormField
              control={form.control}
              name="confirmPassword"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Xác nhận mật khẩu</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      className="text-base"
                      {...field}
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting ? "Đang xử lý..." : "Đăng ký"}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <span>
          Đã có tài khoản?{" "}
          <Link
            href={loginHref}
            className="font-medium text-primary hover:underline"
          >
            Đăng nhập
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
