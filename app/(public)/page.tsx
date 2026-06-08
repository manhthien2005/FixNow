import Link from "next/link";
import type { Metadata } from "next";
import {
  CalendarCheck,
  Clock,
  FileText,
  Hammer,
  MapPin,
  MessageSquare,
  Receipt,
  Search,
  ShieldCheck,
  Wrench,
} from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";

export const metadata: Metadata = {
  title: "Trang chủ",
  description:
    "FixNow — đặt lịch sửa chữa, bảo trì laptop và PC tận nơi. Tiện lợi, minh bạch, nhanh chóng, an toàn dữ liệu.",
};

const coreValues = [
  {
    icon: MapPin,
    title: "Tiện lợi",
    description: "Sửa tận nơi, không phải mang máy đi xa.",
  },
  {
    icon: Receipt,
    title: "Minh bạch",
    description: "Báo giá trước khi sửa, không phụ phí ẩn.",
  },
  {
    icon: Clock,
    title: "Nhanh chóng",
    description: "Phản hồi trong giờ, đa số sửa xong trong ngày.",
  },
  {
    icon: ShieldCheck,
    title: "An toàn dữ liệu",
    description: "Cam kết bảo mật dữ liệu, không sao lưu trái phép.",
  },
] as const;

const heroHighlights = [
  { icon: Wrench, label: "Sửa tận nơi" },
  { icon: Clock, label: "Nhanh trong ngày" },
  { icon: ShieldCheck, label: "Bảo mật dữ liệu" },
  { icon: MapPin, label: "Bán kính 3–5km" },
] as const;

const processSteps = [
  {
    icon: MessageSquare,
    title: "Gửi yêu cầu",
    description: "Khách điền form online hoặc bấm Zalo / hotline.",
  },
  {
    icon: FileText,
    title: "Mô tả lỗi máy",
    description: "Cung cấp tình trạng máy, kèm ảnh nếu có.",
  },
  {
    icon: CalendarCheck,
    title: "Đặt lịch hẹn",
    description: "Chọn thời gian và địa chỉ thuận tiện cho bạn.",
  },
  {
    icon: Search,
    title: "Kỹ thuật viên kiểm tra",
    description: "KTV đến tận nơi chẩn đoán nguyên nhân.",
  },
  {
    icon: Receipt,
    title: "Báo giá minh bạch",
    description: "Khách xem chi phí dự kiến trước khi sửa.",
  },
  {
    icon: Hammer,
    title: "Sửa khi đồng ý",
    description: "Hoàn tất sửa chữa, nghiệm thu cùng khách.",
  },
] as const;

export default function HomePage() {
  return (
    <>
      {/* Hero */}
      <section className="bg-gradient-to-b from-primary/10 to-background">
        <div className="container mx-auto px-4 py-16 md:px-6 md:py-24 lg:py-32">
          <div className="grid items-center gap-12 md:grid-cols-5 md:gap-10">
            <div className="text-center md:col-span-3 md:text-left">
              <Badge variant="secondary" className="mb-4">
                Sửa chữa tận nơi · Bán kính 3–5km
              </Badge>
              <h1 className="text-3xl font-bold tracking-tight md:text-5xl">
                Sửa chữa laptop &amp; PC tận nơi
              </h1>
              <p className="mt-4 max-w-2xl text-lg text-muted-foreground md:mx-0">
                FixNow đến tận nhà sửa máy nhanh chóng, minh bạch giá, an toàn
                dữ liệu. Bán kính phục vụ 3–5km nội thành.
              </p>
              <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center md:justify-start">
                <Button asChild size="lg">
                  <Link href="/booking">Đặt lịch ngay</Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <Link href="/pricing">Xem bảng giá</Link>
                </Button>
              </div>
            </div>

            <div className="hidden md:col-span-2 md:block">
              <div className="relative">
                <div
                  aria-hidden="true"
                  className="absolute -inset-6 -z-10 rounded-3xl bg-gradient-to-br from-primary/20 via-primary/5 to-accent/10 blur-2xl"
                />
                <div className="grid grid-cols-2 gap-4 rounded-2xl border bg-card p-6 shadow-sm">
                  {heroHighlights.map(({ icon: Icon, label }) => (
                    <div
                      key={label}
                      className="flex flex-col items-center gap-2 rounded-xl bg-muted/40 p-4 text-center"
                    >
                      <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                        <Icon className="size-6" aria-hidden="true" />
                      </span>
                      <span className="text-sm font-medium">{label}</span>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Tại sao chọn FixNow */}
      <section className="bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Tại sao chọn FixNow
            </h2>
            <p className="mt-3 text-muted-foreground">
              Bốn giá trị cốt lõi giúp bạn yên tâm giao máy cho FixNow ngay từ
              lần đầu.
            </p>
          </div>

          <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-4">
            {coreValues.map(({ icon: Icon, title, description }) => (
              <Card key={title} className="h-full">
                <CardHeader>
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <CardTitle className="mt-3 text-lg">{title}</CardTitle>
                  <CardDescription className="text-sm">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Quy trình 6 bước */}
      <section>
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16 lg:py-20">
          <div className="mx-auto max-w-2xl text-center">
            <h2 className="text-2xl font-bold md:text-3xl">
              Quy trình 6 bước đơn giản
            </h2>
            <p className="mt-3 text-muted-foreground">
              Từ lúc gửi yêu cầu đến khi máy được sửa, mọi bước đều rõ ràng.
            </p>
          </div>

          <ol className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {processSteps.map((step, index) => {
              const Icon = step.icon;
              const stepNumber = String(index + 1).padStart(2, "0");
              return (
                <li key={step.title} className="h-full">
                  <Card className="h-full transition-shadow hover:shadow-md">
                    <CardHeader>
                      <div className="flex items-start gap-3">
                        <span
                          aria-hidden="true"
                          className="flex size-10 shrink-0 items-center justify-center rounded-full bg-primary font-bold text-primary-foreground"
                        >
                          {stepNumber}
                        </span>
                        <div className="space-y-1.5">
                          <div className="flex items-center gap-2 text-primary">
                            <Icon className="size-5" aria-hidden="true" />
                            <span className="sr-only">
                              Bước {index + 1}:
                            </span>
                          </div>
                          <CardTitle className="text-lg">
                            {step.title}
                          </CardTitle>
                          <CardDescription className="text-sm">
                            {step.description}
                          </CardDescription>
                        </div>
                      </div>
                    </CardHeader>
                  </Card>
                </li>
              );
            })}
          </ol>
        </div>
      </section>

      {/* Closing CTA */}
      <section className="bg-primary text-primary-foreground">
        <div className="container mx-auto px-4 py-12 text-center md:px-6 md:py-16">
          <h2 className="text-2xl font-bold md:text-3xl">
            Sẵn sàng sửa máy ngay hôm nay?
          </h2>
          <p className="mx-auto mt-3 max-w-xl text-primary-foreground/90">
            Đặt lịch chỉ mất 2 phút. FixNow phản hồi trong giờ làm việc.
          </p>
          <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
            <Button asChild size="lg" variant="secondary">
              <Link href="/booking">Đặt lịch ngay</Link>
            </Button>
            <Button
              asChild
              size="lg"
              variant="outline"
              className="border-primary-foreground/40 bg-transparent text-primary-foreground hover:bg-primary-foreground/10 hover:text-primary-foreground"
            >
              <Link href="/contact">Liên hệ tư vấn</Link>
            </Button>
          </div>
        </div>
      </section>
    </>
  );
}
