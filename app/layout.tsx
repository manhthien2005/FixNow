import type { Metadata } from "next";
import { Inter } from "next/font/google";
import "./globals.css";
import { Toaster } from "@/components/ui/sonner";

const inter = Inter({
  subsets: ["latin", "vietnamese"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: {
    default: "FixNow — Sửa chữa laptop & PC tận nơi",
    template: "%s · FixNow",
  },
  description:
    "FixNow cung cấp dịch vụ sửa chữa, bảo trì laptop và PC tận nơi. Minh bạch giá, kỹ thuật viên đến tận nhà trong bán kính 3–5km.",
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="vi" className={inter.variable}>
      <body className="font-sans antialiased">
        {children}
        <Toaster />
      </body>
    </html>
  );
}
