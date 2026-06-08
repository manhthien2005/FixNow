import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { ForgotPasswordForm } from "@/components/features/forgot-password-form";

export const metadata = { title: "Quên mật khẩu" };

export default async function ForgotPasswordPage() {
  const session = await auth();
  if (session?.user) redirect("/");
  return <ForgotPasswordForm />;
}
