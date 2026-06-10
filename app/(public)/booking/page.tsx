import Link from "next/link";
import type { Metadata } from "next";
import { and, asc, desc, eq } from "drizzle-orm";
import { ShieldCheck } from "lucide-react";

import { db } from "@/db";
import { userAddresses, userVerifications, users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { BookingFormLazy } from "@/components/features/booking-form-lazy";
import type { SavedAddress } from "@/components/features/booking-form";
import type { BookingInput } from "@/lib/validations/booking";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";
import { getVerificationDiscountPercent } from "@/lib/settings";

export const metadata: Metadata = {
  title: "Đặt lịch",
  description: "Đặt lịch sửa chữa laptop / PC tận nơi với FixNow.",
};

export default async function BookingPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const session = await auth();
  const discountPercent = await getVerificationDiscountPercent();

  let defaults: Partial<BookingInput> | undefined;
  let discountEligible = false;
  let savedAddresses: SavedAddress[] = [];
  if (session?.user?.id) {
    const [me, approvedVerification, addresses] = await Promise.all([
      db.query.users.findFirst({
        where: eq(users.id, session.user.id),
        columns: {
          fullName: true,
          phone: true,
          verificationDiscountUsedAt: true,
        },
      }),
      db.query.userVerifications.findFirst({
        where: and(
          eq(userVerifications.userId, session.user.id),
          eq(userVerifications.status, "APPROVED"),
        ),
        columns: { id: true },
      }),
      db.query.userAddresses.findMany({
        where: eq(userAddresses.userId, session.user.id),
        orderBy: [desc(userAddresses.isDefault), asc(userAddresses.createdAt)],
        columns: { id: true, label: true, address: true, isDefault: true },
      }),
    ]);
    if (me) {
      const defaultAddress = addresses.find((a) => a.isDefault) ?? addresses[0];
      defaults = {
        customerName: me.fullName,
        phone: me.phone,
        ...(defaultAddress ? { address: defaultAddress.address } : {}),
      };
      discountEligible =
        approvedVerification !== undefined &&
        me.verificationDiscountUsedAt === null &&
        discountPercent > 0;
      savedAddresses = addresses;
    }
  }

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mx-auto mb-6 max-w-2xl text-center">
        <h1 className="text-3xl font-bold md:text-4xl">
          {dictionary.booking.pageTitle}
        </h1>
        <p className="mt-2 text-muted-foreground">
          {dictionary.booking.pageSubtitle}
        </p>
      </div>
      {!session?.user ? (
        <div className="mx-auto mb-6 flex max-w-2xl items-start gap-3 rounded-2xl border border-secondary/20 bg-secondary/5 p-4 text-left">
          <ShieldCheck className="mt-0.5 size-5 shrink-0 text-secondary" />
          <div>
            <p className="font-semibold">
              {locale === "vi"
                ? `Tạo tài khoản để nhận ưu đãi ${discountPercent}%`
                : `Create an account for a ${discountPercent}% discount`}
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              {locale === "vi"
                ? "Xác thực học sinh, sinh viên hoặc nhân viên trong trang tài khoản để dùng ưu đãi cho lần đặt lịch tiếp theo."
                : "Verify as a pupil, student, or employee in your account to use the discount on a future booking."}
            </p>
            <Link
              href="/register?callbackUrl=/account"
              className="mt-2 inline-flex text-sm font-medium text-primary hover:underline"
            >
              {dictionary.common.register}
            </Link>
          </div>
        </div>
      ) : null}
      <BookingFormLazy
        defaultValues={defaults}
        discountEligible={discountEligible}
        discountPercent={discountPercent}
        savedAddresses={savedAddresses}
      />
    </div>
  );
}
