import "server-only";

import { asc, eq } from "drizzle-orm";
import { unstable_cache } from "next/cache";

import { db } from "@/db";
import { parts, servicePrices, type Part } from "@/db/schema";
import { SITE } from "@/lib/site";

// Same cache keys + tags as app/(public)/pricing/page.tsx and
// app/(public)/parts/page.tsx — admin mutations already call
// revalidateTag("service-prices" | "parts"), so the chatbot context
// refreshes together with the public pages.
const getActiveServicePrices = unstable_cache(
  () =>
    db.query.servicePrices.findMany({
      where: eq(servicePrices.isActive, true),
      orderBy: [asc(servicePrices.sortOrder)],
    }),
  ["active-service-prices"],
  { revalidate: 3600, tags: ["service-prices"] },
);

const getActiveParts = unstable_cache(
  () =>
    db.query.parts.findMany({
      where: eq(parts.isActive, true),
      orderBy: [asc(parts.type), asc(parts.name)],
    }),
  ["active-parts"],
  { revalidate: 3600, tags: ["parts"] },
);

const PART_TYPE_HEADINGS: Record<Part["type"], string> = {
  RAM: "RAM",
  SSD: "SSD",
  HDD: "HDD",
  BATTERY: "Pin",
  ACCESSORY: "Phụ kiện",
};

/**
 * Compact plain-text snapshot of everything the chatbot is allowed to know:
 * active service prices, active parts, contact info, and the booking flow.
 * Stays well under 2K tokens for the current catalog size.
 */
export async function buildChatContext(): Promise<string> {
  const [services, partRows] = await Promise.all([
    getActiveServicePrices(),
    getActiveParts(),
  ]);

  const serviceLines = services.map((s) => {
    const note = s.note ? ` | ${s.note}` : "";
    return `- ${s.serviceName} | Giá: ${s.priceFrom}${note}`;
  });

  const partSections = (
    Object.keys(PART_TYPE_HEADINGS) as Part["type"][]
  ).flatMap((type) => {
    const rows = partRows.filter((p) => p.type === type);
    if (rows.length === 0) return [];
    const lines = rows.map((p) => {
      const warranty = p.warranty ? ` | BH: ${p.warranty}` : "";
      const note = p.note ? ` | ${p.note}` : "";
      return `- ${p.name} | ${p.price}${warranty}${note}`;
    });
    return [`[${PART_TYPE_HEADINGS[type]}]`, ...lines];
  });

  return [
    "## DỊCH VỤ (giá tham khảo)",
    ...serviceLines,
    "",
    "## LINH KIỆN (giá tham khảo)",
    ...partSections,
    "",
    "## THÔNG TIN FIXNOW",
    `- Tên: ${SITE.name} — ${SITE.tagline}`,
    `- Địa chỉ: ${SITE.address}`,
    `- Khu vực phục vụ: ${SITE.serviceRadius}`,
    `- Giờ làm việc: ${SITE.hours}`,
    `- Hotline: ${SITE.hotline.label}`,
    `- Zalo: ${SITE.zalo.label} (${SITE.zalo.href})`,
    `- Email: ${SITE.email.label}`,
    "",
    "## QUY TRÌNH ĐẶT LỊCH",
    "- Đặt lịch tại trang /booking (không bắt buộc đăng nhập): điền họ tên, SĐT, địa chỉ, loại thiết bị, mô tả lỗi, thời gian mong muốn.",
    "- Sau khi gửi sẽ nhận mã lịch hẹn dạng FN-YYYY-XXXX.",
    "- Kỹ thuật viên đến tận nơi kiểm tra máy và báo giá chính xác TRƯỚC khi sửa — chỉ sửa khi khách đồng ý.",
    "- Tra cứu trạng thái lịch hẹn tại trang /track bằng SĐT + mã lịch hẹn.",
    "- Khách có tài khoản xem lịch sử tại trang /my-appointments, hủy được khi đơn còn ở trạng thái Đã nhận.",
    "",
    "## TRẠNG THÁI LỊCH HẸN",
    "- Đã nhận (RECEIVED): FixNow đã nhận yêu cầu, sẽ liên hệ xác nhận.",
    "- Đang xử lý (IN_PROGRESS): kỹ thuật viên đang kiểm tra / sửa máy.",
    "- Hoàn thành (COMPLETED): đã sửa xong.",
    "- Đã hủy (CANCELLED): lịch hẹn đã hủy.",
  ].join("\n");
}
