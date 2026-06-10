import Link from "next/link";
import type { Metadata } from "next";
import { desc, eq } from "drizzle-orm";
import { ExternalLink, ShieldCheck } from "lucide-react";

import { VerificationReviewActions } from "@/components/features/admin/verification-review-actions";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { db } from "@/db";
import { userVerifications, type VerificationStatus } from "@/db/schema";
import { adminVerificationFilterSchema } from "@/lib/validations/admin";
import { verificationProofSignedUrl } from "@/lib/storage";
import { formatDateByLocale } from "@/lib/utils";
import { getLocale } from "@/lib/i18n-server";

export const metadata: Metadata = {
  title: "Duyệt xác thực",
  description: "Duyệt minh chứng ưu đãi học sinh, sinh viên, nhân viên.",
};

interface AdminVerificationsPageProps {
  searchParams: Promise<{ status?: string }>;
}

const STATUS_LABEL: Record<VerificationStatus, { vi: string; en: string }> = {
  PENDING: { vi: "Đang chờ", en: "Pending" },
  APPROVED: { vi: "Đã duyệt", en: "Approved" },
  REJECTED: { vi: "Từ chối", en: "Rejected" },
};

const SUBJECT_LABEL = {
  PUPIL: { vi: "Học sinh", en: "Pupil" },
  STUDENT: { vi: "Sinh viên", en: "Student" },
  EMPLOYEE: { vi: "Nhân viên", en: "Employee" },
} as const;

export default async function AdminVerificationsPage({
  searchParams,
}: AdminVerificationsPageProps) {
  const locale = await getLocale();
  const isVi = locale === "vi";
  const sp = await searchParams;
  const parsed = adminVerificationFilterSchema.safeParse(sp);
  const status = parsed.success ? parsed.data.status : undefined;
  const selectedStatus: VerificationStatus = status ?? "PENDING";

  const rows = await db.query.userVerifications.findMany({
    where: eq(userVerifications.status, selectedStatus),
    orderBy: [desc(userVerifications.createdAt)],
    limit: 50,
    columns: {
      id: true,
      subject: true,
      organization: true,
      identifier: true,
      proofPath: true,
      status: true,
      rejectReason: true,
      createdAt: true,
      reviewedAt: true,
    },
    with: {
      user: {
        columns: {
          fullName: true,
          phone: true,
          email: true,
          verificationDiscountUsedAt: true,
        },
      },
    },
  });

  const items = await Promise.all(
    rows.map(async (row) => ({
      ...row,
      proofUrl: await verificationProofSignedUrl(row.proofPath),
    })),
  );

  function statusHref(nextStatus: VerificationStatus) {
    return `/admin/verifications?status=${nextStatus}`;
  }

  return (
    <div className="container mx-auto px-4 py-8 md:px-6 md:py-12">
      <div className="flex flex-col gap-1">
        <h1 className="text-3xl font-bold md:text-4xl">
          {isVi ? "Duyệt xác thực" : "Verification reviews"}
        </h1>
        <p className="text-sm text-muted-foreground">
          {isVi
            ? "Duyệt minh chứng để cấp 1 lượt ưu đãi 10%."
            : "Review proof documents to grant one 10% discount."}
        </p>
      </div>

      <div className="mt-6 flex flex-wrap gap-2">
        {(Object.keys(STATUS_LABEL) as VerificationStatus[]).map((value) => (
          <Button
            key={value}
            asChild
            variant={selectedStatus === value ? "default" : "outline"}
            size="sm"
          >
            <Link href={statusHref(value)}>{STATUS_LABEL[value][locale]}</Link>
          </Button>
        ))}
      </div>

      <div className="mt-6 grid grid-cols-1 gap-4 lg:grid-cols-2">
        {items.length === 0 ? (
          <Card className="lg:col-span-2">
            <CardContent className="flex flex-col items-center gap-3 py-12 text-center">
              <ShieldCheck className="size-10 text-muted-foreground" />
              <p className="font-semibold">
                {isVi ? "Không có hồ sơ phù hợp." : "No matching submissions."}
              </p>
            </CardContent>
          </Card>
        ) : (
          items.map((item) => (
            <Card key={item.id}>
              <CardHeader className="space-y-3">
                <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
                  <div>
                    <CardTitle className="text-lg">
                      {item.user.fullName}
                    </CardTitle>
                    <p className="mt-1 text-sm text-muted-foreground">
                      {item.user.email} · {item.user.phone}
                    </p>
                  </div>
                  <Badge variant={item.status === "APPROVED" ? "default" : "outline"}>
                    {STATUS_LABEL[item.status][locale]}
                  </Badge>
                </div>
              </CardHeader>
              <CardContent className="space-y-4">
                <dl className="grid grid-cols-1 gap-3 text-sm sm:grid-cols-2">
                  <div>
                    <dt className="text-muted-foreground">
                      {isVi ? "Đối tượng" : "Type"}
                    </dt>
                    <dd className="font-medium">
                      {SUBJECT_LABEL[item.subject][locale]}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      {isVi ? "Trường/công ty" : "School/company"}
                    </dt>
                    <dd className="font-medium">{item.organization}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      {isVi ? "Mã số" : "ID"}
                    </dt>
                    <dd className="font-medium">{item.identifier || "-"}</dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      {isVi ? "Ngày gửi" : "Submitted"}
                    </dt>
                    <dd className="font-medium">
                      {formatDateByLocale(item.createdAt, locale)}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      {isVi ? "Ưu đãi" : "Discount"}
                    </dt>
                    <dd className="font-medium">
                      {item.user.verificationDiscountUsedAt
                        ? isVi
                          ? "Đã dùng"
                          : "Used"
                        : isVi
                          ? "Chưa dùng"
                          : "Unused"}
                    </dd>
                  </div>
                  <div>
                    <dt className="text-muted-foreground">
                      {isVi ? "Minh chứng" : "Proof"}
                    </dt>
                    <dd>
                      {item.proofUrl ? (
                        <a
                          href={item.proofUrl}
                          target="_blank"
                          rel="noreferrer"
                          className="inline-flex items-center gap-1 font-medium text-primary hover:underline"
                        >
                          {isVi ? "Mở ảnh" : "Open image"}
                          <ExternalLink className="size-3.5" />
                        </a>
                      ) : (
                        <span className="text-muted-foreground">
                          {isVi ? "Không tạo được link" : "No signed URL"}
                        </span>
                      )}
                    </dd>
                  </div>
                </dl>

                {item.rejectReason ? (
                  <p className="rounded-lg border border-destructive/20 bg-destructive/5 p-3 text-sm text-destructive">
                    {item.rejectReason}
                  </p>
                ) : null}

                <VerificationReviewActions
                  id={item.id}
                  disabled={item.status !== "PENDING"}
                />
              </CardContent>
            </Card>
          ))
        )}
      </div>
    </div>
  );
}
