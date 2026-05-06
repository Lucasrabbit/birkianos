"use client";

import { motion } from "framer-motion";
import { Clock, MapPin } from "lucide-react";
import { Stop, Trip } from "@/types";
import { StopBadge } from "@/components/ui/Badge";
import { STOP_TYPE_CONFIG } from "@/lib/constants";
import { formatDate, formatDuration, addMinutesToTime } from "@/lib/utils";
import { parseISO, addDays, format } from "date-fns";
import { ptBR } from "date-fns/locale";

interface TimelineProps {
  trip: Trip;
  stops: Stop[];
}

interface DayGroup {
  date?: string;
  label: string;
  stops: Stop[];
}

function groupStopsByDay(trip: Trip, stops: Stop[]): DayGroup[] {
  if (!trip.start_date || stops.length === 0) {
    return [{ label: "Roteiro", stops }];
  }

  const groups: DayGroup[] = [];
  let currentGroup: DayGroup | null = null;
  let currentDate = parseISO(trip.start_date);
  let dayIndex = 0;

  const stopsWithTime = stops.filter((s) => s.arrival_time);

  if (stopsWithTime.length > 0) {
    for (const stop of stops) {
      const label = `Dia ${dayIndex + 1} — ${format(currentDate, "dd 'de' MMMM", { locale: ptBR })}`;
      const dateStr = format(currentDate, "yyyy-MM-dd");

      if (!currentGroup || currentGroup.date !== dateStr) {
        currentGroup = { date: dateStr, label, stops: [] };
        groups.push(currentGroup);
        dayIndex++;
      }

      currentGroup.stops.push(stop);

      const totalMinutes = (stop.duration_minutes ?? 0) + (stop.duration_from_prev ?? 0);
      if (totalMinutes > 12 * 60) {
        currentDate = addDays(currentDate, 1);
        dayIndex++;
        currentGroup = null;
      }
    }
  } else {
    const totalDays = trip.end_date
      ? Math.ceil(
          (parseISO(trip.end_date).getTime() - parseISO(trip.start_date).getTime()) /
            (1000 * 60 * 60 * 24)
        ) + 1
      : 1;

    const stopsPerDay = Math.ceil(stops.length / totalDays);
    for (let d = 0; d < totalDays; d++) {
      const date = addDays(currentDate, d);
      const dayStops = stops.slice(d * stopsPerDay, (d + 1) * stopsPerDay);
      if (dayStops.length > 0) {
        groups.push({
          date: format(date, "yyyy-MM-dd"),
          label: `Dia ${d + 1} — ${format(date, "dd 'de' MMMM", { locale: ptBR })}`,
          stops: dayStops,
        });
      }
    }
  }

  if (groups.length === 0) {
    return [{ label: "Roteiro", stops }];
  }

  return groups;
}

export default function Timeline({ trip, stops }: TimelineProps) {
  const groups = groupStopsByDay(trip, stops);

  if (stops.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-4xl mb-3">📅</div>
        <p className="font-serif text-birk-ink-faint text-sm italic">
          adicione paradas para ver a timeline
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-8">
      {groups.map((group, gi) => (
        <motion.div
          key={gi}
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: gi * 0.1 }}
        >
          <div className="flex items-center gap-3 mb-4">
            <div
              className="px-4 py-1.5 bg-birk-sun-pale border border-birk-sun/40 rounded font-hand text-xl text-birk-ink"
              style={{ fontWeight: 600 }}
            >
              {group.label}
            </div>
            <div className="flex-1 h-px bg-birk-edge" />
          </div>

          <div className="relative ml-4">
            <div className="timeline-rail absolute left-[17px] top-0 bottom-0 w-[3px]" />

            <div className="space-y-1">
              {group.stops.map((stop, si) => {
                const cfg = STOP_TYPE_CONFIG[stop.type];
                const departureTime =
                  stop.arrival_time && stop.duration_minutes
                    ? addMinutesToTime(stop.arrival_time, stop.duration_minutes)
                    : null;

                return (
                  <motion.div
                    key={stop.id}
                    initial={{ opacity: 0, x: -12 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, margin: "-40px" }}
                    transition={{ delay: si * 0.08, duration: 0.5, ease: "easeOut" }}
                    className="relative flex gap-4 pb-6"
                  >
                    {/* Emoji pin on timeline */}
                    <div
                      className={`relative z-10 w-9 h-9 rounded-full ${cfg.bg} border-2 border-birk-paper shadow-soft flex items-center justify-center text-base flex-shrink-0`}
                    >
                      {cfg.emoji}
                    </div>

                    <div className="flex-1 min-w-0 glass-card p-4">
                      <div className="flex items-start justify-between gap-2 mb-1">
                        <div>
                          <span className="font-serif text-birk-ink text-base">
                            {stop.name}
                          </span>
                          <div className="mt-1">
                            <StopBadge type={stop.type} />
                          </div>
                        </div>
                        <div className="text-right flex-shrink-0">
                          {stop.arrival_time && (
                            <div className="flex items-center gap-1 font-mono text-[11px] text-birk-ink tracking-[0.08em]">
                              <Clock size={11} />
                              {stop.arrival_time}
                            </div>
                          )}
                          {departureTime && (
                            <div className="font-mono text-[11px] text-birk-ink-faint mt-0.5 tracking-[0.08em]">
                              saída {departureTime}
                            </div>
                          )}
                          {stop.duration_minutes && (
                            <div className="font-mono text-[11px] text-birk-ink-faint mt-0.5 tracking-[0.08em]">
                              {formatDuration(stop.duration_minutes)}
                            </div>
                          )}
                        </div>
                      </div>

                      {stop.address && (
                        <p className="flex items-center gap-1 font-mono text-[11px] text-birk-ink-faint mt-2 tracking-[0.08em]">
                          <MapPin size={10} />
                          {stop.address}
                        </p>
                      )}

                      {stop.expected_moment && (
                        <p className="font-hand text-base text-birk-ink-soft mt-2 pt-2 border-t border-birk-edge italic">
                          💛 &ldquo;{stop.expected_moment}&rdquo;
                        </p>
                      )}
                    </div>
                  </motion.div>
                );
              })}
            </div>
          </div>
        </motion.div>
      ))}
    </div>
  );
}
