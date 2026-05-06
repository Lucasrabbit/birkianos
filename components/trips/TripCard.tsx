"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight } from "lucide-react";
import Link from "next/link";
import { Trip } from "@/types";
import { formatDate, tripDays } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
  index?: number;
}

function getGradient(str: string): string {
  const gradients = [
    "linear-gradient(160deg, #e8b86a 0%, #b4533a 60%, #5a3a14 100%)",
    "linear-gradient(160deg, #7aa8c4 0%, #3d5a7a 100%)",
    "linear-gradient(160deg, #a8c66a 0%, #5a6b3a 100%)",
    "linear-gradient(160deg, #b4533a 0%, #8a3a26 100%)",
    "linear-gradient(160deg, #94a8b4 0%, #3d4a55 100%)",
    "linear-gradient(160deg, #e89858 0%, #b4533a 100%)",
    "linear-gradient(160deg, #f5d484 0%, #5a6b3a 100%)",
    "linear-gradient(160deg, #d4825a 0%, #8a3a26 100%)",
  ];
  const hash = str.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

function getRotation(id: string): number {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((hash % 9) - 4) * 0.6;
}

export default function TripCard({ trip, onDelete, index = 0 }: TripCardProps) {
  const days = tripDays(trip.start_date, trip.end_date);
  const rotation = getRotation(trip.id);
  const gradient = getGradient(trip.destination);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, rotate: rotation * 0.5 }}
      animate={{ opacity: 1, y: 0, rotate: rotation }}
      transition={{ duration: 0.5, delay: index * 0.1, ease: "easeOut" }}
      whileHover={{ y: -6, rotate: 0, scale: 1.02 }}
      className="relative group"
      style={{ transformOrigin: "center bottom" }}
    >
      <Link href={`/trips/${trip.id}`}>
        <div className="polaroid cursor-pointer" style={{ borderRadius: "2px" }}>
          {/* Tape strip */}
          <span className="tape" />

          {/* Photo area */}
          <div
            className="w-full relative overflow-hidden"
            style={{ height: "160px", background: gradient, borderRadius: "1px" }}
          >
            <div
              className="absolute inset-0 flex flex-col justify-end p-4"
              style={{ background: "linear-gradient(to top, rgba(43,31,18,0.45) 0%, transparent 60%)" }}
            >
              <div className="flex items-center gap-1.5 text-white/90 text-sm font-serif">
                <MapPin size={12} />
                <span>{trip.origin}</span>
                <ArrowRight size={12} className="opacity-60" />
                <MapPin size={12} />
                <span>{trip.destination}</span>
              </div>
            </div>
          </div>

          {/* Caption area */}
          <div className="px-3 pt-3 pb-1">
            <h3
              className="font-hand text-birk-ink leading-tight mb-1 text-center"
              style={{ fontSize: "1.3rem", fontWeight: 600 }}
            >
              {trip.name}
            </h3>

            <div className="flex items-center justify-center gap-3 flex-wrap mt-1">
              {(trip.start_date || trip.end_date) && (
                <span className="flex items-center gap-1 font-mono text-birk-ink-faint text-[10px] tracking-[0.1em] uppercase">
                  <Calendar size={9} />
                  {trip.start_date ? formatDate(trip.start_date) : ""}
                  {trip.start_date && trip.end_date ? " – " : ""}
                  {trip.end_date ? formatDate(trip.end_date) : ""}
                </span>
              )}
              {days > 1 && (
                <span className="font-hand text-birk-terra text-sm" style={{ fontWeight: 600 }}>
                  {days} dias
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {onDelete && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute top-6 right-2 opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-full bg-birk-paper/90 text-red-400 hover:text-red-600 hover:bg-white transition-all shadow-sm text-xs"
          onClick={(e) => {
            e.preventDefault();
            onDelete(trip.id);
          }}
        >
          ×
        </motion.button>
      )}
    </motion.div>
  );
}
