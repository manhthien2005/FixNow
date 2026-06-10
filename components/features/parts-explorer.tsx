"use client";

import Image from "next/image";
import { useMemo, useState } from "react";
import {
  HardDrive,
  MemoryStick,
  PackageSearch,
  Plug,
  Search,
  ShieldCheck,
  type LucideIcon,
} from "lucide-react";

import { cn } from "@/lib/utils";
import { localizePart } from "@/lib/catalog-i18n";
import { resolvePartImage } from "@/lib/images";
import { INPUT_LIMITS, limitText } from "@/lib/input-normalizers";
import type { Part, PartType } from "@/db/schema";
import { useI18n } from "@/components/i18n/language-provider";

type FilterValue = "ALL" | PartType;
type Accent = "secondary" | "primary" | "tertiary";

// Per-type presentation: image thumbnail + icon + accent (mirrors landing style).
const TYPE_META: Record<
  PartType,
  { image: string; icon: LucideIcon; accent: Accent }
> = {
  RAM: { image: "/images/part-ram.jpg", icon: MemoryStick, accent: "secondary" },
  SSD: { image: "/images/part-ssd.jpg", icon: HardDrive, accent: "primary" },
  HDD: { image: "/images/part-hdd.jpg", icon: HardDrive, accent: "tertiary" },
  BATTERY: { image: "/images/part-battery.jpg", icon: Plug, accent: "secondary" },
  ACCESSORY: { image: "/images/part-accessory.jpg", icon: Plug, accent: "primary" },
};

const TILE: Record<Accent, string> = {
  secondary: "text-secondary shadow-[0_0_15px_rgba(93,230,255,0.18)]",
  primary: "text-primary shadow-[0_0_15px_rgba(173,198,255,0.18)]",
  tertiary: "text-tertiary shadow-[0_0_15px_rgba(208,188,255,0.18)]",
};

const PRICE_ACCENT: Record<Accent, string> = {
  secondary: "text-secondary",
  primary: "text-primary",
  tertiary: "text-tertiary",
};

interface PartsExplorerProps {
  parts: Part[];
}

