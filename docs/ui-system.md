# UI System — FixNow

Mobile-first. shadcn/ui + Tailwind. Tông cảm giác: **đáng tin cậy, chuyên nghiệp, không lạnh lùng**.

## Brand colors

| Token | Hex | Sử dụng |
|-------|-----|---------|
| `primary` | `#2563EB` (blue-600) | CTA, link, icon nổi bật |
| `primary-foreground` | `#FFFFFF` | Text trên primary |
| `accent` | `#10B981` (emerald-500) | Success, trạng thái "Hoàn thành" |
| `warning` | `#F59E0B` (amber-500) | Trạng thái "Đang xử lý" |
| `destructive` | `#EF4444` (red-500) | Hủy, lỗi |
| `muted` | `#F3F4F6` (gray-100) | Background phụ |
| `border` | `#E5E7EB` (gray-200) | Đường viền |

Set qua `globals.css` CSS variables (shadcn pattern):

```css
:root {
  --background: 0 0% 100%;
  --foreground: 222.2 84% 4.9%;
  --primary: 217 91% 60%;
  --primary-foreground: 0 0% 100%;
  --accent: 160 84% 39%;
  --warning: 38 92% 50%;
  --destructive: 0 84% 60%;
  --muted: 220 14% 96%;
  --border: 220 13% 91%;
  --radius: 0.5rem;
}
```

## Typography

- **Font chính**: Inter (Google Fonts) — Latin + Vietnamese subset.
- **Heading scale**:
  - H1: `text-3xl md:text-4xl font-bold` (trang chủ banner)
  - H2: `text-2xl md:text-3xl font-bold` (section title)
  - H3: `text-xl md:text-2xl font-semibold`
  - H4: `text-lg font-semibold`
- **Body**: `text-base leading-relaxed`
- **Small/note**: `text-sm text-muted-foreground`

```tsx
import { Inter } from 'next/font/google';

const inter = Inter({
  subsets: ['latin', 'vietnamese'],
  variable: '--font-inter',
});
```

## Spacing

- Section vertical padding: `py-12 md:py-16 lg:py-20`
- Container: `container mx-auto px-4 md:px-6`
- Card padding: `p-4 md:p-6`
- Gap giữa cards: `gap-4 md:gap-6`

## Responsive breakpoints (Tailwind default)

| Prefix | Min width | Use |
|--------|-----------|-----|
| (none) | 0 | Mobile (chuẩn) |
| `sm:` | 640px | Mobile lớn |
| `md:` | 768px | Tablet |
| `lg:` | 1024px | Desktop |
| `xl:` | 1280px | Desktop lớn |

**Target chính**: 375px (iPhone SE) → 1280px+ desktop.

## Layout patterns

### Navbar (sticky top)

```
┌────────────────────────────────────┐
│ [Logo]  Menu (md+) [Đặt lịch] [👤] │  ← sticky top-0, h-14 md:h-16
└────────────────────────────────────┘
```

- Mobile: hamburger menu → drawer.
- Desktop: inline links.
- "Đặt lịch ngay" button luôn nổi bật (primary).

### Floating contact (mobile)

Cố định ở góc dưới phải, chỉ hiện ở mobile (< md):

```
                    ┌────┐
                    │ 📞 │  ← bg-primary, hotline
                    └────┘
                    ┌────┐
                    │ 💬 │  ← bg-blue-400, Zalo
                    └────┘
```

Component: `components/layout/floating-contact.tsx`.

### Card (cho dịch vụ, lịch hẹn)

shadcn `<Card>`:
- `<CardHeader>`: icon + title
- `<CardContent>`: mô tả
- `<CardFooter>`: hành động (nếu có)
- Hover: `hover:shadow-md transition-shadow`

### Form (booking, register, login)

- 1 cột trên mobile, vẫn 1 cột trên desktop nhưng `max-w-md mx-auto`.
- Label trên top, input full width.
- Error message màu `destructive`, kích thước `text-sm`.
- Submit button: `w-full` mobile, `w-auto` desktop.

## Status badges

```tsx
const STATUS_STYLE = {
  RECEIVED:    'bg-blue-100 text-blue-700',
  IN_PROGRESS: 'bg-amber-100 text-amber-700',
  COMPLETED:   'bg-emerald-100 text-emerald-700',
  CANCELLED:   'bg-gray-100 text-gray-600',
};
```

## Icons

Dùng `lucide-react` (đã có sẵn trong shadcn).

| Context | Icon |
|---------|------|
| Dịch vụ — kiểm tra | `Stethoscope` |
| Dịch vụ — phần mềm | `MonitorCog` |
| Dịch vụ — phần cứng | `Wrench` |
| Dịch vụ — nâng cấp | `HardDrive` |
| Dịch vụ — văn phòng | `Printer` |
| Dịch vụ — từ xa | `Wifi` |
| Hotline | `Phone` |
| Zalo | dùng SVG riêng |
| Đặt lịch | `CalendarPlus` |
| Lịch hẹn | `ClipboardList` |
| Admin | `LayoutDashboard` |

## Mobile testing checklist

Trước khi báo "done" cho bất kỳ trang nào:

- [ ] DevTools 375px width — không có horizontal scroll.
- [ ] Touch target tối thiểu 44x44px (button, link).
- [ ] Form input `text-base` (16px) để tránh iOS zoom on focus.
- [ ] Floating contact không che nội dung quan trọng.
- [ ] Navbar mobile menu mở/đóng được, không trap focus.
- [ ] Hiển thị tốt khi xoay landscape.

## shadcn components cần init

Chạy lần lượt sau khi setup:

```bash
npx shadcn@latest init
npx shadcn@latest add button input label form card
npx shadcn@latest add select textarea dialog dropdown-menu
npx shadcn@latest add table badge toast sonner
npx shadcn@latest add sheet  # mobile drawer
```
