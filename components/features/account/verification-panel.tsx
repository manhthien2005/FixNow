"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { toast } from "sonner";
import { BadgeCheck, Clock, Loader2, ShieldCheck, X, XCircle } from "lucide-react";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useI18n } from "@/components/i18n/language-provider";
import type { VerificationStatus, VerificationSubject } from "@/db/schema";
import { INPUT_LIMITS, limitText, normalizeSpaces } from "@/lib/input-normalizers";

type VerificationSummary = {
  subject: VerificationSubject;
  organization: string;
  identifier: string | null;
  status: VerificationStatus;
  rejectReason: string | null;
  createdAt: Date | string;
  reviewedAt: Date | string | null;
} | null;

interface VerificationPanelProps {
  latest: VerificationSummary;
  discountUsedAt: Date | string | null;
}

const SUBJECT_LABELS: Record<VerificationSubject, { vi: string; en: string }> = {
  PUPIL: { vi: "Học sinh", en: "Pupil" },
  STUDENT: { vi: "Sinh viên", en: "Student" },
  EMPLOYEE: { vi: "Nhân viên", en: "Employee" },
};

export function VerificationPanel({
  latest,
  discountUsedAt,
}: VerificationPanelProps) {
  const router = useRouter();
  const { locale } = useI18n();
  const isVi = locale === "vi";
  const [subject, setSubject] = useState<VerificationSubject>("STUDENT");
  const [organization, setOrganization] = useState("");
  const [identifier, setIdentifier] = useState("");
  const [file, setFile] = useState<File | null>(null);
  const [previewUrl, setPreviewUrl] = useState<string | null>(null);
  const [submitting, setSubmitting] = useState(false);

  // Build (and revoke) an object URL for the selected proof image preview.
  useEffect(() => {
    if (!file) {
      setPreviewUrl(null);
      return;
    }
    const url = URL.createObjectURL(file);
    setPreviewUrl(url);
    return () => URL.revokeObjectURL(url);
  }, [file]);

  const statusContent = latest
    ? {
        PENDING: {
          icon: Clock,
          label: isVi ? "Đang chờ duyệt" : "Pending review",
          className: "text-amber-500",
        },
        APPROVED: {
          icon: BadgeCheck,
          label: isVi ? "Đã xác thực" : "Verified",
          className: "text-emerald-500",
        },
        REJECTED: {
          icon: XCircle,
          label: isVi ? "Bị từ chối" : "Rejected",
          className: "text-destructive",
        },
      }[latest.status]
    : null;

  async function submit(event: React.FormEvent) {
    event.preventDefault();
    if (!file) {
      toast.error(isVi ? "Chọn ảnh minh chứng." : "Choose a proof image.");
      return;
    }

    setSubmitting(true);
    try {
      const form = new FormData();
      form.set("subject", subject);
      form.set("organization", normalizeSpaces(organization));
      form.set("identifier", normalizeSpaces(identifier));
      form.set("proof", file);

      const res = await fetch("/api/account/verification", {
        method: "POST",
        body: form,
      });
      const data = (await res.json().catch(() => ({}))) as { message?: string };
      if (!res.ok) {
        toast.error(
          data.message ??
            (isVi ? "Không thể gửi minh chứng." : "Could not submit proof."),
        );
        return;
      }

      toast.success(
        isVi
          ? "Đã gửi minh chứng. Admin sẽ duyệt trong thời gian sớm nhất."
          : "Proof submitted. Admin will review it soon.",
      );
      setFile(null);
      router.refresh();
    } catch {
      toast.error(isVi ? "Lỗi mạng, vui lòng thử lại." : "Network error. Please try again.");
    } finally {
      setSubmitting(false);
    }
  }

  return (
    <section className="glass-panel rounded-2xl p-6 md:p-8">
      <div className="flex items-start gap-3">
        <span className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container-high/50 text-secondary">
          <ShieldCheck className="size-5" aria-hidden="true" />
        </span>
        <div>
          <h2 className="text-headline-sm text-on-surface">
            {isVi ? "Xác thực ưu đãi 10%" : "Verify 10% discount"}
          </h2>
          <p className="mt-1 text-body-md text-on-surface-variant">
            {isVi
              ? "Học sinh, sinh viên hoặc nhân viên có thể xác thực để nhận ưu đãi 10% cho một lần đặt lịch tiếp theo."
              : "Pupils, students, or employees can verify for one 10% discount on a future booking."}
          </p>
        </div>
      </div>

      {latest && statusContent ? (
        <div className="mt-5 rounded-xl border border-border bg-surface-container/40 p-4">
          <div className="flex items-center gap-2">
            <statusContent.icon className={`size-5 ${statusContent.className}`} />
            <p className="font-semibold text-on-surface">{statusContent.label}</p>
          </div>
          <p className="mt-2 text-body-md text-on-surface-variant">
            {SUBJECT_LABELS[latest.subject][locale]} · {latest.organization}
            {latest.identifier ? ` · ${latest.identifier}` : ""}
          </p>
          {latest.status === "APPROVED" ? (
            <p className="mt-2 text-body-md text-on-surface-variant">
              {discountUsedAt
                ? isVi
                  ? "Ưu đãi 10% đã được sử dụng."
                  : "The 10% discount has been used."
                : isVi
                  ? "Bạn còn 1 lượt ưu đãi 10% khi đặt lịch."
                  : "You have one 10% booking discount available."}
            </p>
          ) : null}
          {latest.status === "REJECTED" && latest.rejectReason ? (
            <p className="mt-2 text-body-md text-destructive">
              {latest.rejectReason}
            </p>
          ) : null}
        </div>
      ) : null}

      {latest?.status === "PENDING" || latest?.status === "APPROVED" ? null : (
        <form onSubmit={submit} className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
          <div className="space-y-1.5">
            <Label>{isVi ? "Đối tượng" : "Type"}</Label>
            <Select
              value={subject}
              onValueChange={(value) => setSubject(value as VerificationSubject)}
            >
              <SelectTrigger className="h-11 text-base md:text-sm">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {Object.entries(SUBJECT_LABELS).map(([value, labels]) => (
                  <SelectItem key={value} value={value}>
                    {labels[locale]}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="verification-organization">
              {isVi ? "Trường/công ty" : "School/company"}
            </Label>
            <Input
              id="verification-organization"
              value={organization}
              onChange={(event) =>
                setOrganization(limitText(event.target.value, 120))
              }
              onBlur={(event) => setOrganization(normalizeSpaces(event.target.value))}
              className="h-11 text-base"
              required
              maxLength={120}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="verification-identifier">
              {isVi ? "Mã số (tuỳ chọn)" : "ID (optional)"}
            </Label>
            <Input
              id="verification-identifier"
              value={identifier}
              onChange={(event) =>
                setIdentifier(limitText(event.target.value, INPUT_LIMITS.note))
              }
              onBlur={(event) => setIdentifier(normalizeSpaces(event.target.value))}
              className="h-11 text-base"
              maxLength={80}
            />
          </div>
          <div className="space-y-1.5">
            <Label htmlFor="verification-proof">
              {isVi ? "Ảnh minh chứng" : "Proof image"}
            </Label>
            <Input
              id="verification-proof"
              type="file"
              accept="image/jpeg,image/png,image/webp,image/avif"
              onChange={(event) => setFile(event.target.files?.[0] ?? null)}
              className="h-11 text-base"
              required
            />
            {previewUrl ? (
              <div className="relative mt-2 w-full max-w-xs overflow-hidden rounded-xl border border-border">
                <Image
                  src={previewUrl}
                  alt={isVi ? "Xem trước minh chứng" : "Proof preview"}
                  width={320}
                  height={200}
                  unoptimized
                  className="h-44 w-full object-cover"
                />
                <button
                  type="button"
                  onClick={() => setFile(null)}
                  aria-label={isVi ? "Bỏ ảnh" : "Remove image"}
                  className="absolute right-2 top-2 inline-flex size-8 items-center justify-center rounded-full bg-background/80 text-on-surface backdrop-blur transition-colors hover:bg-background"
                >
                  <X className="size-4" />
                </button>
                {file ? (
                  <p className="truncate bg-background/80 px-3 py-1.5 text-xs text-on-surface-variant backdrop-blur">
                    {file.name}
                  </p>
                ) : null}
              </div>
            ) : null}
          </div>
          <Button
            type="submit"
            disabled={submitting}
            className="h-11 w-full md:col-span-2 md:w-max"
          >
            {submitting ? <Loader2 className="size-4 animate-spin" /> : null}
            {submitting
              ? isVi
                ? "Đang gửi..."
                : "Submitting..."
              : isVi
                ? "Gửi minh chứng"
                : "Submit proof"}
          </Button>
        </form>
      )}
    </section>
  );
}
