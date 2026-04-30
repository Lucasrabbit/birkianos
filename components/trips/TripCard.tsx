"use client";

import { motion } from "framer-motion";
import { MapPin, Calendar, ArrowRight, Trash2 } from "lucide-react";
import Link from "next/link";
import { Trip } from "@/types";
import { formatDate, tripDays } from "@/lib/utils";

interface TripCardProps {
  trip: Trip;
  onDelete?: (id: string) => void;
  index?: number;
}

export default function TripCard({ trip, onDelete, index = 0 }: TripCardProps) {
  const days = tripDays(trip.start_date, trip.end_date);

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4, delay: index * 0.08 }}
      whileHover={{ y: -2 }}
      className="group relative"
    >
      <Link href={`/trips/${trip.id}`}>
        <div className="bg-white rounded-3xl shadow-card hover:shadow-card-hover transition-all duration-300 p-6 border border-birk-border/50 cursor-pointer">
          <div className="flex items-start justify-between gap-3 mb-4">
            <div>
              <h3 className="font-semibold text-birk-text text-lg leading-tight mb-1">
                {trip.name}
              </h3>
              {(trip.start_date || trip.end_date) && (
                <div className="flex items-center gap-1.5 text-birk-muted text-sm">
                  <Calendar size={13} />
                  <span>
                    {trip.start_date
                      ? formatDate(trip.start_date)
                      : ""}
                    {trip.start_date && trip.end_date && " → "}
                    {trip.end_date ? formatDate(trip.end_date) : ""}
                  </span>
                  {days > 1 && (
                    <span className="ml-1 px-2 py-0.5 rounded-lg bg-birk-yellow-soft text-xs font-medium text-birk-text">
                      {days} dias
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="w-10 h-10 rounded-2xl bg-birk-yellow-soft flex items-center justify-center text-lg flex-shrink-0">
              ✈️
            </div>
          </div>

          <div className="flex items-center gap-2 text-sm">
            <div className="flex items-center gap-1 text-birk-text font-medium">
              <MapPin size={13} className="text-birk-yellow" />
              <span>{trip.origin}</span>
            </div>
            <ArrowRight
              size={14}
              className="text-birk-muted flex-shrink-0"
            />
            <div className="flex items-center gap-1 text-birk-text font-medium">
              <MapPin size={13} className="text-birk-green" />
              <span>{trip.destination}</span>
            </div>
          </div>
        </div>
      </Link>

      {onDelete && (
        <motion.button
          initial={{ opacity: 0 }}
          whileHover={{ opacity: 1 }}
          className="absolute top-4 right-4 opacity-0 group-hover:opacity-100 p-2 rounded-xl bg-red-50 text-red-400 hover:text-red-600 hover:bg-red-100 transition-all"
          onClick={(e) => {
            e.preventDefault();
            onDelete(trip.id);
          }}
        >
          <Trash2 size={15} />
        </motion.button>
      )}
    </motion.div>
  );
}
