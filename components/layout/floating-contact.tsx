import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";
import { getLocale } from "@/lib/i18n-server";

export async function FloatingContact() {
  const locale = await getLocale();
  const isVi = locale === "vi";

  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 md:hidden">
      <a
        href={SITE.hotline.href}
        aria-label={isVi ? "Gọi hotline FixNow" : "Call FixNow hotline"}
        className="btn-gradient flex size-12 items-center justify-center rounded-full text-white shadow-[0_0_20px_rgba(0,203,230,0.5)] transition-transform hover:scale-105 active:scale-95"
      >
        <Phone className="size-5" />
      </a>
      <a
        href={SITE.zalo.href}
        target="_blank"
        rel="noreferrer"
        aria-label={isVi ? "Chat Zalo với FixNow" : "Chat with FixNow on Zalo"}
        className="glass-panel-heavy flex size-12 items-center justify-center rounded-full border border-secondary/40 text-secondary shadow-[0_0_18px_rgba(93,230,255,0.3)] transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="size-5" />
      </a>
    </div>
  );
}
