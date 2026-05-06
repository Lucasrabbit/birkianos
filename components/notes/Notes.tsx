"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Trash2, CheckSquare, Square } from "lucide-react";
import { Note, Trip } from "@/types";
import { NOTE_TYPE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";
import Button from "@/components/ui/Button";
import FloralCorner from "@/components/ui/FloralCorner";
import { createNote, updateNote, deleteNote } from "@/lib/supabase";

interface NotesProps {
  trip: Trip;
  notes: Note[];
  onNotesChange: (notes: Note[]) => void;
}

type NoteType = "checklist" | "reminder" | "idea";
const NOTE_TYPES: NoteType[] = ["checklist", "reminder", "idea"];

export default function Notes({ trip, notes, onNotesChange }: NotesProps) {
  const [newContent, setNewContent] = useState("");
  const [newType, setNewType] = useState<NoteType>("checklist");
  const [adding, setAdding] = useState(false);

  const handleAdd = async () => {
    if (!newContent.trim()) return;
    setAdding(true);
    try {
      const note = await createNote({
        trip_id: trip.id,
        content: newContent.trim(),
        type: newType,
        completed: false,
      });
      onNotesChange([...notes, note]);
      setNewContent("");
    } finally {
      setAdding(false);
    }
  };

  const handleToggle = async (note: Note) => {
    const updated = await updateNote(note.id, { completed: !note.completed });
    onNotesChange(notes.map((n) => (n.id === note.id ? updated : n)));
  };

  const handleDelete = async (id: string) => {
    await deleteNote(id);
    onNotesChange(notes.filter((n) => n.id !== id));
  };

  const grouped = NOTE_TYPES.reduce(
    (acc, type) => {
      acc[type] = notes.filter((n) => n.type === type);
      return acc;
    },
    {} as Record<NoteType, Note[]>
  );

  return (
    <div className="relative space-y-6">
      <FloralCorner corner="bottom-right" density="light" baseOpacity={0.4} />
      <div className="glass-card p-4">
        <p className="font-serif text-sm text-birk-ink mb-3 italic">
          adicionar nota
        </p>

        <div className="flex gap-2 mb-3">
          {NOTE_TYPES.map((t) => {
            const cfg = NOTE_TYPE_CONFIG[t];
            return (
              <button
                key={t}
                onClick={() => setNewType(t)}
                className={cn(
                  "flex items-center gap-1.5 px-3 py-1.5 rounded-full font-mono text-[10px] uppercase tracking-[0.1em] transition-all cursor-pointer",
                  newType === t
                    ? "bg-birk-sun-pale text-birk-ink border border-birk-sun"
                    : "bg-birk-paper text-birk-ink-faint hover:text-birk-ink border border-transparent"
                )}
              >
                <span>{cfg.emoji}</span>
                <span>{cfg.label}</span>
              </button>
            );
          })}
        </div>

        <div className="flex gap-2">
          <input
            type="text"
            value={newContent}
            onChange={(e) => setNewContent(e.target.value)}
            onKeyDown={(e) => e.key === "Enter" && handleAdd()}
            placeholder={
              newType === "checklist"
                ? "ex: levar protetor solar"
                : newType === "reminder"
                ? "ex: confirmar reserva do hotel"
                : "ex: tirar foto no mirante ao pôr do sol"
            }
            className="flex-1 px-4 py-2.5 rounded border border-birk-edge bg-white/70 text-sm font-serif text-birk-ink placeholder:text-birk-ink-faint focus:outline-none focus:ring-2 focus:ring-birk-sun/40 focus:border-birk-sun transition-all"
          />
          <Button onClick={handleAdd} loading={adding} disabled={!newContent.trim()} className="px-4">
            <Plus size={16} />
          </Button>
        </div>
      </div>

      {NOTE_TYPES.map((type) => {
        const cfg = NOTE_TYPE_CONFIG[type];
        const typeNotes = grouped[type];
        if (typeNotes.length === 0) return null;

        return (
          <div key={type}>
            <div className="flex items-center gap-2 mb-3">
              <span className="text-base">{cfg.emoji}</span>
              <span className="font-serif text-birk-ink italic">{cfg.label}</span>
              <span className="font-mono px-2 py-0.5 rounded-full bg-birk-paper-deep text-[10px] text-birk-ink-faint tracking-[0.1em]">
                {typeNotes.length}
              </span>
            </div>

            <div className="space-y-2">
              <AnimatePresence>
                {typeNotes.map((note) => (
                  <motion.div
                    key={note.id}
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8, height: 0 }}
                    className="flex items-start gap-3 glass-card p-3 group"
                  >
                    {type === "checklist" ? (
                      <button
                        onClick={() => handleToggle(note)}
                        className="mt-0.5 flex-shrink-0 transition-colors"
                      >
                        {note.completed ? (
                          <CheckSquare size={18} className="text-birk-leaf" />
                        ) : (
                          <Square size={18} className="text-birk-ink-faint hover:text-birk-ink" />
                        )}
                      </button>
                    ) : (
                      <span className="mt-0.5 text-base flex-shrink-0">{cfg.emoji}</span>
                    )}

                    <p
                      className={cn(
                        "flex-1 font-serif text-sm text-birk-ink",
                        note.completed && "line-through text-birk-ink-faint"
                      )}
                    >
                      {note.content}
                    </p>

                    <button
                      onClick={() => handleDelete(note.id)}
                      className="opacity-0 group-hover:opacity-100 p-1 rounded hover:bg-red-50 text-birk-ink-faint hover:text-red-400 transition-all flex-shrink-0"
                    >
                      <Trash2 size={13} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </div>
        );
      })}

      {notes.length === 0 && (
        <div className="text-center py-10">
          <div className="text-3xl mb-2">📝</div>
          <p className="font-hand text-birk-ink-faint text-xl">
            isso aqui vai virar memória 💛
          </p>
          <p className="font-mono text-birk-ink-faint text-[11px] mt-1 uppercase tracking-[0.12em]">
            checklists · lembretes · ideias
          </p>
        </div>
      )}
    </div>
  );
}
