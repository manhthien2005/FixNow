/**
 * FixNow single source of truth for contact + location info.
 * Shared by the contact page, footer, and landing map. EDIT HERE to rebrand.
 */
export const SITE = {
  name: "FixNow",
  tagline: "Sửa chữa & bảo trì laptop / PC tận nơi",
  url: (process.env.NEXT_PUBLIC_SITE_URL ??
    process.env.NEXTAUTH_URL ??
    "https://fix-now-two.vercel.app").replace(/\/$/, ""),
  address: "3 Đường 42, Khu phố 5, An Khánh, TP. Hồ Chí Minh",
  mapQuery: "3 Đường 42, Khu phố 5, An Khánh, Hồ Chí Minh, Việt Nam",
  mapUrl: "https://maps.app.goo.gl/4z71a4EyQkQnidhA8",
  serviceRadius: "Bán kính 3–5km nội thành TP.HCM",
  hours: "8h00 – 20h00 hàng ngày",
  hotline: { label: "035 578 9147", href: "tel:0355789147" },
  zalo: { label: "035 578 9147", href: "https://zalo.me/0355789147" },
  email: { label: "sgear042@gmail.com", href: "mailto:sgear042@gmail.com" },
  facebook: {
    label: "Sgear.Page",
    href: "https://www.facebook.com/Sgear.Page",
  },
} as const;

export const mapEmbedSrc = (query: string = SITE.mapQuery) =>
  `https://www.google.com/maps?q=${encodeURIComponent(query)}&z=14&output=embed`;

export const mapDirectionsHref = (query?: string) =>
  query
    ? `https://www.google.com/maps/dir/?api=1&destination=${encodeURIComponent(query)}`
    : SITE.mapUrl;
