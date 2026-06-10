"use client";

import { useCallback, useEffect, useRef, useState } from "react";

const STORAGE_KEY = "fixnow-chat-sound";

/**
 * Chat-notification "bubble" sound (rising pitch blip, like messenger pops),
 * synthesized with Web Audio — no audio asset needed.
 *
 * Browsers only allow audio after a user gesture, so `unlockAudio` must be
 * called from a click/submit handler (we call it when the user sends a
 * message); `playReplySound` can then fire later from onFinish.
 * Mute preference persists in localStorage.
 */
export function useChatSound() {
  const [soundOn, setSoundOn] = useState(true);
  const ctxRef = useRef<AudioContext | null>(null);

  useEffect(() => {
    setSoundOn(window.localStorage.getItem(STORAGE_KEY) !== "off");
  }, []);

  // Must run inside a user-gesture handler: creates the AudioContext and
  // resumes it so later (non-gesture) playback is allowed.
  const unlockAudio = useCallback(() => {
    try {
      ctxRef.current ??= new AudioContext();
      if (ctxRef.current.state === "suspended") void ctxRef.current.resume();
    } catch {
      // Audio unsupported — stay silent.
    }
  }, []);

  const playBubble = useCallback(() => {
    try {
      const ctx = ctxRef.current;
      if (!ctx || ctx.state !== "running") return;

      const now = ctx.currentTime;

      // Main "blup": sine gliding up with a fast decay.
      const osc = ctx.createOscillator();
      const gain = ctx.createGain();
      osc.type = "sine";
      osc.frequency.setValueAtTime(420, now);
      osc.frequency.exponentialRampToValueAtTime(950, now + 0.11);
      gain.gain.setValueAtTime(0.0001, now);
      gain.gain.exponentialRampToValueAtTime(0.45, now + 0.02);
      gain.gain.exponentialRampToValueAtTime(0.0001, now + 0.4);
      osc.connect(gain).connect(ctx.destination);
      osc.start(now);
      osc.stop(now + 0.42);

      // Soft overtone for the watery "bubble" feel.
      const osc2 = ctx.createOscillator();
      const gain2 = ctx.createGain();
      osc2.type = "sine";
      osc2.frequency.setValueAtTime(840, now);
      osc2.frequency.exponentialRampToValueAtTime(1900, now + 0.11);
      gain2.gain.setValueAtTime(0.0001, now);
      gain2.gain.exponentialRampToValueAtTime(0.12, now + 0.02);
      gain2.gain.exponentialRampToValueAtTime(0.0001, now + 0.26);
      osc2.connect(gain2).connect(ctx.destination);
      osc2.start(now);
      osc2.stop(now + 0.28);
    } catch {
      // Audio unavailable — stay silent.
    }
  }, []);

  const playReplySound = useCallback(() => {
    if (soundOn) playBubble();
  }, [soundOn, playBubble]);

  const toggleSound = useCallback(() => {
    const next = !soundOn;
    window.localStorage.setItem(STORAGE_KEY, next ? "on" : "off");
    setSoundOn(next);
    if (next) {
      // Toggle click is a gesture: unlock + preview the sound.
      unlockAudio();
      playBubble();
    }
  }, [soundOn, unlockAudio, playBubble]);

  return { soundOn, toggleSound, unlockAudio, playReplySound };
}
