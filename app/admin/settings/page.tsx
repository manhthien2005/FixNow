import type { Metadata } from "next";

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { VerificationDiscountForm } from "@/components/features/admin/settings-form";
import { getVerificationDiscountPercent } from "@/lib/settings";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = { title: "Cài đặt" };

export const dynamic = "force-dynamic";

export default async function AdminSettingsPage() {
  const locale = await getLocale();
  const isVi = locale === "vi";
  const discountPercent = await getVerificationDiscountPercent();

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold md:text-4xl">
          {isVi ? "Cài đặt" : "Settings"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isVi
            ? "Tùy chỉnh ưu đãi và thông số chung."
            : "Configure discounts and general options."}
        </p>
      </div>

      <Card className="mt-6 max-w-xl">
        <CardHeader>
          <CardTitle className="text-lg">
            {isVi ? "Ưu đãi xác thực HS/SV/NV" : "Verified discount"}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <VerificationDiscountForm initialPercent={discountPercent} />
        </CardContent>
      </Card>
    </div>
  );
}
