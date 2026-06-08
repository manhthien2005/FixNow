import Link from "next/link";
import type { Metadata } from "next";
import { Mail, MapPin, MessageSquare, Phone } from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Liên hệ",
  description:
    "Liên hệ FixNow qua hotline, Zalo hoặc email. FixNow phục vụ tận nơi trong bán kính 3–5km nội thành TP.HCM.",
};

interface ContactItem {
  icon: typeof Phone;
  label: string;
  value: string;
  href: string;
}

const CONTACT_ITEMS: ContactItem[] = [
  {
    icon: Phone,
    label: "Hotline / Zalo",
    value: "1900-xxxx",
    href: "tel:1900xxxx",
  },
  {
    icon: MessageSquare,
    label: "Zalo OA",
    value: "zalo.me/fixnow",
    href: "https://zalo.me/fixnow",
  },
  {
    icon: Mail,
    label: "Email",
    value: "support@fixnow.vn",
    href: "mailto:support@fixnow.vn",
  },
];

export default function ContactPage() {
  return (
    <div className="container mx-auto px-4 py-12 md:py-16">
      <div className="mx-auto max-w-2xl text-center">
        <h1 className="text-3xl font-bold md:text-4xl">Liên hệ FixNow</h1>
        <p className="mt-3 text-muted-foreground">
          Chúng tôi luôn sẵn sàng hỗ trợ kỹ thuật trong giờ làm việc.
        </p>
      </div>

      <div className="mt-10 grid grid-cols-1 gap-6 md:grid-cols-2">
        <div className="flex flex-col gap-4">
          {CONTACT_ITEMS.map(({ icon: Icon, label, value, href }) => (
            <Card key={label} className="transition-shadow hover:shadow-md">
              <CardContent className="flex items-center gap-4 p-4 md:p-6">
                <span
                  aria-hidden="true"
                  className="flex size-12 shrink-0 items-center justify-center rounded-full bg-primary/10 text-primary"
                >
                  <Icon className="size-6" />
                </span>
                <div className="min-w-0 flex-1">
                  <p className="text-sm text-muted-foreground">{label}</p>
                  <a
                    href={href}
                    className="block truncate text-lg font-semibold text-primary hover:underline"
                  >
                    {value}
                  </a>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>

        <div className="flex flex-col gap-4">
          <Card>
            <CardHeader className="flex flex-row items-center gap-3 space-y-0">
              <span
                aria-hidden="true"
                className="flex size-10 shrink-0 items-center justify-center rounded-full bg-accent/10 text-accent"
              >
                <MapPin className="size-5" />
              </span>
              <CardTitle className="text-xl">Khu vực phục vụ</CardTitle>
            </CardHeader>
            <CardContent className="space-y-3 text-base leading-relaxed">
              <p>
                FixNow phục vụ tận nơi trong bán kính 3–5km nội thành TP.HCM.
                Khu vực ngoại thành vui lòng liên hệ trước.
              </p>
              <p className="text-sm text-muted-foreground">
                Giờ làm việc: 8h00 – 20h00 hàng ngày.
              </p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="text-xl">Bản đồ</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex h-40 items-center justify-center rounded-md bg-muted text-sm text-muted-foreground">
                Bản đồ sẽ cập nhật sớm.
              </div>
            </CardContent>
          </Card>
        </div>
      </div>

      <div className="mt-10 rounded-lg border bg-muted/40 p-6 text-center md:p-8">
        <h2 className="text-2xl font-bold">Cần sửa máy ngay?</h2>
        <p className="mt-2 text-muted-foreground">
          Đặt lịch online, kỹ thuật viên FixNow sẽ liên hệ xác nhận.
        </p>
        <Button asChild size="lg" className="mt-4">
          <Link href="/booking">Đặt lịch</Link>
        </Button>
      </div>
    </div>
  );
}
