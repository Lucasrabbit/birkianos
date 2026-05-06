"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function Topbar() {
  const pathname = usePathname();

  const vol = `VOL. 07 · ${new Date().toLocaleDateString("pt-BR", {
    month: "short",
    year: "2-digit",
  }).toUpperCase()}`;

  return (
    <header className="sticky top-0 z-40 bg-birk-paper/90 backdrop-blur-sm border-b border-birk-edge/40">
      <div
        className="max-w-[1240px] mx-auto px-6 md:px-14 py-3 flex items-center justify-between"
      >
        {/* Brand */}
        <div className="flex items-center gap-3">
          <div
            className="w-11 h-11 rounded-full bg-birk-ink text-birk-paper flex items-center justify-center font-hand text-2xl font-bold flex-shrink-0"
            style={{ transform: "rotate(-6deg)", boxShadow: "2px 3px 0 #d9c79c" }}
          >
            B
          </div>
          <div className="leading-tight">
            <div className="font-hand text-birk-ink text-[1.7rem] leading-none">
              Birkianos Trips
            </div>
            <div className="font-mono text-birk-ink-faint text-[10px] tracking-[0.14em] uppercase mt-0.5">
              Lucas &amp; Rox · est. 2023
            </div>
          </div>
        </div>

        {/* Pill nav — desktop only */}
        <nav
          className="hidden md:flex gap-1.5 items-center bg-white/35 border border-birk-edge rounded-full px-1.5 py-1.5 backdrop-blur-sm"
        >
          {[
            { href: "/", label: "o diário" },
            { href: "/trips/new", label: "nova viagem" },
          ].map(({ href, label }) => {
            const active = pathname === href;
            return (
              <Link
                key={href}
                href={href}
                className={`font-serif text-sm px-4 py-2 rounded-full transition-all ${
                  active
                    ? "bg-birk-ink text-birk-paper italic"
                    : "text-birk-ink-soft hover:bg-birk-paper hover:text-birk-ink"
                }`}
              >
                {label}
              </Link>
            );
          })}
        </nav>

        {/* Stamp */}
        <div
          className="font-mono text-birk-ink-faint text-[11px] tracking-[0.12em] border border-dashed border-birk-ink-faint px-2.5 py-1.5 rounded-[4px]"
          style={{ transform: "rotate(2deg)" }}
        >
          {vol}
        </div>
      </div>
    </header>
  );
}
