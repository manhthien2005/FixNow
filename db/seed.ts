import bcrypt from "bcryptjs";
import { drizzle } from "drizzle-orm/node-postgres";
import { eq } from "drizzle-orm";
import { Pool } from "pg";
import * as schema from "./schema";
import { users, servicePrices, parts, appointments } from "./schema";

// Seed runs as a standalone Node script — build its own Pool so we can
// avoid the `server-only` marker in db/index.ts.
const pool = new Pool({ connectionString: process.env.DATABASE_URL });
const db = drizzle(pool, { schema });

async function main() {
  console.log("Seeding database...");

  await db
    .insert(users)
    .values({
      fullName: "Quản trị FixNow",
      phone: "0900000001",
      email: "admin@fixnow.local",
      passwordHash: await bcrypt.hash("admin123", 10),
      role: "ADMIN",
      emailVerifiedAt: new Date(),
    })
    .onConflictDoNothing({ target: users.phone });

  await db
    .insert(users)
    .values({
      fullName: "Nguyễn Văn An",
      phone: "0987654321",
      email: "demo@example.com",
      passwordHash: await bcrypt.hash("demo1234", 10),
      role: "CUSTOMER",
      emailVerifiedAt: new Date(),
    })
    .onConflictDoNothing({ target: users.phone });

  console.log("  users: 2 (1 admin, 1 customer demo)");

  const servicesData = [
    { serviceName: "Kiểm tra & chẩn đoán máy tận nơi", priceFrom: "Miễn phí", note: "Miễn phí trong bán kính 5km", sortOrder: 0 },
    { serviceName: "Vệ sinh laptop / PC + tra keo tản nhiệt", priceFrom: "Từ 150.000đ", note: "Bao gồm tháo lắp, vệ sinh quạt, thay keo CPU/GPU", sortOrder: 1 },
    { serviceName: "Cài đặt Windows + driver + phần mềm cơ bản", priceFrom: "Từ 200.000đ", note: "Bản quyền Windows / Office tính riêng nếu có", sortOrder: 2 },
    { serviceName: "Diệt virus / mã độc, dọn rác Windows", priceFrom: "Từ 200.000đ", note: "Giữ nguyên dữ liệu", sortOrder: 3 },
    { serviceName: "Nâng cấp RAM / SSD / HDD", priceFrom: "Theo linh kiện", note: "Báo giá trước khi sửa", sortOrder: 4 },
    { serviceName: "Thay pin laptop chính hãng", priceFrom: "Từ 500.000đ", note: "Giá tuỳ theo dòng máy", sortOrder: 5 },
    { serviceName: "Sửa lỗi phần cứng (màn hình, bàn phím, sạc)", priceFrom: "Báo giá sau kiểm tra", note: "Có thể mang về xưởng nếu lỗi phức tạp", sortOrder: 6 },
    { serviceName: "Cài đặt mạng / wifi / máy in văn phòng", priceFrom: "Từ 150.000đ", note: "Hỗ trợ văn phòng nhỏ, hộ kinh doanh", sortOrder: 7 },
    { serviceName: "Hỗ trợ từ xa qua TeamViewer / AnyDesk", priceFrom: "Từ 100.000đ", note: "Phù hợp lỗi phần mềm nhẹ", sortOrder: 8 },
  ];
  for (const s of servicesData) {
    await db.insert(servicePrices).values({ ...s, isActive: true }).onConflictDoNothing({ target: servicePrices.serviceName });
  }
  console.log("  service_prices: " + servicesData.length);

  const partsData = [
    { type: "RAM" as const, name: "RAM Laptop DDR4 8GB 3200MHz", price: "650.000đ", warranty: "36 tháng", note: "Crucial / Kingston" },
    { type: "RAM" as const, name: "RAM Laptop DDR4 16GB 3200MHz", price: "1.250.000đ", warranty: "36 tháng", note: "Crucial / Kingston" },
    { type: "RAM" as const, name: "RAM PC DDR4 16GB 3200MHz", price: "1.100.000đ", warranty: "36 tháng", note: "G.Skill / Corsair" },
    { type: "RAM" as const, name: "RAM Laptop DDR5 16GB 4800MHz", price: "1.850.000đ", warranty: "36 tháng", note: "Cho máy đời mới" },
    { type: "SSD" as const, name: "SSD NVMe 256GB Samsung 980", price: "850.000đ", warranty: "36 tháng", note: "PCIe Gen 3" },
    { type: "SSD" as const, name: "SSD NVMe 512GB Samsung 980", price: "1.450.000đ", warranty: "36 tháng", note: "PCIe Gen 3" },
    { type: "SSD" as const, name: "SSD NVMe 1TB Kingston NV2", price: "2.150.000đ", warranty: "36 tháng", note: "PCIe Gen 4" },
    { type: "SSD" as const, name: "SSD SATA 480GB Kingston A400", price: "850.000đ", warranty: "36 tháng", note: "Cho máy đời cũ" },
    { type: "HDD" as const, name: "HDD Laptop 1TB Seagate 5400rpm", price: "1.350.000đ", warranty: "24 tháng", note: "Lưu trữ phụ" },
    { type: "HDD" as const, name: "HDD PC 2TB WD Blue 7200rpm", price: "1.650.000đ", warranty: "24 tháng", note: "Phù hợp lưu trữ lớn" },
    { type: "HDD" as const, name: "HDD PC 4TB Seagate Barracuda", price: "2.850.000đ", warranty: "24 tháng", note: "Cho NAS / backup" },
    { type: "HDD" as const, name: "HDD gắn ngoài 1TB Toshiba", price: "1.450.000đ", warranty: "24 tháng", note: "USB 3.0" },
    { type: "BATTERY" as const, name: "Pin Dell Inspiron 14/15 (zin)", price: "750.000đ", warranty: "6 tháng" },
    { type: "BATTERY" as const, name: "Pin HP Pavilion 14/15 (zin)", price: "800.000đ", warranty: "6 tháng" },
    { type: "BATTERY" as const, name: "Pin Lenovo ThinkPad T-series (zin)", price: "950.000đ", warranty: "6 tháng" },
    { type: "BATTERY" as const, name: "Pin Asus VivoBook (zin)", price: "700.000đ", warranty: "6 tháng" },
    { type: "ACCESSORY" as const, name: "Adapter sạc laptop Dell 65W", price: "350.000đ", warranty: "6 tháng" },
    { type: "ACCESSORY" as const, name: "Adapter sạc laptop HP 65W type-C", price: "450.000đ", warranty: "6 tháng" },
    { type: "ACCESSORY" as const, name: "Bàn phím laptop HP (thay tại nhà)", price: "450.000đ", warranty: "3 tháng" },
    { type: "ACCESSORY" as const, name: "Keo tản nhiệt Thermalright TF7 (2g)", price: "120.000đ", warranty: "Không bảo hành" },
    { type: "ACCESSORY" as const, name: "Quạt tản nhiệt laptop (cặp)", price: "350.000đ", warranty: "3 tháng" },
  ];
  for (const p of partsData) {
    await db.insert(parts).values({ ...p, isActive: true }).onConflictDoNothing({ target: parts.name });
  }
  console.log("  parts: " + partsData.length);

  const customer = await db.query.users.findFirst({
    where: eq(users.phone, "0987654321"),
    columns: { id: true, fullName: true, phone: true },
  });

  if (customer) {
    await db.insert(appointments).values({
      appointmentCode: "FN-2026-0001",
      userId: customer.id,
      customerName: customer.fullName,
      phone: customer.phone,
      address: "123 Nguyễn Trãi, P.7, Q.5, TP.HCM",
      deviceType: "LAPTOP",
      serviceGroup: "Sửa lỗi phần mềm",
      issueDescription: "Máy bị chậm bất thường, mở Chrome treo 3-5 giây, nghi nhiễm virus quảng cáo.",
      preferredTime: new Date(Date.now() + 86_400_000),
      status: "RECEIVED",
    }).onConflictDoNothing({ target: appointments.appointmentCode });

    await db.insert(appointments).values({
      appointmentCode: "FN-2026-0002",
      userId: null,
      customerName: "Trần Thị Bích",
      phone: "0912345678",
      address: "45 Lê Lợi, P.Bến Nghé, Q.1, TP.HCM",
      deviceType: "PC",
      serviceGroup: "Nâng cấp linh kiện",
      issueDescription: "Muốn nâng RAM từ 8GB lên 16GB, gắn thêm SSD 512GB cho máy chính.",
      preferredTime: new Date(Date.now() + 172_800_000),
      status: "IN_PROGRESS",
    }).onConflictDoNothing({ target: appointments.appointmentCode });

    await db.insert(appointments).values({
      appointmentCode: "FN-2026-0003",
      userId: customer.id,
      customerName: customer.fullName,
      phone: customer.phone,
      address: "78 Cách Mạng Tháng 8, P.6, Q.3, TP.HCM",
      deviceType: "PRINTER",
      serviceGroup: "Hỗ trợ thiết bị văn phòng",
      issueDescription: "Máy in Canon LBP2900 báo lỗi kẹt giấy liên tục dù không có giấy kẹt.",
      preferredTime: new Date(Date.now() - 86_400_000),
      status: "COMPLETED",
    }).onConflictDoNothing({ target: appointments.appointmentCode });
  }
  console.log("  appointments: 3 (1 RECEIVED, 1 IN_PROGRESS, 1 COMPLETED)");

  console.log("Seed completed");
}

main()
  .then(async () => {
    await pool.end();
    process.exit(0);
  })
  .catch(async (e) => {
    console.error("Seed failed:", e);
    await pool.end();
    process.exit(1);
  });
