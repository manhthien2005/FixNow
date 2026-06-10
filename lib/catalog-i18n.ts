import type { Part, ServicePrice } from "@/db/schema";
import type { Locale } from "@/lib/i18n";

const SERVICE_TRANSLATIONS: Record<
  string,
  { serviceName: string; note?: string }
> = {
  "Kiểm tra & chẩn đoán máy tận nơi": {
    serviceName: "On-site inspection & diagnostics",
    note: "Free within a 5km radius",
  },
  "Vệ sinh laptop / PC + tra keo tản nhiệt": {
    serviceName: "Laptop / PC cleaning + thermal paste",
    note: "Includes disassembly, fan cleaning, and CPU/GPU thermal paste",
  },
  "Cài đặt Windows + driver + phần mềm cơ bản": {
    serviceName: "Windows, drivers, and basic software setup",
    note: "Windows / Office licenses are quoted separately if needed",
  },
  "Diệt virus / mã độc, dọn rác Windows": {
    serviceName: "Virus / malware removal and Windows cleanup",
    note: "Data is kept intact",
  },
  "Nâng cấp RAM / SSD / HDD": {
    serviceName: "RAM / SSD / HDD upgrades",
    note: "Quote confirmed before repair",
  },
  "Thay pin laptop chính hãng": {
    serviceName: "Genuine laptop battery replacement",
    note: "Price depends on device model",
  },
  "Sửa lỗi phần cứng (màn hình, bàn phím, sạc)": {
    serviceName: "Hardware repair (screen, keyboard, charger)",
    note: "May be brought to the workshop for complex issues",
  },
  "Cài đặt mạng / wifi / máy in văn phòng": {
    serviceName: "Office network, Wi-Fi, and printer setup",
    note: "For small offices, shops, and home businesses",
  },
  "Hỗ trợ từ xa qua TeamViewer / AnyDesk": {
    serviceName: "Remote support via TeamViewer / AnyDesk",
    note: "Best for light software issues",
  },
};

const PRICE_TRANSLATIONS: Record<string, string> = {
  "Miễn phí": "Free",
  "Từ 100.000đ": "From 100,000 VND",
  "Từ 150.000đ": "From 150,000 VND",
  "Từ 200.000đ": "From 200,000 VND",
  "Từ 500.000đ": "From 500,000 VND",
  "Theo linh kiện": "Parts-based quote",
  "Báo giá sau kiểm tra": "Quoted after inspection",
};

const PART_NAME_TRANSLATIONS: Record<string, string> = {
  "RAM Laptop DDR4 8GB 3200MHz": "Laptop DDR4 RAM 8GB 3200MHz",
  "RAM Laptop DDR4 16GB 3200MHz": "Laptop DDR4 RAM 16GB 3200MHz",
  "RAM PC DDR4 16GB 3200MHz": "Desktop DDR4 RAM 16GB 3200MHz",
  "RAM Laptop DDR5 16GB 4800MHz": "Laptop DDR5 RAM 16GB 4800MHz",
  "SSD NVMe 256GB Samsung 980": "Samsung 980 NVMe SSD 256GB",
  "SSD NVMe 512GB Samsung 980": "Samsung 980 NVMe SSD 512GB",
  "SSD NVMe 1TB Kingston NV2": "Kingston NV2 NVMe SSD 1TB",
  "SSD SATA 480GB Kingston A400": "Kingston A400 SATA SSD 480GB",
  "HDD Laptop 1TB Seagate 5400rpm": "Laptop HDD 1TB Seagate 5400rpm",
  "HDD PC 2TB WD Blue 7200rpm": "Desktop HDD 2TB WD Blue 7200rpm",
  "HDD PC 4TB Seagate Barracuda": "Desktop HDD 4TB Seagate Barracuda",
  "HDD gắn ngoài 1TB Toshiba": "Toshiba external HDD 1TB",
  "Pin Dell Inspiron 14/15 (zin)": "Dell Inspiron 14/15 battery (OEM)",
  "Pin HP Pavilion 14/15 (zin)": "HP Pavilion 14/15 battery (OEM)",
  "Pin Lenovo ThinkPad T-series (zin)": "Lenovo ThinkPad T-series battery (OEM)",
  "Pin Asus VivoBook (zin)": "Asus VivoBook battery (OEM)",
  "Adapter sạc laptop Dell 65W": "Dell 65W laptop charger",
  "Adapter sạc laptop HP 65W type-C": "HP 65W USB-C laptop charger",
  "Bàn phím laptop HP (thay tại nhà)": "HP laptop keyboard (on-site replacement)",
  "Keo tản nhiệt Thermalright TF7 (2g)": "Thermalright TF7 thermal paste (2g)",
  "Quạt tản nhiệt laptop (cặp)": "Laptop cooling fan pair",
};

const TEXT_TRANSLATIONS: Record<string, string> = {
  "36 tháng": "36 months",
  "24 tháng": "24 months",
  "6 tháng": "6 months",
  "3 tháng": "3 months",
  "Không bảo hành": "No warranty",
  "Cho máy đời mới": "For newer devices",
  "Cho máy đời cũ": "For older devices",
  "Lưu trữ phụ": "Secondary storage",
  "Phù hợp lưu trữ lớn": "Good for large storage",
  "Cho NAS / backup": "For NAS / backup",
};

function localizeMoney(value: string): string {
  return value.replace(/\./g, ",").replace(/đ/u, " VND");
}

export function localizeServicePrice<T extends ServicePrice>(
  service: T,
  locale: Locale,
): T {
  if (locale === "vi") return service;

  const translation = SERVICE_TRANSLATIONS[service.serviceName];
  return {
    ...service,
    serviceName: translation?.serviceName ?? service.serviceName,
    priceFrom: PRICE_TRANSLATIONS[service.priceFrom] ?? localizeMoney(service.priceFrom),
    note: service.note
      ? translation?.note ?? TEXT_TRANSLATIONS[service.note] ?? service.note
      : service.note,
  };
}

export function localizePart<T extends Part>(part: T, locale: Locale): T {
  if (locale === "vi") return part;

  return {
    ...part,
    name: PART_NAME_TRANSLATIONS[part.name] ?? part.name,
    price: localizeMoney(part.price),
    warranty: part.warranty
      ? TEXT_TRANSLATIONS[part.warranty] ?? part.warranty
      : part.warranty,
    note: part.note ? TEXT_TRANSLATIONS[part.note] ?? part.note : part.note,
  };
}
