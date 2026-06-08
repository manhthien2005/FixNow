/**
 * FixNow single source of truth for contact + location info.
 * Shared by the contact page, footer, and landing map. EDIT HERE to rebrand.
 */
export const SITE = {
  name: "FixNow",
  tagline: "Sửa chữa & bảo trì laptop / PC tận nơi",
  // Location — replace with the real address + map query (no API key needed).
  address: "123 Đường Công Nghệ, Phường Bến Nghé, Quận 1, TP. Hồ Chí Minh",
  mapQuery: "Quận 1, Hồ Chí Minh",
  serviceRadius: "Bán kính 3–5km nội thành TP.HCM",
  hours: "8h00 – 20h00 hàng ngày",
  hotline: { label: "1900 8888", href: "tel:19008888" },
  zalo: { label: "zalo.me/fixnow", href: "https://zalo.me/fixnow" },
  email: { label: "support@fixnow.vn", href: "mailto:support@fixnow.vn" },
} as const;

export const mapEmbedSrc = (query: string = SITE.mapQuery) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;

export const mapDirectionsHref = (query: string = SITE.mapQuery) =>
  `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`;
