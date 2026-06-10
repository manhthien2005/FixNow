/**
 * Render the OTP email to a static HTML file you can open in a browser:
 *   npx tsx scripts/preview-email.ts
 * Output: tmp/email-preview.html
 */
import { mkdirSync, writeFileSync } from "fs";
import { renderOtpEmailHtml } from "../lib/email-template";

const html = renderOtpEmailHtml("123456");
mkdirSync("tmp", { recursive: true });
writeFileSync("tmp/email-preview.html", html, "utf8");
console.log("✓ Wrote tmp/email-preview.html — open it in your browser to preview.");
