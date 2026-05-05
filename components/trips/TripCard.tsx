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

// Gera gradiente consistente baseado no destino
function getGradient(str: string): string {
  const gradients = [
    "linear-gradient(135deg, #F4C430 0%, #E8A020 100%)",
    "linear-gradient(135deg, #A8DADC 0%, #5BA8AB 100%)",
    "linear-gradient(135deg, #7FB77E 0%, #4A8F4A 100%)",
    "linear-gradient(135deg, #C4784A 0%, #A05A30 100%)",
    "linear-gradient(135deg, #D4A8DC 0%, #9B5EAB 100%)",
    "linear-gradient(135deg, #F4A460 0%, #D2691E 100%)",
    "linear-gradient(135deg, #87CEEB 0%, #4682B4 100%)",
    "linear-gradient(135deg, #DDA0DD 0%, #9370DB 100%)",
  ];
  const hash = str.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return gradients[hash % gradients.length];
}

// Rotação leve e consistente por viagem
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
      whileHover={{ y: -4, rotate: 0, scale: 1.01 }}
      className="relative group"
      style={{ transformOrigin: "center bottom" }}
    >
      <Link href={`/trips/${trip.id}`}>
        <div
          className="polaroid cursor-pointer bg-white rounded-sm overflow-hidden"
          style={{ borderRadius: "4px" }}
        >
          {/* Photo area — gradient placeholder */}
          <div
            className="w-full relative overflow-hidden"
            style={{ height: "160px", background: gradient }}
          >
            {/* Destination name overlay */}
            <div className="absolute inset-0 flex flex-col justify-end p-4"
              style={{ background: "linear-gradient(to top, rgba(0,0,0,0.4) 0%, transparent 60%)" }}
            >
              <div className="flex items-center gap-1.5 text-white/90 text-sm font-medium">
                <MapPin size={12} />
                <span>{trip.origin}</span>
                <ArrowRight size={12} className="opacity-60" />
                <MapPin size={12} />
                <span>{trip.destination}</span>
              </div>
            </div>

            {/* Decorative grain */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{ opacity: 0.15, backgroundImage: "url(\"data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.75' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E\")" }}
            />
          </div>

          {/* Label area (Polaroid bottom) */}
          <div className="px-4 pt-4 pb-5">
            <h3
              className="font-serif text-birk-text leading-tight mb-1"
              style={{ fontSize: "1.1rem", fontWeight: 600 }}
            >
              {trip.name}
            </h3>

            <div className="flex items-center gap-3 flex-wrap mt-1">
              {(trip.start_date || trip.end_date) && (
                <span className="flex items-center gap-1 text-birk-muted text-xs">
                  <Calendar size={10} />
                  {trip.start_date ? formatDate(trip.start_date) : ""}
                  {trip.start_date && trip.end_date ? " – " : ""}
                  {trip.end_date ? formatDate(trip.end_date) : ""}
                </span>
              )}
              {days > 1 && (
                <span
                  className="font-hand text-birk-terra text-sm"
                  style={{ fontWeight: 600 }}
                >
                  {days} dias
                </span>
              )}
            </div>
          </div>
        </div>
      </Link>

      {/* Delete button */}
      {onDelete && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 w-7 h-7 flex items-center justify-center rounded-full bg-white/90 text-red-400 hover:text-red-600 hover:bg-white transition-all shadow-sm text-xs"
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
