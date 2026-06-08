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
import {
  INPUT_LIMITS,
  PHONE_RAW_INPUT_MAX_LENGTH,
  limitText,
  normalizeSpaces,
  sanitizePhoneInput,
} from "@/lib/input-normalizers";
import { useI18n } from "@/components/i18n/language-provider";

interface RegisterFormProps {
  callbackUrl?: string;
}

type FieldErrorMap = Partial<Record<keyof RegisterInput, string[]>>;

export function RegisterForm({ callbackUrl }: RegisterFormProps) {
  const router = useRouter();
  const { dictionary } = useI18n();

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
        toast.success(dictionary.auth.registerSuccess);
        const result = await signIn("credentials", {
          identifier: data.phone,
          password: data.password,
          redirect: false,
        });
        if (result?.ok) {
          router.push(callbackUrl ?? "/");
          router.refresh();
        } else {
          toast.message(dictionary.auth.registerSuccessLogin);
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
            message: dictionary.auth.phoneTaken,
          });
        } else if (body.error === "email_taken") {
          form.setError("email", { message: dictionary.auth.emailTaken });
        } else {
          toast.error(dictionary.auth.duplicate);
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
          toast.error(dictionary.auth.invalidData);
        }
        return;
      }

      toast.error(dictionary.auth.genericError);
    } catch {
      toast.error(dictionary.auth.genericError);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="glass-panel border-border">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">
          {dictionary.auth.registerTitle}
        </CardTitle>
        <CardDescription>
          {dictionary.auth.registerDescription}
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
                  <FormLabel>{dictionary.common.fullName}</FormLabel>
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
                  <FormLabel>{dictionary.common.phone}</FormLabel>
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
            <FormField
              control={form.control}
              name="email"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.auth.emailOptional}</FormLabel>
                  <FormControl>
                    <Input
                      type="email"
                      autoComplete="email"
                      placeholder="ban@example.com"
                      className="h-11 text-base"
                      maxLength={INPUT_LIMITS.email}
                      {...field}
                      onChange={(event) =>
                        field.onChange(
                          limitText(event.target.value, INPUT_LIMITS.email),
                        )
                      }
                      onBlur={(event) => {
                        field.onChange(event.target.value.trim().toLowerCase());
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
              name="password"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.common.password}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      className="h-11 text-base"
                      maxLength={INPUT_LIMITS.password}
                      {...field}
                      onChange={(event) =>
                        field.onChange(
                          limitText(event.target.value, INPUT_LIMITS.password),
                        )
                      }
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
                  <FormLabel>{dictionary.auth.confirmPassword}</FormLabel>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="new-password"
                      className="h-11 text-base"
                      maxLength={INPUT_LIMITS.password}
                      {...field}
                      onChange={(event) =>
                        field.onChange(
                          limitText(event.target.value, INPUT_LIMITS.password),
                        )
                      }
                    />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <Button
              type="submit"
              className="h-11 w-full"
              size="lg"
              disabled={isSubmitting}
            >
              {isSubmitting
                ? dictionary.common.processing
                : dictionary.auth.registerButton}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <span>
          {dictionary.auth.hasAccount}{" "}
          <Link
            href={loginHref}
            className="font-medium text-primary hover:underline"
          >
            {dictionary.auth.loginButton}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
