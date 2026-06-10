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
import { loginSchema, type LoginInput } from "@/lib/validations/auth";
import { INPUT_LIMITS, limitText } from "@/lib/input-normalizers";
import { useI18n } from "@/components/i18n/language-provider";

interface LoginFormProps {
  callbackUrl?: string;
}

export function LoginForm({ callbackUrl }: LoginFormProps) {
  const router = useRouter();
  const { dictionary } = useI18n();

  const form = useForm<LoginInput>({
    resolver: zodResolver(loginSchema),
    defaultValues: { identifier: "", password: "" },
  });

  const registerHref = callbackUrl
    ? `/register?callbackUrl=${encodeURIComponent(callbackUrl)}`
    : "/register";

  async function onSubmit(data: LoginInput) {
    try {
      const result = await signIn("credentials", {
        identifier: data.identifier,
        password: data.password,
        redirect: false,
      });

      if (result?.error) {
        toast.error(dictionary.auth.invalidCredentials);
        form.setError("password", {
          message: dictionary.auth.invalidCredentials,
        });
        return;
      }

      if (result?.ok) {
        router.push(callbackUrl ?? "/my-appointments");
        router.refresh();
      }
    } catch {
      toast.error(dictionary.auth.genericError);
    }
  }

  const isSubmitting = form.formState.isSubmitting;

  return (
    <Card className="glass-panel border-border">
      <CardHeader className="space-y-2 text-center">
        <CardTitle className="text-2xl">{dictionary.auth.loginTitle}</CardTitle>
        <CardDescription>
          {dictionary.auth.loginDescription}
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
              name="identifier"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>{dictionary.auth.identifier}</FormLabel>
                  <FormControl>
                    <Input
                      type="text"
                      autoComplete="username"
                      placeholder="0901234567"
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
                  <div className="flex items-center justify-between">
                    <FormLabel>{dictionary.common.password}</FormLabel>
                    <Link
                      href="/forgot-password"
                      className="text-sm font-medium text-primary hover:underline"
                    >
                      {dictionary.auth.forgotPassword}
                    </Link>
                  </div>
                  <FormControl>
                    <Input
                      type="password"
                      autoComplete="current-password"
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
                : dictionary.auth.loginButton}
            </Button>
          </form>
        </Form>
      </CardContent>
      <CardFooter className="justify-center text-sm text-muted-foreground">
        <span>
          {dictionary.auth.noAccount}{" "}
          <Link
            href={registerHref}
            className="font-medium text-primary hover:underline"
          >
            {dictionary.auth.registerButton}
          </Link>
        </span>
      </CardFooter>
    </Card>
  );
}
