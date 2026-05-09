"use client";

import { motion } from "framer-motion";
import { ArrowDown } from "lucide-react";
import { Trip } from "@/types";
import SunflowerDecor from "@/components/ui/SunflowerDecor";
import { formatDate, tripDays } from "@/lib/utils";

interface MuseuHeroProps {
  trip: Trip;
  stopsCount: number;
  onScrollDown: () => void;
}

export default function MuseuHero({ trip, stopsCount, onScrollDown }: MuseuHeroProps) {
  const days = tripDays(trip.start_date, trip.end_date);

  return (
    <section
      className="relative min-h-[90vh] flex items-center justify-center overflow-hidden"
      style={{
        background:
          "radial-gradient(1200px 600px at 50% 0%, rgba(242,177,52,.18), transparent 70%), radial-gradient(900px 700px at 90% 100%, rgba(180,83,58,.15), transparent 60%), #f5ecd9",
      }}
    >
      {/* decorative sunflowers around the title */}
      <SunflowerDecor
        size={130}
        rotation={-12}
        opacity={0.7}
        className="absolute"
        style={{ top: "12%", left: "8%" }}
      />
      <SunflowerDecor
        size={90}
        rotation={18}
        opacity={0.65}
        className="absolute"
        style={{ top: "18%", right: "12%" }}
      />
      <SunflowerDecor
        size={110}
        rotation={-6}
        opacity={0.6}
        className="absolute"
        style={{ bottom: "14%", left: "14%" }}
      />
      <SunflowerDecor
        size={80}
        rotation={22}
        opacity={0.55}
        className="absolute"
        style={{ bottom: "20%", right: "10%" }}
      />

      <div className="relative z-10 text-center max-w-3xl px-6 py-16">
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6 }}
          className="font-mono text-birk-terra text-[11px] tracking-[0.24em] uppercase mb-4"
        >
          {trip.start_date ? formatDate(trip.start_date) : ""}
          {trip.start_date && trip.end_date ? " — " : ""}
          {trip.end_date ? formatDate(trip.end_date) : ""}
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.15, duration: 0.6 }}
          className="eyebrow mb-3"
        >
          o museu de nós
        </motion.div>

        <motion.h1
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.8 }}
          className="font-serif text-birk-ink italic"
          style={{
            fontSize: "clamp(2.4rem, 6vw, 4.5rem)",
            fontWeight: 300,
            lineHeight: 1.05,
            letterSpacing: "-0.02em",
            marginBottom: 24,
          }}
        >
          {trip.name}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.45, duration: 0.6 }}
          className="font-hand text-birk-ink-soft"
          style={{ fontSize: "clamp(1.4rem, 2.4vw, 2rem)", transform: "rotate(-1.5deg)" }}
        >
          cada quilômetro foi nosso 💛
        </motion.p>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.65, duration: 0.6 }}
          className="flex items-center justify-center gap-6 mt-8 font-mono text-[10px] uppercase tracking-[0.18em] text-birk-ink-faint"
        >
          <span>
            <strong className="font-serif italic text-base text-birk-ink not-italic">{trip.origin}</strong>
            <br />origem
          </span>
          <span className="text-birk-terra text-2xl font-hand">↝</span>
          <span>
            <strong className="font-serif italic text-base text-birk-ink not-italic">{trip.destination}</strong>
            <br />destino
          </span>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.85, duration: 0.6 }}
          className="flex items-center justify-center gap-4 mt-10 pt-8"
          style={{ borderTop: "1px solid rgba(217,199,156,0.6)" }}
        >
          <div className="text-center">
            <div className="font-serif italic text-2xl text-birk-ink">{stopsCount}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-birk-ink-faint mt-0.5">
              paradas
            </div>
          </div>
          <span className="font-hand text-birk-edge text-2xl">·</span>
          <div className="text-center">
            <div className="font-serif italic text-2xl text-birk-ink">{days}</div>
            <div className="font-mono text-[9px] uppercase tracking-[0.16em] text-birk-ink-faint mt-0.5">
              dias
            </div>
          </div>
        </motion.div>

        <motion.button
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 1.1, duration: 0.6 }}
          onClick={onScrollDown}
          whileHover={{ y: 4 }}
          className="mt-12 inline-flex flex-col items-center gap-2 text-birk-ink-soft hover:text-birk-terra transition-colors cursor-pointer group"
        >
          <span className="font-hand text-xl" style={{ transform: "rotate(-2deg)" }}>
            descer pra reviver ↓
          </span>
          <motion.span
            animate={{ y: [0, 4, 0] }}
            transition={{ duration: 2, repeat: Infinity, ease: "easeInOut" }}
          >
            <ArrowDown size={18} />
          </motion.span>
        </motion.button>
      </div>
    </section>
  );
}
