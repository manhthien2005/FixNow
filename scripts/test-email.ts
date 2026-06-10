/**
 * SMTP diagnostics — run with real env:
 *   npx tsx --env-file=.env.local scripts/test-email.ts [recipient@example.com]
 *
 * 1) Prints the resolved SMTP config (password masked).
 * 2) Calls transporter.verify() — confirms host + auth WITHOUT sending.
 * 3) If a recipient is passed, sends one plain test email.
 */
import nodemailer from "nodemailer";

const host = process.env.SMTP_HOST ?? process.env.SMTP_SERVER;
const port = Number(process.env.SMTP_PORT ?? "587");
const user = process.env.SMTP_USER ?? process.env.SENDER_EMAIL;
const pass = process.env.SMTP_PASS ?? process.env.SENDER_PASSWORD;
const from =
  process.env.SMTP_FROM ?? (user ? `FixNow <${user}>` : undefined);

function mask(s?: string) {
  if (!s) return "(empty)";
  return `${s.slice(0, 2)}…(${s.length} chars${/\s/.test(s) ? ", HAS SPACES" : ""})`;
}

async function main() {
  console.log("── SMTP config ───────────────");
  console.log("host :", host ?? "(empty)");
  console.log("port :", port, port === 465 ? "(implicit TLS)" : "(STARTTLS)");
  console.log("user :", user ?? "(empty)");
  console.log("pass :", mask(pass), pass?.length === 16 ? "✓ 16 chars" : "⚠ Gmail app password should be 16 chars");
  console.log("from :", from ?? "(empty)");
  console.log("──────────────────────────────");

  if (!host || !user || !pass) {
    console.error("✗ Missing host/user/pass — check .env.local");
    process.exit(1);
  }

  const transporter = nodemailer.createTransport({
    host,
    port,
    secure: port === 465,
    auth: { user, pass },
  });

  try {
    await transporter.verify();
    console.log("✓ verify() OK — host reachable and credentials accepted.");
  } catch (err) {
    console.error("✗ verify() FAILED:");
    console.error(err);
    console.error(
      "\nGmail 535 BadCredentials checklist:\n" +
        "  1. SENDER_EMAIL must be the EXACT account the App Password was created for.\n" +
        "  2. 2-Step Verification must be ON (App Passwords need it).\n" +
        "  3. App Password = 16 chars, no spaces (myaccount.google.com/apppasswords).\n" +
        "  4. @siu.edu.vn (Workspace) may block SMTP/App Passwords — ask the admin,\n" +
        "     or test with a personal @gmail.com account first.",
    );
    process.exit(1);
  }

  const to = process.argv[2];
  if (!to) {
    console.log("\nNo recipient arg — skipping send. Pass an email to send a test:");
    console.log("  npx tsx --env-file=.env.local scripts/test-email.ts you@example.com");
    return;
  }

  const info = await transporter.sendMail({
    from,
    to,
    subject: "FixNow — SMTP test",
    text: "Nếu bạn nhận được email này, cấu hình SMTP của FixNow đã hoạt động.",
  });
  console.log("✓ Sent:", info.messageId, "→", to);
}

main().catch((err) => {
  console.error(err);
  process.exit(1);
});
