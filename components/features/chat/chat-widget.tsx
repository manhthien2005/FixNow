"use client";

import dynamic from "next/dynamic";
import { useState } from "react";
import { MessageCircleMore } from "lucide-react";

import { useI18n } from "@/components/i18n/language-provider";

// Heavy chat panel (AI SDK) loads only on first open — keeps the main
// bundle free of @ai-sdk/react. Stays mounted afterwards so the
// conversation survives close/reopen.
const ChatPanel = dynamic(
  () => import("./chat-panel").then((m) => m.ChatPanel),
  { ssr: false },
);

export function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [loaded, setLoaded] = useState(false);
  const { dictionary } = useI18n();

  return (
    <>
      {loaded ? <ChatPanel open={open} onClose={() => setOpen(false)} /> : null}
      <button
        type="button"
        aria-label={dictionary.chat.open}
        onClick={() => {
          setLoaded(true);
          setOpen(true);
        }}
        className={`btn-gradient fixed bottom-[8.5rem] right-4 z-50 flex size-12 items-center justify-center rounded-full text-white shadow-[0_0_20px_rgba(0,203,230,0.5)] transition-transform hover:scale-105 active:scale-95 md:bottom-6 md:right-6 md:size-14 ${
          open ? "hidden" : ""
        }`}
      >
        <MessageCircleMore className="size-5 md:size-6" aria-hidden="true" />
      </button>
    </>
  );
}
