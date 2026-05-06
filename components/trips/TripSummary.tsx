"use client";

import { useEffect, useState } from "react";
import { motion, useMotionValue, animate } from "framer-motion";
import { MapPin, Clock, Navigation, Sun } from "lucide-react";
import { TripSummaryData } from "@/types";
import { formatDuration } from "@/lib/utils";

interface TripSummaryProps {
  data: TripSummaryData;
}

interface CountUpProps {
  to: number;
  format?: (n: number) => string;
  duration?: number;
}

function CountUp({ to, format = (n) => String(Math.round(n)), duration = 0.8 }: CountUpProps) {
  const [display, setDisplay] = useState(format(0));
  const mv = useMotionValue(0);

  useEffect(() => {
    const controls = animate(mv, to, {
      duration,
      ease: "easeOut",
      onUpdate: (v) => setDisplay(format(v)),
    });
    return controls.stop;
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [to]);

  return <motion.span>{display}</motion.span>;
}

export default function TripSummary({ data }: TripSummaryProps) {
  const items = [
    {
      icon: Navigation,
      label: "distância",
      value: data.totalKm > 0 ? <><CountUp to={data.totalKm} format={(n) => `~${Math.round(n)}`} />km</> : "—",
      color: "text-birk-sky",
      bg: "bg-birk-sky/20",
    },
    {
      icon: Clock,
      label: "na estrada",
      value: data.totalMinutes > 0 ? formatDuration(data.totalMinutes) : "—",
      color: "text-birk-leaf",
      bg: "bg-birk-leaf/10",
    },
    {
      icon: MapPin,
      label: "paradas",
      value: <CountUp to={data.stopsCount} />,
      color: "text-birk-sun",
      bg: "bg-birk-sun/15",
    },
    {
      icon: Sun,
      label: "dias",
      value: <CountUp to={data.days} />,
      color: "text-birk-terra",
      bg: "bg-birk-terra/10",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.95, y: 8 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: i * 0.07, duration: 0.5, ease: "easeOut" }}
          className="glass-card p-4 text-center"
        >
          <div
            className={`w-9 h-9 rounded ${item.bg} flex items-center justify-center mx-auto mb-2`}
          >
            <item.icon size={16} className={item.color} />
          </div>
          <div className="font-serif text-xl text-birk-ink italic">{item.value}</div>
          <div className="font-mono text-[10px] text-birk-ink-faint mt-0.5 uppercase tracking-[0.14em]">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
