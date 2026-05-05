"use client";

import { motion } from "framer-motion";
import { MapPin, Clock, Navigation, Sun } from "lucide-react";
import { TripSummaryData } from "@/types";
import { formatDuration } from "@/lib/utils";

interface TripSummaryProps {
  data: TripSummaryData;
}

export default function TripSummary({ data }: TripSummaryProps) {
  const items = [
    {
      icon: Navigation,
      label: "distância",
      value: data.totalKm > 0 ? `~${Math.round(data.totalKm)}km` : "—",
      color: "text-birk-blue",
      bg: "bg-birk-blue/10",
    },
    {
      icon: Clock,
      label: "na estrada",
      value: data.totalMinutes > 0 ? formatDuration(data.totalMinutes) : "—",
      color: "text-birk-green",
      bg: "bg-birk-green/10",
    },
    {
      icon: MapPin,
      label: "paradas",
      value: String(data.stopsCount),
      color: "text-birk-yellow",
      bg: "bg-birk-yellow/10",
    },
    {
      icon: Sun,
      label: "dias",
      value: String(data.days),
      color: "text-orange-400",
      bg: "bg-orange-50",
    },
  ];

  return (
    <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
      {items.map((item, i) => (
        <motion.div
          key={item.label}
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ delay: i * 0.06 }}
          className="bg-white rounded-2xl shadow-soft border border-birk-border/50 p-4 text-center"
        >
          <div
            className={`w-9 h-9 rounded-xl ${item.bg} flex items-center justify-center mx-auto mb-2`}
          >
            <item.icon size={16} className={item.color} />
          </div>
          <div className="text-xl font-bold text-birk-text">{item.value}</div>
          <div className="text-xs text-birk-muted mt-0.5">{item.label}</div>
        </motion.div>
      ))}
    </div>
  );
}
