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
import { Plus } from "lucide-react";
import { Stop, Trip } from "@/types";
import StopCard from "./StopCard";
import StopForm from "./StopForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import {
  createStop,
  updateStop,
  deleteStop,
  reorderStops,
} from "@/lib/supabase";

interface StopListProps {
  trip: Trip;
  stops: Stop[];
  onStopsChange: (stops: Stop[]) => void;
}

export default function StopList({ trip, stops, onStopsChange }: StopListProps) {
  const [addOpen, setAddOpen] = useState(false);
  const [editStop, setEditStop] = useState<Stop | null>(null);
  const [activeId, setActiveId] = useState<string | null>(null);

  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 8 } })
  );

  const handleAddStop = async (data: Omit<Stop, "id" | "created_at">) => {
    const newStop = await createStop({ ...data, position: stops.length });
    onStopsChange([...stops, newStop]);
    setAddOpen(false);
  };

  const handleEditStop = async (data: Omit<Stop, "id" | "created_at">) => {
    if (!editStop) return;
    const updated = await updateStop(editStop.id, data);
    onStopsChange(stops.map((s) => (s.id === editStop.id ? updated : s)));
    setEditStop(null);
  };

  const handleDeleteStop = async (id: string) => {
    await deleteStop(id);
    const remaining = stops
      .filter((s) => s.id !== id)
      .map((s, i) => ({ ...s, position: i }));
    await reorderStops(remaining.map((s) => ({ id: s.id, position: s.position })));
    onStopsChange(remaining);
  };

  const handleDragStart = (event: DragStartEvent) => {
    setActiveId(String(event.active.id));
  };

  const handleDragEnd = async (event: DragEndEvent) => {
    setActiveId(null);
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = stops.findIndex((s) => s.id === active.id);
    const newIndex = stops.findIndex((s) => s.id === over.id);
    const reordered = arrayMove(stops, oldIndex, newIndex).map((s, i) => ({
      ...s,
      position: i,
    }));
    onStopsChange(reordered);
    await reorderStops(reordered.map((s) => ({ id: s.id, position: s.position })));
  };

  const activeStop = stops.find((s) => s.id === activeId);

  return (
    <div className="space-y-3">
      <DndContext
        sensors={sensors}
        collisionDetection={closestCenter}
        onDragStart={handleDragStart}
        onDragEnd={handleDragEnd}
      >
        <SortableContext
          items={stops.map((s) => s.id)}
          strategy={verticalListSortingStrategy}
        >
          <AnimatePresence>
            {stops.length === 0 ? (
              <motion.div
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                className="text-center py-12"
              >
                <div className="text-4xl mb-3">🗺️</div>
                <p className="font-serif text-birk-ink-faint text-sm italic">
                  nenhuma parada ainda… bora começar?
                </p>
              </motion.div>
            ) : (
              stops.map((stop, i) => (
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
        </SortableContext>

        <DragOverlay>
          {activeStop && (
            <div className="opacity-80 rotate-1 shadow-card-hover">
              <StopCard
                stop={activeStop}
                index={stops.indexOf(activeStop)}
                isDragging
              />
            </div>
          )}
        </DragOverlay>
      </DndContext>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 0.3 }}
        className="pt-2"
      >
        <button
          onClick={() => setAddOpen(true)}
          className="w-full py-3.5 border-[1.5px] border-dashed border-birk-ink-faint text-birk-ink-soft rounded font-hand text-xl transition-all hover:border-birk-terra hover:text-birk-terra hover:bg-birk-paper-deep/40 cursor-pointer"
        >
          + adicionar uma parada nossa
        </button>
      </motion.div>

      <Modal open={addOpen} onClose={() => setAddOpen(false)} title="Nova parada" size="lg">
        <StopForm
          tripId={trip.id}
          position={stops.length}
          onSubmit={handleAddStop}
          onCancel={() => setAddOpen(false)}
        />
      </Modal>

      <Modal open={!!editStop} onClose={() => setEditStop(null)} title="Editar parada" size="lg">
        {editStop && (
          <StopForm
            initial={editStop}
            tripId={trip.id}
            position={editStop.position}
            onSubmit={handleEditStop}
            onCancel={() => setEditStop(null)}
            submitLabel="Salvar alterações"
          />
        )}
      </Modal>
    </div>
  );
}
