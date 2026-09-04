"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  DndContext,
  DragEndEvent,
  DragOverlay,
  DragStartEvent,
  PointerSensor,
  closestCenter,
  useSensor,
  useSensors,
} from "@dnd-kit/core";
import {
  SortableContext,
  arrayMove,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { Navigation, Plus } from "lucide-react";
import { addDays, format, parseISO } from "date-fns";
import { ptBR } from "date-fns/locale";
import { Stop, Trip } from "@/types";
import StopCard from "./StopCard";
import StopForm from "./StopForm";
import DayWeatherBadge from "./DayWeatherBadge";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import { formatDistance, formatDuration, tripDays } from "@/lib/utils";
import {
  createStop,
  updateStop,
  deleteStop,
  reorderStops,
  recalculateRoute,
} from "@/lib/api";

interface StopListProps {
  trip: Trip;
  stops: Stop[];
  onStopsChange: (stops: Stop[]) => void;
  onTripChange?: (trip: Trip) => void;
}

function sortStops(stops: Stop[]): Stop[] {
  return [...stops].sort((a, b) => a.day - b.day || a.position - b.position);
}

function dayDate(trip: Trip, day: number): string | undefined {
  if (!trip.start_date) return undefined;
  try {
    return format(addDays(parseISO(trip.start_date), day - 1), "yyyy-MM-dd");
  } catch {
    return undefined;
  }
}

function dayLabel(trip: Trip, day: number): string {
  const iso = dayDate(trip, day);
  if (!iso) return "";
  try {
    return format(parseISO(iso), "dd 'de' MMMM", { locale: ptBR });
  } catch {
    return "";
  }
}

export default function StopList({ trip, stops, onStopsChange, onTripChange }: StopListProps) {
  const [addingForDay, setAddingForDay] = useState<number | null>(null);
  const [editStop, setEditStop] = useState<Stop | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);
  const [calculating, setCalculating] = useState(false);
  const [routeMessage, setRouteMessage] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const ordered = sortStops(stops);
  const plannedDays = tripDays(trip.start_date, trip.end_date);
  const maxStopDay = ordered.reduce((max, s) => Math.max(max, s.day), 1);
  const totalDays = Math.max(plannedDays, maxStopDay);
  const days = Array.from({ length: totalDays }, (_, i) => i + 1);

  const stopsOfDay = (day: number) => ordered.filter((s) => s.day === day);

  const handleAddStop = async (data: Omit<Stop, "id" | "created_at">) => {
    const newStop = await createStop(data);
    onStopsChange(sortStops([...stops, newStop]));
    setAddingForDay(null);
  };

  const handleEditStop = async (data: Omit<Stop, "id" | "created_at">) => {
    if (!editStop) return;
    // mudou de dia? entra no fim do dia novo, senão herdaria uma posição do dia antigo
    const movedDay = data.day !== editStop.day;
    const payload = movedDay
      ? { ...data, position: stopsOfDay(data.day).length }
      : data;
    const updated = await updateStop(editStop.id, payload);
    onStopsChange(sortStops(stops.map((s) => (s.id === editStop.id ? updated : s))));
    setEditStop(null);
  };

  const handleDeleteStop = async (id: string) => {
    const removed = stops.find((s) => s.id === id);
    await deleteStop(id);
    const remaining = stops.filter((s) => s.id !== id);
    onStopsChange(sortStops(remaining));

    if (removed) {
      const renumbered = remaining
        .filter((s) => s.day === removed.day)
        .sort((a, b) => a.position - b.position)
        .map((s, i) => ({ id: s.id, position: i }));
      if (renumbered.length > 0) await reorderStops(renumbered);
    }
  };

  const handleDragStart = (event: DragStartEvent) => setActiveId(String(event.active.id));

  const handleDragEnd = async (event: DragEndEvent, day: number) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const dayStops = stopsOfDay(day);
    const oldIndex = dayStops.findIndex((s) => s.id === active.id);
    const newIndex = dayStops.findIndex((s) => s.id === over.id);
    if (oldIndex < 0 || newIndex < 0) return;

    const reordered = arrayMove(dayStops, oldIndex, newIndex).map((s, i) => ({
      ...s,
      position: i,
    }));
    const others = stops.filter((s) => s.day !== day);
    onStopsChange(sortStops([...others, ...reordered]));
    await reorderStops(reordered.map((s) => ({ id: s.id, position: s.position })));
  };

  const handleRecalculate = async () => {
    setCalculating(true);
    setRouteMessage(null);
    try {
      const result = await recalculateRoute(trip.id);
      onStopsChange(sortStops(result.trip.stops ?? []));
      onTripChange?.(result.trip);
      setRouteMessage(
        result.failed > 0
          ? `${result.calculated} trechos calculados · ${result.failed} sem rota encontrada`
          : `${result.calculated} trechos calculados ✿`
      );
    } catch (err) {
      setRouteMessage(err instanceof Error ? err.message : "Não deu pra calcular agora");
    } finally {
      setCalculating(false);
    }
  };

  const activeStop = stops.find((s) => s.id === activeId);

  return (
    <div className="space-y-6">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <Button variant="secondary" size="sm" onClick={handleRecalculate} loading={calculating}>
          <Navigation size={14} />
          calcular distâncias e tempos
        </Button>
        {routeMessage && (
          <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-birk-ink-faint">
            {routeMessage}
          </span>
        )}
      </div>

      {days.map((day) => {
        const dayStops = stopsOfDay(day);
        const iso = dayDate(trip, day);
        const label = dayLabel(trip, day);
        const dayMinutes = dayStops.reduce(
          (acc, s) => acc + (s.duration_minutes ?? 0) + (s.duration_from_prev ?? 0),
          0
        );
        const dayKm = dayStops.reduce((acc, s) => acc + (s.distance_from_prev ?? 0), 0);
        // clima do dia: usa a primeira parada com coordenadas, senão o destino/origem
        const anchorStop = dayStops.find(
          (s) => typeof s.lat === "number" && typeof s.lng === "number"
        );
        const anchorLat = anchorStop?.lat ?? trip.destination_lat ?? trip.origin_lat;
        const anchorLng = anchorStop?.lng ?? trip.destination_lng ?? trip.origin_lng;

        return (
          <section key={day} className="space-y-3">
            <div
              className="flex flex-wrap items-baseline justify-between gap-x-4 gap-y-1 pb-2"
              style={{ borderBottom: "1px solid #d9c79c" }}
            >
              <div className="flex items-baseline gap-3 flex-wrap">
                <span className="font-hand text-2xl text-birk-ink" style={{ fontWeight: 600 }}>
                  dia {day}
                </span>
                {label && (
                  <span className="font-mono text-[10px] uppercase tracking-[0.16em] text-birk-terra">
                    {label}
                  </span>
                )}
                <DayWeatherBadge lat={anchorLat} lng={anchorLng} date={iso} />
              </div>
              <div className="font-mono text-[10px] uppercase tracking-[0.12em] text-birk-ink-faint">
                {dayStops.length} {dayStops.length === 1 ? "parada" : "paradas"}
                {dayMinutes > 0 && ` · ${formatDuration(dayMinutes)}`}
                {dayKm > 0 && ` · ${formatDistance(dayKm)}`}
              </div>
            </div>

            <DndContext
              sensors={sensors}
              collisionDetection={closestCenter}
              onDragStart={handleDragStart}
              onDragEnd={(event) => handleDragEnd(event, day)}
            >
              <SortableContext
                items={dayStops.map((s) => s.id)}
                strategy={verticalListSortingStrategy}
              >
                <div className="space-y-3">
                  <AnimatePresence>
                    {dayStops.length === 0 ? (
                      <motion.p
                        initial={{ opacity: 0 }}
                        animate={{ opacity: 1 }}
                        className="font-serif text-birk-ink-faint text-sm italic py-3"
                      >
                        nada marcado pra esse dia ainda
                      </motion.p>
                    ) : (
                      dayStops.map((stop, i) => (
                        <StopCard
                          key={stop.id}
                          stop={stop}
                          index={i}
                          onEdit={(s) => setEditStop(s)}
                          onDelete={handleDeleteStop}
                        />
                      ))
                    )}
                  </AnimatePresence>
                </div>
              </SortableContext>

              <DragOverlay>
                {activeStop && activeStop.day === day && (
                  <div className="opacity-80 rotate-1 shadow-card-hover">
                    <StopCard
                      stop={activeStop}
                      index={dayStops.indexOf(activeStop)}
                      isDragging
                    />
                  </div>
                )}
              </DragOverlay>
            </DndContext>

            <button
              onClick={() => setAddingForDay(day)}
              className="w-full py-2.5 border-[1.5px] border-dashed border-birk-ink-faint text-birk-ink-soft rounded font-hand text-lg transition-all hover:border-birk-terra hover:text-birk-terra hover:bg-birk-paper-deep/40 cursor-pointer"
            >
              <Plus size={14} className="inline mr-1" />
              parada no dia {day}
            </button>
          </section>
        );
      })}

      <Modal
        open={addingForDay !== null}
        onClose={() => setAddingForDay(null)}
        title={`Nova parada — dia ${addingForDay ?? 1}`}
        size="lg"
      >
        {addingForDay !== null && (
          <StopForm
            tripId={trip.id}
            position={stopsOfDay(addingForDay).length}
            day={addingForDay}
            totalDays={totalDays}
            onSubmit={handleAddStop}
            onCancel={() => setAddingForDay(null)}
          />
        )}
      </Modal>

      <Modal open={!!editStop} onClose={() => setEditStop(null)} title="Editar parada" size="lg">
        {editStop && (
          <StopForm
            initial={editStop}
            tripId={trip.id}
            position={editStop.position}
            day={editStop.day}
            totalDays={totalDays}
            onSubmit={handleEditStop}
            onCancel={() => setEditStop(null)}
            submitLabel="Salvar alterações"
          />
        )}
      </Modal>
    </div>
  );
}
