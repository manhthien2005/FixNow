import { MessageCircle, Phone } from "lucide-react";

export function FloatingContact() {
  return (
    <div className="fixed bottom-4 right-4 z-50 flex flex-col gap-3 md:hidden">
      <a
        href="tel:+841900xxxx"
        aria-label="Gọi hotline FixNow"
        className="flex size-12 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <Phone className="size-5" />
      </a>
      <a
        href="https://zalo.me/fixnow"
        target="_blank"
        rel="noreferrer"
        aria-label="Chat Zalo với FixNow"
        className="flex size-12 items-center justify-center rounded-full bg-accent text-accent-foreground shadow-lg transition-transform hover:scale-105 active:scale-95"
      >
        <MessageCircle className="size-5" />
      </a>
    </div>
  );
}
