"use client";

import { useEffect, useRef, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { MapPin, Search } from "lucide-react";
import { useNominatimSearch, SimplifiedPlace } from "@/lib/useNominatimSearch";
import { cn } from "@/lib/utils";

interface PlaceAutocompleteProps {
  label?: string;
  placeholder?: string;
  hint?: string;
  value: string;
  onChange: (val: string) => void;
  onSelect: (place: SimplifiedPlace) => void;
}

function highlight(text: string, query: string): React.ReactNode {
  if (!query) return text;
  const q = query.trim();
  if (!q) return text;
  try {
    const escaped = q.replace(/[.*+?^${}()|[\]\\]/g, "\\$&");
    const regex = new RegExp(`(${escaped})`, "ig");
    const parts = text.split(regex);
    return parts.map((part, i) =>
      regex.test(part) ? (
        <mark
          key={i}
          style={{ background: "#fde9a8", color: "#2b1f12", padding: "0 1px" }}
        >
          {part}
        </mark>
      ) : (
        part
      )
    );
  } catch {
    return text;
  }
}

export default function PlaceAutocomplete({
  label,
  placeholder = "ex: Rua das Flores, 100",
  hint,
  value,
  onChange,
  onSelect,
}: PlaceAutocompleteProps) {
  const [query, setQuery] = useState(value);
  const [open, setOpen] = useState(false);
  const [activeIdx, setActiveIdx] = useState(-1);
  const [skipSearch, setSkipSearch] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // sync external value
  useEffect(() => {
    setQuery(value);
  }, [value]);

  const { results, loading } = useNominatimSearch(skipSearch ? "" : query);

  // close on outside click
  useEffect(() => {
    const onDoc = (e: MouseEvent) => {
      if (
        containerRef.current &&
        !containerRef.current.contains(e.target as Node)
      ) {
        setOpen(false);
        setActiveIdx(-1);
      }
    };
    document.addEventListener("mousedown", onDoc);
    return () => document.removeEventListener("mousedown", onDoc);
  }, []);

  const showDropdown = open && (results.length > 0 || loading);

  const handleSelect = (place: SimplifiedPlace) => {
    setSkipSearch(true);
    setQuery(place.shortName);
    onChange(place.shortName);
    onSelect(place);
    setOpen(false);
    setActiveIdx(-1);
    // re-enable search on next user input
    setTimeout(() => setSkipSearch(false), 0);
  };

  const handleKey = (e: React.KeyboardEvent<HTMLInputElement>) => {
    if (!showDropdown) {
      if (e.key === "ArrowDown" && results.length > 0) {
        e.preventDefault();
        setOpen(true);
        setActiveIdx(0);
      }
      return;
    }
    if (e.key === "ArrowDown") {
      e.preventDefault();
      setActiveIdx((i) => Math.min(i + 1, results.length - 1));
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      setActiveIdx((i) => Math.max(i - 1, 0));
    } else if (e.key === "Enter") {
      if (activeIdx >= 0 && results[activeIdx]) {
        e.preventDefault();
        handleSelect(results[activeIdx]);
      }
    } else if (e.key === "Escape") {
      setOpen(false);
      setActiveIdx(-1);
    }
  };

  const inputId = label?.toLowerCase().replace(/\s/g, "-");

  return (
    <div ref={containerRef} className="relative flex flex-col gap-1.5">
      {label && (
        <label htmlFor={inputId} className="text-sm font-serif text-birk-ink">
          {label}
        </label>
      )}
      <div className="relative">
        <input
          ref={inputRef}
          id={inputId}
          type="text"
          value={query}
          placeholder={placeholder}
          onChange={(e) => {
            setSkipSearch(false);
            setQuery(e.target.value);
            onChange(e.target.value);
            setOpen(true);
            setActiveIdx(-1);
          }}
          onFocus={() => setOpen(true)}
          onKeyDown={handleKey}
          autoComplete="off"
          className={cn(
            "w-full pl-9 pr-9 py-3 rounded border border-birk-edge bg-white/70 text-birk-ink placeholder:text-birk-ink-faint",
            "focus:outline-none focus:ring-2 focus:ring-birk-sun/40 focus:border-birk-sun",
            "transition-all duration-200 text-sm font-serif"
          )}
        />
        <Search
          size={14}
          className="absolute left-3 top-1/2 -translate-y-1/2 text-birk-ink-faint pointer-events-none"
        />
        {loading && (
          <div className="absolute right-3 top-1/2 -translate-y-1/2">
            <div className="w-3.5 h-3.5 border-2 border-birk-edge border-t-birk-terra rounded-full animate-spin" />
          </div>
        )}
      </div>

      <AnimatePresence>
        {showDropdown && (
          <motion.ul
            initial={{ opacity: 0, y: -4 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -4 }}
            transition={{ duration: 0.15 }}
            className="absolute z-50 left-0 right-0 mt-1 max-h-72 overflow-y-auto bg-white border border-birk-edge rounded shadow-card"
            style={{ top: "100%" }}
          >
            {loading && results.length === 0 && (
              <li className="px-3 py-3 font-mono text-[11px] uppercase tracking-[0.12em] text-birk-ink-faint">
                buscando…
              </li>
            )}
            {results.map((r, i) => (
              <li
                key={r.id}
                onMouseDown={(e) => {
                  e.preventDefault();
                  handleSelect(r);
                }}
                onMouseEnter={() => setActiveIdx(i)}
                className={cn(
                  "px-3 py-2.5 cursor-pointer flex items-start gap-2 border-b border-birk-edge/40 last:border-b-0 transition-colors",
                  activeIdx === i
                    ? "bg-birk-sun-pale"
                    : "bg-transparent hover:bg-birk-paper"
                )}
              >
                <MapPin
                  size={13}
                  className="mt-0.5 text-birk-terra flex-shrink-0"
                />
                <div className="min-w-0 flex-1">
                  <div className="font-serif text-sm text-birk-ink truncate">
                    {highlight(r.shortName, query)}
                  </div>
                  {r.context && (
                    <div className="font-mono text-[10px] text-birk-ink-faint tracking-[0.08em] truncate mt-0.5">
                      {r.context}
                    </div>
                  )}
                </div>
              </li>
            ))}
          </motion.ul>
        )}
      </AnimatePresence>

      {hint && <p className="text-xs text-birk-ink-faint">{hint}</p>}
    </div>
  );
}
