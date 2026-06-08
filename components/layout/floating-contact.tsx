import { MessageCircle, Phone } from "lucide-react";
import { SITE } from "@/lib/site";

export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 md:hidden">
      <a
        href={SITE.hotline.href}
        aria-label="Gọi hotline FixNow"
        className="btn-gradient flex size-12 items-center justify-center rounded-full text-white shadow-[0_0_20px_rgba(0,203,230,0.5)] transition-transform hover:scale-105 active:scale-95"
      >
        <Phone className="size-5" />
      </a>
      <a
        href={SITE.zalo.href}
        target="_blank"
        rel="noreferrer"
        aria-label="Chat Zalo với FixNow"
        className="glass-panel-heavy flex size-12 items-center justify-center rounded-full border border-secondary/40 text-secondary shadow-[0_0_18px_rgba(93,230,255,0.3)] transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="size-5" />
      </a>
    </div>
  );
}
