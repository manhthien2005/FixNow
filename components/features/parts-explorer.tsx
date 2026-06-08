"use client";

import { useMemo, useState } from "react";
import { PackageSearch, Search, ShieldCheck } from "lucide-react";

import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { PART_TYPE_LABEL } from "@/lib/labels";
import type { Part, PartType } from "@/db/schema";

type FilterValue = "ALL" | PartType;

const FILTERS: { value: FilterValue; label: string }[] = [
  { value: "ALL", label: "Tất cả" },
  { value: "RAM", label: PART_TYPE_LABEL.RAM },
  { value: "SSD", label: PART_TYPE_LABEL.SSD },
  { value: "HDD", label: PART_TYPE_LABEL.HDD },
  { value: "BATTERY", label: PART_TYPE_LABEL.BATTERY },
  { value: "ACCESSORY", label: PART_TYPE_LABEL.ACCESSORY },
];

interface PartsExplorerProps {
  parts: Part[];
}

export function PartsExplorer({ parts }: PartsExplorerProps) {
  const [query, setQuery] = useState("");
  const [selectedType, setSelectedType] = useState<FilterValue>("ALL");

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return parts.filter((part) => {
      if (selectedType !== "ALL" && part.type !== selectedType) {
        return false;
      }
      if (q && !part.name.toLowerCase().includes(q)) {
        return false;
      }
      return true;
    });
  }, [parts, query, selectedType]);

  return (
    <div className="space-y-6">
      {/* Toolbar */}
      <div className="space-y-4">
        <div className="relative md:max-w-sm">
          <Label htmlFor="parts-search" className="sr-only">
            Tìm linh kiện
          </Label>
          <Search
            aria-hidden="true"
            className="pointer-events-none absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground"
          />
          <Input
            id="parts-search"
            type="search"
            value={query}
            onChange={(event) => setQuery(event.target.value)}
            placeholder="Tìm theo tên (vd: RAM 8GB)"
            className="h-11 pl-9"
            inputMode="search"
          />
        </div>

        {/* Mobile: native Select. Desktop: pill buttons. */}
        <div className="md:hidden">
          <Label htmlFor="parts-type-select" className="sr-only">
            Loại linh kiện
          </Label>
          <Select
            value={selectedType}
            onValueChange={(value) => setSelectedType(value as FilterValue)}
          >
            <SelectTrigger id="parts-type-select" className="h-11">
              <SelectValue placeholder="Loại linh kiện" />
            </SelectTrigger>
            <SelectContent>
              {FILTERS.map((filter) => (
                <SelectItem key={filter.value} value={filter.value}>
                  {filter.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>

        <div
          role="tablist"
          aria-label="Lọc theo loại linh kiện"
          className="hidden flex-wrap gap-2 md:flex"
        >
          {FILTERS.map((filter) => {
            const isActive = selectedType === filter.value;
            return (
              <Button
                key={filter.value}
                type="button"
                role="tab"
                aria-selected={isActive}
                variant={isActive ? "default" : "outline"}
                size="sm"
                onClick={() => setSelectedType(filter.value)}
              >
                {filter.label}
              </Button>
            );
          })}
        </div>

        <p className="text-sm text-muted-foreground">
          {filtered.length > 0
            ? `${filtered.length} linh kiện`
            : "Không có linh kiện phù hợp"}
        </p>
      </div>

      {/* Results */}
      {filtered.length === 0 ? (
        <Card>
          <CardContent className="flex flex-col items-center justify-center gap-3 p-10 text-center">
            <PackageSearch
              aria-hidden="true"
              className="size-10 text-muted-foreground"
            />
            <p className="text-sm text-muted-foreground">
              Không có linh kiện phù hợp với bộ lọc hiện tại.
            </p>
          </CardContent>
        </Card>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((part) => (
            <Card
              key={part.id}
              className="h-full transition-shadow hover:shadow-md"
            >
              <CardContent className="flex h-full flex-col gap-3 p-4 md:p-6">
                <Badge variant="secondary" className="w-fit">
                  {PART_TYPE_LABEL[part.type]}
                </Badge>
                <h3 className="font-semibold leading-snug">{part.name}</h3>
                <p className="text-lg font-bold text-primary">{part.price}</p>
                {part.warranty ? (
                  <p className="flex items-center gap-1.5 text-sm text-muted-foreground">
                    <ShieldCheck
                      aria-hidden="true"
                      className="size-3.5 shrink-0"
                    />
                    Bảo hành: {part.warranty}
                  </p>
                ) : null}
                {part.note ? (
                  <p className="text-xs italic text-muted-foreground">
                    {part.note}
                  </p>
                ) : null}
              </CardContent>
            </Card>
          ))}
        </div>
      )}
    </div>
  );
}
