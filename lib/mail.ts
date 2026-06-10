import "server-only";
import nodemailer from "nodemailer";
import { SITE } from "@/lib/site";
import { renderOtpEmailHtml, renderOtpEmailText } from "@/lib/email-template";

export class MailConfigError extends Error {
  constructor() {
    super("SMTP chưa được cấu hình.");
    this.name = "MailConfigError";
  }
}

// Accept both the canonical SMTP_* names and the friendlier
// SMTP_SERVER / SENDER_EMAIL / SENDER_PASSWORD names (Gmail-style).
const SMTP_HOST = process.env.SMTP_HOST ?? process.env.SMTP_SERVER;
const SMTP_PORT = process.env.SMTP_PORT;
const SMTP_USER = process.env.SMTP_USER ?? process.env.SENDER_EMAIL;
const SMTP_PASS = process.env.SMTP_PASS ?? process.env.SENDER_PASSWORD;
// From: explicit SMTP_FROM, else "FixNow <sender@…>".
const SMTP_FROM =
  process.env.SMTP_FROM ??
  (SMTP_USER ? `${SITE.name} <${SMTP_USER}>` : undefined);

// Configured once a host, a sender address, and a From line are all present.
export const isSmtpConfigured = Boolean(SMTP_HOST && SMTP_USER && SMTP_FROM);

function smtpPort(): number {
  const parsed = Number(SMTP_PORT);
  return Number.isFinite(parsed) && parsed > 0 ? parsed : 587;
}

function transporter() {
  if (!isSmtpConfigured || !SMTP_HOST || !SMTP_FROM) {
    throw new MailConfigError();
  }

  const auth =
    SMTP_USER && SMTP_PASS ? { user: SMTP_USER, pass: SMTP_PASS } : undefined;

  return nodemailer.createTransport({
    host: SMTP_HOST,
    port: smtpPort(),
    secure: smtpPort() === 465, // 465 = implicit TLS; 587 = STARTTLS
    auth,
  });
}

export async function sendEmailVerificationOtp({
  email,
  otp,
}: {
  email: string;
  otp: string;
}) {
  const mailer = transporter();
  const from = SMTP_FROM;
  if (!from) throw new MailConfigError();

  await mailer.sendMail({
    from,
    to: email,
    subject: `Mã xác thực tài khoản ${SITE.name}`,
    text: renderOtpEmailText(otp),
    html: renderOtpEmailHtml(otp),
    // Logo is loaded from the public Vercel URL — no attachment, so the
    // email no longer shows an ugly attached file.
  });
}
