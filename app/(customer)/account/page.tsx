import Link from "next/link";
import type { Metadata } from "next";
import { redirect } from "next/navigation";
import { eq } from "drizzle-orm";
import { ClipboardList, Mail, Phone, ShieldCheck } from "lucide-react";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { ROLE_LABEL } from "@/lib/labels";
import { GridBackdrop } from "@/components/marketing/grid-backdrop";
import { ScrollReveal } from "@/components/features/home/scroll-reveal";
import { AccountForms } from "@/components/features/account/account-forms";

export const metadata: Metadata = {
  title: "Tài khoản",
  description: "Quản lý thông tin tài khoản FixNow của bạn.",
};

export default async function AccountPage() {
  const session = await auth();
  if (!session?.user?.id) redirect("/login?callbackUrl=/account");

  const user = await db.query.users.findFirst({
    where: eq(users.id, session.user.id),
    columns: { fullName: true, phone: true, email: true, role: true, createdAt: true },
  });
  if (!user) redirect("/login");

  const initials = user.fullName
    .split(" ")
    .map((w) => w[0])
    .filter(Boolean)
    .slice(-2)
    .join("")
    .toUpperCase();

  return (
    <>
      <ScrollReveal />

      {/* Header / profile summary */}
      <section className="relative overflow-hidden border-b border-white/5 bg-background py-14 md:py-20">
        <GridBackdrop />
        <div aria-hidden className="absolute right-[12%] top-0 h-64 w-64 rounded-full bg-secondary/10 blur-[130px]" />
        <div className="relative mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop">
          <p className="mb-3 font-mono text-label-sm uppercase tracking-widest text-secondary">
            &gt; MY_ACCOUNT
          </p>
          <div className="flex flex-col gap-5 sm:flex-row sm:items-center">
            <span className="flex size-20 shrink-0 items-center justify-center rounded-2xl border border-white/10 bg-surface-container-high/50 text-2xl font-bold text-secondary">
              {initials || "FN"}
            </span>
            <div>
              <h1 className="text-display-lg-mobile text-on-surface">
                {user.fullName}
              </h1>
              <div className="mt-2 flex flex-wrap items-center gap-x-5 gap-y-1 text-body-md text-on-surface-variant">
                <span className="inline-flex items-center gap-1.5">
                  <Phone className="size-4 text-secondary" aria-hidden="true" />
                  {user.phone}
                </span>
                {user.email ? (
                  <span className="inline-flex items-center gap-1.5">
                    <Mail className="size-4 text-secondary" aria-hidden="true" />
                    {user.email}
                  </span>
                ) : null}
                <span className="inline-flex items-center gap-1.5">
                  <ShieldCheck className="size-4 text-secondary" aria-hidden="true" />
                  {ROLE_LABEL[user.role]}
                </span>
              </div>
            </div>
            <Link
              href="/my-appointments"
              className="glass-panel inline-flex w-max items-center gap-2 rounded-xl px-6 py-3 font-mono text-label-md font-bold uppercase tracking-wider text-on-surface transition-colors hover:bg-white/10 sm:ml-auto"
            >
              <ClipboardList className="size-5" />
              Lịch hẹn của tôi
            </Link>
          </div>
        </div>
      </section>

      {/* Forms */}
      <section className="relative bg-background py-12 md:py-16">
        <div className="fade-in-up mx-auto max-w-5xl px-margin-mobile md:px-margin-desktop">
          <AccountForms fullName={user.fullName} email={user.email ?? ""} />
        </div>
      </section>
    </>
  );
}
