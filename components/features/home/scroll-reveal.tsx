"use client";

import { useEffect } from "react";

/**
 * Progressive enhancement for scroll reveals: adds `.is-visible` to every
 * `.fade-in-up` element as it enters the viewport. Render once per page.
 * Users with prefers-reduced-motion never hide the content (CSS guard), so
 * this is purely additive.
 */
export function ScrollReveal() {
  useEffect(() => {
    const elements = Array.from(
      document.querySelectorAll<HTMLElement>(".fade-in-up:not(.is-visible)"),
    );
    if (elements.length === 0) return;

    if (!("IntersectionObserver" in window)) {
      elements.forEach((el) => el.classList.add("is-visible"));
      return;
    }

    const observer = new IntersectionObserver(
      (entries, obs) => {
        for (const entry of entries) {
          if (entry.isIntersecting) {
            entry.target.classList.add("is-visible");
            obs.unobserve(entry.target);
          }
        }
      },
      { threshold: 0.15, rootMargin: "0px 0px -10% 0px" },
    );

    elements.forEach((el) => observer.observe(el));
    return () => observer.disconnect();
  }, []);

  return null;
}
