import type { Metadata } from "next";
import { eq } from "drizzle-orm";

import { db } from "@/db";
import { users } from "@/db/schema";
import { auth } from "@/lib/auth";
import { BookingForm } from "@/components/features/booking-form";
import type { BookingInput } from "@/lib/validations/booking";
import { getDictionary } from "@/lib/i18n";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Đặt lịch",
  description: "Đặt lịch sửa chữa laptop / PC tận nơi với FixNow.",
};

export default async function BookingPage() {
  const locale = await getLocale();
  const dictionary = getDictionary(locale);
  const session = await auth();

  let defaults: Partial<BookingInput> | undefined;
  if (session?.user?.id) {
    const me = await db.query.users.findFirst({
      where: eq(users.id, session.user.id),
      columns: { fullName: true, phone: true },
    });
    if (me) {
      defaults = { customerName: me.fullName, phone: me.phone };
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
      <BookingForm defaultValues={defaults} />
    </div>
  );
}
