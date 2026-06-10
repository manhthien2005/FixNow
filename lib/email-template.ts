import { SITE } from "@/lib/site";

// Brand palette (inlined hex — email clients ignore CSS variables).
const BRAND = {
  bg: "#0b0e14",
  panel: "#11151d",
  panelSoft: "#161b25",
  border: "#222a38",
  text: "#e6e8ee",
  textSoft: "#9aa3b2",
  primary: "#5de6ff",
  accent: "#adc6ff",
} as const;

// One app-style rounded icon button (40x40) for the contact row.
function iconButton(href: string, glyph: string, bg: string): string {
  return `<td style="padding:0 5px;">
    <a href="${href}" target="_blank" style="display:inline-block;width:40px;height:40px;line-height:40px;text-align:center;background:${bg};border-radius:11px;color:#ffffff;font-size:18px;text-decoration:none;">${glyph}</a>
  </td>`;
}

export function renderOtpEmailHtml(otp: string): string {
  const year = new Date().getFullYear();
  const webLabel = SITE.url.replace(/^https?:\/\//, "");
  return `
  <div style="margin:0;padding:24px 12px;background:${BRAND.bg};font-family:'Segoe UI',Roboto,Arial,sans-serif;">
    <table role="presentation" width="100%" cellpadding="0" cellspacing="0" style="max-width:520px;margin:0 auto;background:${BRAND.panel};border:1px solid ${BRAND.border};border-radius:16px;overflow:hidden;">
      <!-- Header -->
      <tr>
        <td style="padding:28px 32px 20px;text-align:center;background:linear-gradient(135deg,${BRAND.panelSoft},${BRAND.panel});border-bottom:1px solid ${BRAND.border};">
          <a href="${SITE.url}" style="text-decoration:none;">
            <img src="${SITE.url}/images/fixnow_logo.png" alt="${SITE.name}" height="40" style="height:40px;width:auto;display:inline-block;border:0;outline:none;" />
          </a>
          <p style="margin:12px 0 0;color:${BRAND.textSoft};font-size:13px;letter-spacing:0.4px;">${SITE.tagline}</p>
        </td>
      </tr>
      <!-- Content -->
      <tr>
        <td style="padding:32px;">
          <h1 style="margin:0 0 8px;color:${BRAND.text};font-size:20px;font-weight:700;">Xác thực email của bạn</h1>
          <p style="margin:0 0 24px;color:${BRAND.textSoft};font-size:14px;line-height:1.6;">
            Nhập mã OTP bên dưới để hoàn tất xác thực tài khoản ${SITE.name}. Mã có hiệu lực trong <strong style="color:${BRAND.text};">10 phút</strong>.
          </p>
          <div style="margin:0 0 24px;text-align:center;">
            <div style="display:inline-block;padding:16px 28px;background:${BRAND.panelSoft};border:1px solid ${BRAND.border};border-radius:12px;">
              <span style="color:${BRAND.primary};font-size:34px;font-weight:700;letter-spacing:10px;font-family:'Courier New',monospace;">${otp}</span>
            </div>
          </div>
          <p style="margin:0;color:${BRAND.textSoft};font-size:13px;line-height:1.6;">
            Nếu bạn không yêu cầu mã này, vui lòng bỏ qua email. Tuyệt đối không chia sẻ mã OTP cho bất kỳ ai.
          </p>
        </td>
      </tr>
      <!-- Contact row: app-style icon buttons + text -->
      <tr>
        <td style="padding:22px 32px;background:${BRAND.panelSoft};border-top:1px solid ${BRAND.border};text-align:center;">
          <table role="presentation" align="center" cellpadding="0" cellspacing="0" style="margin:0 auto;">
            <tr>
              ${iconButton(SITE.hotline.href, "📞", "#22c55e")}
              ${iconButton(SITE.zalo.href, "💬", "#0068ff")}
              ${iconButton(SITE.facebook.href, "👍", "#1877f2")}
              ${iconButton(SITE.email.href, "✉️", "#ea4335")}
              ${iconButton(SITE.url, "🌐", "#0aa5c2")}
            </tr>
          </table>
          <p style="margin:16px 0 0;color:${BRAND.text};font-size:13px;">
            <a href="${SITE.hotline.href}" style="color:${BRAND.accent};text-decoration:none;">${SITE.hotline.label}</a>
            &nbsp;·&nbsp;
            <a href="${SITE.email.href}" style="color:${BRAND.accent};text-decoration:none;">${SITE.email.label}</a>
          </p>
          <p style="margin:6px 0 0;">
            <a href="${SITE.url}" style="color:${BRAND.primary};font-size:13px;text-decoration:none;">${webLabel}</a>
          </p>
          <p style="margin:6px 0 0;color:${BRAND.textSoft};font-size:12px;">📍 ${SITE.address}</p>
        </td>
      </tr>
      <!-- Footer -->
      <tr>
        <td style="padding:16px 32px;text-align:center;border-top:1px solid ${BRAND.border};">
          <p style="margin:0;color:${BRAND.textSoft};font-size:11px;">© ${year} ${SITE.name}. ${SITE.serviceRadius}.</p>
        </td>
      </tr>
    </table>
  </div>`;
}

export function renderOtpEmailText(otp: string): string {
  return [
    `Mã OTP xác thực tài khoản ${SITE.name} của bạn:`,
    "",
    otp,
    "",
    "Mã có hiệu lực trong 10 phút. Tuyệt đối không chia sẻ mã cho bất kỳ ai.",
    "Nếu bạn không yêu cầu đăng ký, vui lòng bỏ qua email này.",
    "",
    `${SITE.name} — ${SITE.tagline}`,
    `Hotline: ${SITE.hotline.label} · Zalo: ${SITE.zalo.href}`,
    `Email: ${SITE.email.label} · Web: ${SITE.url}`,
    `Địa chỉ: ${SITE.address}`,
  ].join("\n");
}
