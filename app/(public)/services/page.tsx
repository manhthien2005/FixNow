import Link from "next/link";
import type { Metadata } from "next";
import {
  Bug,
  CalendarPlus,
  Cpu,
  Monitor,
  Printer,
  Search,
  Wrench,
  type LucideIcon,
} from "lucide-react";

import { Button } from "@/components/ui/button";
import {
  Card,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { SERVICE_GROUPS } from "@/lib/labels";

export const metadata: Metadata = {
  title: "Dịch vụ",
  description:
    "6 nhóm dịch vụ sửa chữa & bảo trì laptop / PC của FixNow.",
};

type ServiceCard = {
  title: (typeof SERVICE_GROUPS)[number];
  description: string;
  icon: LucideIcon;
};

// Map keeps SERVICE_GROUPS as source of truth for titles; icons + descriptions
// are local to this page because they're presentation-only.
const SERVICES: ServiceCard[] = [
  {
    title: SERVICE_GROUPS[0],
    icon: Search,
    description:
      "Kỹ thuật viên đến tận nơi kiểm tra, chẩn đoán chính xác nguyên nhân lỗi máy.",
  },
  {
    title: SERVICE_GROUPS[1],
    icon: Bug,
    description:
      "Cài đặt Windows, driver, diệt virus, fix lỗi treo, chậm, blue screen.",
  },
  {
    title: SERVICE_GROUPS[2],
    icon: Wrench,
    description:
      "Vệ sinh máy, tra keo tản nhiệt, kiểm tra ổ cứng, sạc, pin.",
  },
  {
    title: SERVICE_GROUPS[3],
    icon: Cpu,
    description:
      "Nâng RAM, SSD, HDD. Tư vấn linh kiện phù hợp với nhu cầu và túi tiền.",
  },
  {
    title: SERVICE_GROUPS[4],
    icon: Printer,
    description:
      "Cài đặt máy in, wifi, mạng nội bộ. Phù hợp văn phòng nhỏ và hộ kinh doanh.",
  },
  {
    title: SERVICE_GROUPS[5],
    icon: Monitor,
    description:
      "Khắc phục sự cố phần mềm qua TeamViewer / AnyDesk khi không cần đến tận nơi.",
  },
];

export default function ServicesPage() {
  return (
    <>
      {/* Hero strip */}
      <section className="border-b bg-muted/30">
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          <h1 className="text-3xl font-bold tracking-tight md:text-4xl">
            Dịch vụ
          </h1>
          <p className="mt-3 max-w-2xl text-base text-muted-foreground md:text-lg">
            FixNow cung cấp 6 nhóm dịch vụ chính, phục vụ từ khách cá nhân tới
            văn phòng nhỏ.
          </p>
        </div>
      </section>

      {/* Service grid */}
      <section>
        <div className="container mx-auto px-4 py-12 md:px-6 md:py-16">
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 md:gap-6 lg:grid-cols-3">
            {SERVICES.map(({ title, description, icon: Icon }) => (
              <Card
                key={title}
                className="h-full transition-shadow hover:shadow-md"
              >
                <CardHeader>
                  <span className="flex size-12 items-center justify-center rounded-full bg-primary/10 p-3 text-primary">
                    <Icon className="size-6" aria-hidden="true" />
                  </span>
                  <CardTitle className="mt-3 text-lg">{title}</CardTitle>
                  <CardDescription className="text-sm leading-relaxed">
                    {description}
                  </CardDescription>
                </CardHeader>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Footer CTA */}
      <section className="border-t bg-muted/30">
        <div className="container mx-auto flex flex-col items-center gap-4 px-4 py-10 text-center md:flex-row md:justify-between md:px-6 md:text-left">
          <p className="text-base text-muted-foreground">
            Bạn cần FixNow xử lý cho máy của mình? Đặt lịch ngay, KTV sẽ liên hệ
            lại.
          </p>
          <Button asChild size="lg">
            <Link href="/booking">
              <CalendarPlus aria-hidden="true" />
              Đặt lịch ngay
            </Link>
          </Button>
        </div>
      </section>
    </>
  );
}