export function PartsExplorer({ parts }: PartsExplorerProps) {
  const { dictionary, locale } = useI18n();
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<FilterValue>("ALL");
  const localizedParts = useMemo(
    () => parts.map((part) => localizePart(part, locale)),
    [locale, parts],
  );

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return localizedParts.filter((part) => {
      if (selectedType !== "ALL" && part.type !== selectedType) return false;
      if (q && !part.name.toLowerCase().includes(q)) return false;
      return true;
    });
  }, [localizedParts, query, selectedType]);

  const countByType = useMemo(() => {
    const map = new Map<FilterValue, number>([["ALL", localizedParts.length]]);
    for (const part of localizedParts) {
      map.set(part.type, (map.get(part.type) ?? 0) + 1);
    }
    return map;
  }, [localizedParts]);

  const filters: { value: FilterValue; label: string }[] = [
    { value: "ALL", label: dictionary.lists.all },
    { value: "RAM", label: dictionary.labels.partType.RAM },
    { value: "SSD", label: dictionary.labels.partType.SSD },
    { value: "HDD", label: dictionary.labels.partType.HDD },
    { value: "BATTERY", label: dictionary.labels.partType.BATTERY },
    { value: "ACCESSORY", label: dictionary.labels.partType.ACCESSORY },
  ];

  return (
    <div className="space-y-8">
      {/* Toolbar */}
      <div className="fade-in-up space-y-5">
        <div className="relative md:max-w-md">
          <label htmlFor="parts-search" className="sr-only">
            {dictionary.lists.searchParts}
          </label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-4 top-1/2 size-5 -translate-y-1/2 text-on-surface-variant"
          />
          <input
            id="parts-search"
            type="search"
            value={query}
            onChange={(event) =>
              setQuery(limitText(event.target.value, INPUT_LIMITS.search))
            }
            placeholder={dictionary.lists.searchPartsPlaceholder}
            inputMode="search"
            maxLength={INPUT_LIMITS.search}
            className="h-12 w-full rounded-xl border border-border bg-surface-container/50 pl-12 pr-4 text-base text-on-surface placeholder:text-on-surface-variant/60 focus:border-secondary focus:outline-none focus:ring-1 focus:ring-secondary"
          />
        </div>

        {/* Pill filters (horizontal scroll on mobile) */}
        <div
          role="tablist"
          aria-label={dictionary.lists.partFilterAria}
          className="flex flex-wrap gap-2"
        >
          {filters.map((filter) => {
            const isActive = selectedType === filter.value;
            const count = countByType.get(filter.value) ?? 0;
            return (
              <button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                onClick={() => setSelectedType(filter.value)}
                className={cn(
                  "inline-flex min-h-11 items-center gap-2 rounded-full border px-4 py-2 font-mono text-label-sm uppercase tracking-wider transition-colors",
                  isActive
                    ? "border-transparent bg-secondary text-on-secondary"
                    : "border-border bg-surface-container/40 text-on-surface-variant hover:border-secondary/40 hover:text-on-surface",
                )}
              >
                {filter.label}
                <span
                  className={cn(
                    "rounded-full px-1.5 text-[11px]",
                    isActive ? "bg-on-secondary/15" : "bg-surface-container-high",
                  )}
                >
                  {count}
                </span>
              </button>
            );
          })}
        </div>

        <p className="font-mono text-label-sm uppercase tracking-wider text-on-surface-variant/70">
          {filtered.length > 0
            ? `${String(filtered.length).padStart(2, "0")} ${
                dictionary.lists.parts
              }`
            : dictionary.common.noResults}
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <div className="glass-panel flex flex-col items-center justify-center gap-3 rounded-2xl p-12 text-center">
          <PackageSearch className="size-10 text-on-surface-variant" aria-hidden="true" />
          <p className="text-body-md text-on-surface-variant">
            {dictionary.lists.noParts}
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((part, i) => {
            const meta = TYPE_META[part.type];
            const Icon = meta.icon;
            return (
              <article
                key={part.id}
                className={`glass-panel fade-in-up stagger-${i % 4} group flex flex-col overflow-hidden rounded-2xl transition-colors hover:border-outline`}
              >
                {/* Image header */}
                <div className="relative h-36 overflow-hidden">
                  <Image
                    src={resolvePartImage(part.imagePath, part.type)}
                    alt={dictionary.labels.partType[part.type]}
                    fill
                    sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 90vw"
                    className="object-cover transition-transform duration-700 group-hover:scale-105"
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-surface-container via-surface-container/40 to-transparent" />
                  <span className="absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full border border-border bg-surface-container-lowest/80 px-3 py-1 font-mono text-label-sm uppercase tracking-wider text-on-surface backdrop-blur">
                    {dictionary.labels.partType[part.type]}
                  </span>
                  <span className={`absolute -bottom-5 right-4 flex size-11 items-center justify-center rounded-xl border border-border bg-surface-container-lowest/80 backdrop-blur ${TILE[meta.accent]}`}>
                    <Icon className="size-5" aria-hidden="true" />
                  </span>
                </div>

                {/* Body */}
                <div className="flex flex-1 flex-col gap-3 p-6 pt-7">
                  <h3 className="text-body-lg font-semibold leading-snug text-on-surface">
                    {part.name}
                  </h3>
                  {part.warranty ? (
                    <p className="inline-flex items-center gap-1.5 text-body-md text-on-surface-variant">
                      <ShieldCheck className="size-4 shrink-0 text-secondary" aria-hidden="true" />
                      {dictionary.lists.warranty}: {part.warranty}
                    </p>
                  ) : null}
                  {part.note ? (
                    <p className="text-body-md italic text-on-surface-variant/80">
                      {part.note}
                    </p>
                  ) : null}
                  <p className={`mt-auto border-t border-border pt-4 text-headline-sm font-bold ${PRICE_ACCENT[meta.accent]}`}>
                    {part.price}
                  </p>
                </div>
              </article>
            );
          })}
        </div>
      )}
    </div>
  );
}
