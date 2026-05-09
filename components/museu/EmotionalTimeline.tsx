"use client";

import { motion } from "framer-motion";
import { Stop } from "@/types";
import { STOP_TYPE_CONFIG } from "@/lib/constants";

interface EmotionalTimelineProps {
  stops: Stop[];
}

export default function EmotionalTimeline({ stops }: EmotionalTimelineProps) {
  if (stops.length === 0) {
    return (
      <section className="max-w-3xl mx-auto px-6 py-20 text-center">
        <p className="font-hand text-birk-ink-faint text-2xl">
          ainda não foi escrito 🌱
        </p>
      </section>
    );
  }

  return (
    <section className="max-w-3xl mx-auto px-6 py-16 md:py-24">
      <div className="section-head" style={{ marginTop: 0, marginBottom: 56 }}>
        <h2>
          <span className="num">02 / o conto</span>
          <em>cada parada virou memória.</em>
        </h2>
        <span className="aside">leia devagar ✿</span>
      </div>

      <div className="space-y-20 md:space-y-24">
        {stops.map((stop, i) => {
          const cfg = STOP_TYPE_CONFIG[stop.type];
          // alternate alignment for visual rhythm
          const alignRight = i % 2 === 1;

          return (
            <motion.article
              key={stop.id}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{ duration: 0.7, ease: "easeOut" }}
              className={`relative ${alignRight ? "md:text-right md:ml-auto" : ""}`}
              style={{ maxWidth: "640px" }}
            >
              <div className={`flex items-center gap-4 mb-4 ${alignRight ? "md:flex-row-reverse" : ""}`}>
                <div className="text-5xl md:text-6xl select-none" aria-hidden>
                  {cfg.emoji}
                </div>
                <div>
                  <div className="font-mono text-birk-terra text-[10px] tracking-[0.22em] uppercase">
                    parada · {String(i + 1).padStart(2, "0")}
                  </div>
                  {stop.arrival_time && (
                    <div className="font-mono text-birk-ink-faint text-[10px] tracking-[0.16em] mt-0.5">
                      {stop.arrival_time}
                    </div>
                  )}
                </div>
              </div>

              <h3
                className="font-serif text-birk-ink italic"
                style={{
                  fontSize: "clamp(1.7rem, 3.4vw, 2.6rem)",
                  fontWeight: 300,
                  lineHeight: 1.1,
                  letterSpacing: "-0.015em",
                  marginBottom: 16,
                }}
              >
                {stop.name}
              </h3>

              {stop.address && (
                <p className="font-mono text-birk-ink-faint text-[11px] tracking-[0.1em] mb-5">
                  📍 {stop.address}
                </p>
              )}

              {stop.why_here && (
                <div className="my-6">
                  <div className="font-mono text-birk-terra text-[9px] tracking-[0.22em] uppercase mb-2">
                    por que entrou no roteiro
                  </div>
                  <p
                    className="font-hand text-birk-ink-soft"
                    style={{ fontSize: "1.5rem", lineHeight: 1.5 }}
                  >
                    {stop.why_here}
                  </p>
                </div>
              )}

              {stop.expected_moment && (
                <blockquote
                  className={`my-6 ${alignRight ? "md:border-r-2 md:pr-5 md:border-l-0" : "border-l-2 pl-5"}`}
                  style={{ borderColor: "#b4533a" }}
                >
                  <div className="font-mono text-birk-terra text-[9px] tracking-[0.22em] uppercase mb-2">
                    o momento que esperamos viver
                  </div>
                  <p
                    className="font-serif italic text-birk-ink"
                    style={{ fontSize: "1.25rem", lineHeight: 1.55 }}
                  >
                    &ldquo;{stop.expected_moment}&rdquo;
                  </p>
                </blockquote>
              )}

              {stop.comment && (
                <p
                  className="font-serif text-birk-ink-soft mt-4"
                  style={{ fontSize: "0.95rem", lineHeight: 1.65 }}
                >
                  {stop.comment}
                </p>
              )}

              {/* divider doodle */}
              {i < stops.length - 1 && (
                <div
                  className={`mt-12 font-hand text-birk-edge text-3xl select-none ${
                    alignRight ? "md:text-right" : ""
                  }`}
                  aria-hidden
                >
                  ✿ ✿ ✿
                </div>
              )}
            </motion.article>
          );
        })}
      </div>
    </section>
  );
}
