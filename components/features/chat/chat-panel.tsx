"use client";

import { useChat } from "@ai-sdk/react";
import { Bot, RotateCcw, Send, Square, Volume2, VolumeX, X } from "lucide-react";
import { useEffect, useRef, useState } from "react";
import type { UIMessage } from "ai";

import { useI18n } from "@/components/i18n/language-provider";
import { useChatSound } from "./use-chat-sound";

const MAX_MESSAGE_CHARS = 1000;
const SUGGESTION_MARKER = "[GOI_Y]";

function rawText(message: UIMessage): string {
  return message.parts
    .map((part) => (part.type === "text" ? part.text : ""))
    .join("");
}

// The model ends every reply with "[GOI_Y] q1 | q2 | q3". Split it into
// visible text + suggestion chips, and hide a partially-streamed marker so
// "[GOI_" never flashes while streaming.
function splitReply(text: string): { visible: string; suggestions: string[] } {
  const markerIndex = text.indexOf(SUGGESTION_MARKER);
  if (markerIndex >= 0) {
    const suggestions = text
      .slice(markerIndex + SUGGESTION_MARKER.length)
      .split("|")
      .map((q) => q.trim())
      .filter(Boolean)
      .slice(0, 3);
    return { visible: text.slice(0, markerIndex).trimEnd(), suggestions };
  }

  let visible = text;
  for (let len = SUGGESTION_MARKER.length - 1; len > 0; len--) {
    if (visible.endsWith(SUGGESTION_MARKER.slice(0, len))) {
      visible = visible.slice(0, -len).trimEnd();
      break;
    }
  }
  return { visible, suggestions: [] };
}

function TypingDots() {
  return (
    <span className="flex items-center gap-1 px-1 py-1.5" aria-hidden="true">
      {[0, 1, 2].map((i) => (
        <span
          key={i}
          className="size-1.5 animate-bounce rounded-full bg-on-surface-variant"
          style={{ animationDelay: `${i * 150}ms` }}
        />
      ))}
    </span>
  );
}

