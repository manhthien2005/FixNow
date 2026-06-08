import { redirect } from "next/navigation";

import { auth } from "@/lib/auth";
import { RegisterForm } from "@/components/features/register-form";

export const metadata = { title: "Đăng ký" };

export default async function RegisterPage({
  searchParams,
}: {
  searchParams: Promise<{ callbackUrl?: string }>;
}) {
  const session = await auth();
  const sp = await searchParams;
  if (session?.user) redirect(sp.callbackUrl ?? "/");
  return <RegisterForm callbackUrl={sp.callbackUrl} />;
}
