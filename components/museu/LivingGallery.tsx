"use client";

import { motion } from "framer-motion";
import { Stop } from "@/types";
import StopIllustration from "./StopIllustration";

interface LivingGalleryProps {
  stops: Stop[];
}

function tilt(id: string): number {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((hash % 11) - 5) * 0.7;
}

export default function LivingGallery({ stops }: LivingGalleryProps) {
  if (stops.length === 0) return null;

  return (
    <section className="max-w-[1100px] mx-auto px-6 pt-8 pb-24">
      <div className="section-head" style={{ marginTop: 32, marginBottom: 48 }}>
        <h2>
          <span className="num">03 / galeria</span>
          <em>as polaroids que ficaram.</em>
        </h2>
        <span className="aside">passe o mouse pra abrir ✿</span>
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-14">
        {stops.map((stop, i) => {
          const rotation = tilt(stop.id);
          return (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 24, rotate: rotation * 0.4, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, rotate: rotation, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, duration: 0.55, ease: "easeOut" }}
              whileHover={{ rotate: 0, scale: 1.04, y: -6, zIndex: 5 }}
              className="polaroid relative"
              style={{ transformOrigin: "center bottom" }}
            >
              <span className="tape" />
              <div style={{ aspectRatio: "4/5" }} className="overflow-hidden">
                <StopIllustration type={stop.type} />
              </div>
              <div className="font-hand text-birk-ink text-center mt-3 text-xl leading-tight px-1" style={{ fontWeight: 600 }}>
                {stop.name}
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
}