export function ChatPanel({
  open,
  onClose,
}: {
  open: boolean;
  onClose: () => void;
}) {
  const { dictionary, locale } = useI18n();
  const t = dictionary.chat;

  const [input, setInput] = useState("");
  const { soundOn, toggleSound, unlockAudio, playReplySound } = useChatSound();

  // useChat keeps the first onFinish it sees; route through a ref so it
  // always reads the current mute state.
  const playSoundRef = useRef(playReplySound);
  playSoundRef.current = playReplySound;

  const { messages, sendMessage, status, error, regenerate, stop } = useChat({
    onFinish: () => playSoundRef.current(),
  });
  const scrollRef = useRef<HTMLDivElement>(null);

  const busy = status === "submitted" || status === "streaming";

  useEffect(() => {
    const el = scrollRef.current;
    if (el && open) el.scrollTop = el.scrollHeight;
  }, [messages, status, open]);

  function send(text: string) {
    const trimmed = text.trim();
    if (!trimmed || busy) return;
    // Click/submit is a user gesture — unlock audio now so the reply
    // sound (fired later from onFinish) is allowed by the browser.
    unlockAudio();
    void sendMessage({ text: trimmed }, { body: { locale } });
    setInput("");
  }

  const errorLabel = error?.message.includes("rate_limited")
    ? t.rateLimited
    : t.errorFallback;

  const lastMessage = messages[messages.length - 1];
  const followUps =
    status === "ready" && lastMessage?.role === "assistant"
      ? splitReply(rawText(lastMessage)).suggestions
      : [];

  return (
    <div
      role="dialog"
      aria-label={t.title}
      className={`fixed inset-0 z-[60] flex flex-col border-border bg-background/95 backdrop-blur-xl md:inset-auto md:bottom-6 md:right-6 md:h-[560px] md:max-h-[calc(100dvh-3rem)] md:w-[380px] md:rounded-2xl md:border md:shadow-[0_8px_40px_rgba(0,0,0,0.5)] ${
        open ? "" : "hidden"
      }`}
    >
      {/* Header */}
      <div className="flex items-center gap-2 border-b border-border px-4 py-3">
        <span className="btn-gradient flex size-10 shrink-0 items-center justify-center rounded-full text-white">
          <Bot className="size-5" aria-hidden="true" />
        </span>
        <div className="min-w-0 flex-1 pl-1">
          <p className="truncate text-body-lg font-semibold text-on-surface">
            {t.title}
          </p>
          <p className="flex items-center gap-1.5 text-label-sm text-on-surface-variant">
            <span className="size-1.5 rounded-full bg-secondary" aria-hidden="true" />
            {t.online}
          </p>
        </div>
        <button
          type="button"
          aria-label={soundOn ? t.soundOn : t.soundOff}
          aria-pressed={soundOn}
          onClick={toggleSound}
          className="flex size-11 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          {soundOn ? (
            <Volume2 className="size-5" aria-hidden="true" />
          ) : (
            <VolumeX className="size-5" aria-hidden="true" />
          )}
        </button>
        <button
          type="button"
          aria-label={t.close}
          onClick={onClose}
          className="flex size-11 items-center justify-center rounded-xl text-on-surface-variant transition-colors hover:bg-surface-container-high hover:text-on-surface"
        >
          <X className="size-5" aria-hidden="true" />
        </button>
      </div>

      {/* Messages */}
      <div ref={scrollRef} className="flex-1 space-y-3 overflow-y-auto p-4">
        <div className="max-w-[85%] rounded-2xl rounded-tl-sm border border-border bg-surface-container px-4 py-3 text-body-md text-on-surface">
          {t.greeting}
        </div>

        {messages.map((message) => {
          if (message.role === "user") {
            const text = rawText(message);
            if (!text) return null;
            return (
              <div
                key={message.id}
                className="btn-gradient ml-auto w-fit max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tr-sm px-4 py-3 text-body-md text-white"
              >
                {text}
              </div>
            );
          }
          const { visible } = splitReply(rawText(message));
          if (!visible) return null;
          return (
            <div
              key={message.id}
              className="max-w-[85%] whitespace-pre-wrap break-words rounded-2xl rounded-tl-sm border border-border bg-surface-container px-4 py-3 text-body-md text-on-surface"
            >
              {visible}
            </div>
          );
        })}

        {status === "submitted" ? (
          <div className="w-fit rounded-2xl rounded-tl-sm border border-border bg-surface-container px-3 py-2">
            <span className="sr-only">{t.thinking}</span>
            <TypingDots />
          </div>
        ) : null}

        {status === "error" ? (
          <div className="max-w-[85%] space-y-2 rounded-2xl border border-error/30 bg-error/10 px-4 py-3 text-body-md text-on-surface">
            <p>{errorLabel}</p>
            <button
              type="button"
              onClick={() => void regenerate({ body: { locale } })}
              className="inline-flex min-h-11 items-center gap-2 font-mono text-label-sm uppercase tracking-wider text-secondary hover:underline"
            >
              <RotateCcw className="size-4" aria-hidden="true" />
              {dictionary.common.retry}
            </button>
          </div>
        ) : null}

        {messages.length === 0 ? (
          <div className="flex flex-wrap gap-2 pt-1">
            {t.starters.map((starter) => (
              <button
                key={starter}
                type="button"
                onClick={() => send(starter)}
                className="min-h-11 rounded-full border border-border bg-surface-container-high/50 px-4 py-2 text-left text-body-md text-on-surface-variant transition-colors hover:border-outline hover:text-on-surface"
              >
                {starter}
              </button>
            ))}
          </div>
        ) : null}

        {followUps.length > 0 ? (
          <div
            aria-label={t.suggestionsAria}
            className="fade-in-up flex flex-wrap gap-2 pt-1"
          >
            {followUps.map((question) => (
              <button
                key={question}
                type="button"
                onClick={() => send(question)}
                className="min-h-11 rounded-full border border-secondary/30 bg-secondary/5 px-4 py-2 text-left text-body-md text-secondary transition-colors hover:border-secondary/60 hover:bg-secondary/10"
              >
                {question}
              </button>
            ))}
          </div>
        ) : null}
      </div>

      {/* Input */}
      <form
        onSubmit={(event) => {
          event.preventDefault();
          send(input);
        }}
        className="border-t border-border p-3"
      >
        <div className="flex items-end gap-2">
          <input
            value={input}
            onChange={(event) => setInput(event.target.value)}
            placeholder={t.placeholder}
            maxLength={MAX_MESSAGE_CHARS}
            className="min-h-11 flex-1 rounded-xl border border-border bg-surface-container px-4 text-base text-on-surface placeholder:text-on-surface-variant/60 focus:outline-none focus:ring-2 focus:ring-secondary/40"
          />
          {status === "streaming" ? (
            <button
              type="button"
              aria-label={t.stop}
              onClick={() => void stop()}
              className="flex size-11 shrink-0 items-center justify-center rounded-xl border border-border bg-surface-container text-on-surface transition-colors hover:bg-surface-container-high"
            >
              <Square className="size-4" aria-hidden="true" />
            </button>
          ) : (
            <button
              type="submit"
              aria-label={t.send}
              disabled={busy || input.trim().length === 0}
              className="btn-gradient flex size-11 shrink-0 items-center justify-center rounded-xl text-white transition-opacity disabled:opacity-40"
            >
              <Send className="size-4" aria-hidden="true" />
            </button>
          )}
        </div>
        <p className="mt-2 text-center text-label-sm text-on-surface-variant/60">
          {t.disclaimer}
        </p>
      </form>
    </div>
  );
}
