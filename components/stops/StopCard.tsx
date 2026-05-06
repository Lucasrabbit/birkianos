"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Clock, MapPin, Edit2, Trash2, ChevronDown, ChevronUp, GripVertical } from "lucide-react";
import { Stop } from "@/types";
import { StopBadge } from "@/components/ui/Badge";
import { formatDuration } from "@/lib/utils";
import { useSortable } from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { cn } from "@/lib/utils";

interface StopCardProps {
  stop: Stop;
  index: number;
  onEdit?: (stop: Stop) => void;
  onDelete?: (id: string) => void;
  isDragging?: boolean;
}

export default function StopCard({
  stop,
  index,
  onEdit,
  onDelete,
  isDragging,
}: StopCardProps) {
  const [expanded, setExpanded] = useState(false);

  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging: isSortableDragging,
  } = useSortable({ id: stop.id });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
  };

  const hasExtra = stop.comment || stop.why_here || stop.expected_moment;

  return (
    <motion.div
      ref={setNodeRef}
      style={{
        ...style,
        background: "rgba(255,251,240,0.7)",
        border: "1px solid #d9c79c",
        padding: "14px 18px",
        borderRadius: "4px",
        transformOrigin: "center bottom",
      }}
      initial={{ opacity: 0, y: 16 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-40px" }}
      transition={{ delay: index * 0.06, duration: 0.5, ease: "easeOut" }}
      whileHover={{ translateX: 4 }}
      className={cn(
        "stop-item-card transition-all duration-200",
        isSortableDragging && "opacity-50 scale-[1.02] z-50"
      )}
    >
      <div className="flex items-start gap-3">
        <button
          {...attributes}
          {...listeners}
          className="mt-1 p-1 rounded text-birk-ink-faint hover:text-birk-ink hover:bg-birk-paper cursor-grab active:cursor-grabbing transition-colors flex-shrink-0"
          aria-label="Arrastar para reordenar"
        >
          <GripVertical size={16} />
        </button>

        {/* Stop pin */}
        <div className="stop-pin mt-0.5" style={{ marginTop: "4px" }}>
          {index + 1}
        </div>

        <div className="flex-1 min-w-0">
          <div className="flex items-start justify-between gap-2">
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <span className="font-serif text-birk-ink text-base">
                  {stop.name}
                </span>
                <StopBadge type={stop.type} />
              </div>

              <div className="flex items-center gap-3 mt-1 font-mono text-[11px] text-birk-ink-faint flex-wrap tracking-[0.08em]">
                {stop.arrival_time && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {stop.arrival_time}
                  </span>
                )}
                {stop.duration_minutes && (
                  <span className="flex items-center gap-1">
                    <Clock size={11} />
                    {formatDuration(stop.duration_minutes)}
                  </span>
                )}
                {stop.address && (
                  <span className="flex items-center gap-1 truncate">
                    <MapPin size={11} />
                    {stop.address}
                  </span>
                )}
              </div>
            </div>

            <div className="flex items-center gap-1 flex-shrink-0">
              {hasExtra && (
                <button
                  onClick={() => setExpanded((v) => !v)}
                  className="p-1.5 rounded hover:bg-birk-paper text-birk-ink-faint hover:text-birk-ink transition-colors"
                >
                  {expanded ? <ChevronUp size={14} /> : <ChevronDown size={14} />}
                </button>
              )}
              {onEdit && (
                <button
                  onClick={() => onEdit(stop)}
                  className="p-1.5 rounded hover:bg-birk-paper text-birk-ink-faint hover:text-birk-ink transition-colors"
                >
                  <Edit2 size={14} />
                </button>
              )}
              {onDelete && (
                <button
                  onClick={() => onDelete(stop.id)}
                  className="p-1.5 rounded hover:bg-red-50 text-birk-ink-faint hover:text-red-500 transition-colors"
                >
                  <Trash2 size={14} />
                </button>
              )}
            </div>
          </div>
        </div>
      </div>

      <AnimatePresence>
        {expanded && hasExtra && (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.2 }}
            className="overflow-hidden"
          >
            <div className="ml-[3.75rem] mt-3 space-y-2 pt-3 border-t border-birk-edge">
              {stop.comment && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-birk-ink-faint mb-0.5">
                    Comentários
                  </p>
                  <p className="font-serif text-sm text-birk-ink">{stop.comment}</p>
                </div>
              )}
              {stop.why_here && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-birk-ink-faint mb-0.5">
                    Por que esse lugar entrou?
                  </p>
                  <p className="font-serif text-sm text-birk-ink">{stop.why_here}</p>
                </div>
              )}
              {stop.expected_moment && (
                <div>
                  <p className="font-mono text-[10px] uppercase tracking-[0.14em] text-birk-ink-faint mb-0.5">
                    Momento esperado 💛
                  </p>
                  <p className="font-serif text-sm text-birk-ink italic">
                    &ldquo;{stop.expected_moment}&rdquo;
                  </p>
                </div>
              )}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </motion.div>
  );
}
