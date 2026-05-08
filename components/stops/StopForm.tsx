"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import PlaceAutocomplete from "@/components/ui/PlaceAutocomplete";
import { Stop, StopType } from "@/types";
import { STOP_TYPE_CONFIG } from "@/lib/constants";
import { cn } from "@/lib/utils";

interface StopFormProps {
  initial?: Partial<Stop>;
  tripId: string;
  position: number;
  onSubmit: (data: Omit<Stop, "id" | "created_at">) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

const TYPES: StopType[] = [
  "food",
  "technical",
  "accommodation",
  "attraction",
  "bathroom",
  "highlight",
];

export default function StopForm({
  initial,
  tripId,
  position,
  onSubmit,
  onCancel,
  submitLabel = "Adicionar parada ✨",
}: StopFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    type: (initial?.type ?? "attraction") as StopType,
    arrival_time: initial?.arrival_time ?? "",
    duration_minutes: initial?.duration_minutes ?? ("" as number | ""),
    comment: initial?.comment ?? "",
    why_here: initial?.why_here ?? "",
    expected_moment: initial?.expected_moment ?? "",
    address: initial?.address ?? "",
    lat: initial?.lat,
    lng: initial?.lng,
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Qual é o nome da parada?";
    return e;
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const errs = validate();
    if (Object.keys(errs).length > 0) {
      setErrors(errs);
      return;
    }
    setLoading(true);
    try {
      await onSubmit({
        trip_id: tripId,
        position,
        name: form.name.trim(),
        type: form.type,
        arrival_time: form.arrival_time || undefined,
        duration_minutes:
          form.duration_minutes !== "" ? Number(form.duration_minutes) : undefined,
        comment: form.comment.trim() || undefined,
        why_here: form.why_here.trim() || undefined,
        expected_moment: form.expected_moment.trim() || undefined,
        address: form.address.trim() || undefined,
        lat: form.lat,
        lng: form.lng,
      });
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string | number) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.04 }}
      >
        <Input
          label="Nome da parada"
          placeholder="ex: Cachoeira da Fumaça"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.08 }}
      >
        <label className="text-sm font-serif text-birk-ink block mb-2">
          Tipo
        </label>
        <div className="grid grid-cols-3 gap-2">
          {TYPES.map((t) => {
            const cfg = STOP_TYPE_CONFIG[t];
            return (
              <button
                key={t}
                type="button"
                onClick={() => set("type", t)}
                className={cn(
                  "flex flex-col items-center gap-1 p-3 rounded border-2 transition-all text-xs cursor-pointer",
                  form.type === t
                    ? "border-birk-sun bg-birk-sun-pale text-birk-ink font-serif"
                    : "border-birk-edge bg-white/70 text-birk-ink-faint hover:border-birk-sun/50"
                )}
              >
                <span className="text-xl">{cfg.emoji}</span>
                <span className="font-mono text-[10px] uppercase tracking-[0.1em]">{cfg.label}</span>
              </button>
            );
          })}
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <PlaceAutocomplete
          label="Endereço / localização"
          placeholder="ex: Cachoeira da Fumaça, Bahia"
          value={form.address}
          onChange={(val) => {
            // typing manually invalidates previously selected lat/lng
            setForm((f) => ({ ...f, address: val, lat: undefined, lng: undefined }));
          }}
          onSelect={(place) => {
            setForm((f) => ({
              ...f,
              address: place.shortName,
              lat: place.lat,
              lng: place.lng,
              // if name is still empty, prefill with the selected place
              name: f.name.trim() ? f.name : place.shortName,
            }));
          }}
          hint={
            form.lat && form.lng
              ? `📍 ${form.lat.toFixed(4)}, ${form.lng.toFixed(4)} — coordenadas salvas`
              : "Comece a digitar um endereço — vamos buscar a localização exata"
          }
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.16 }}
        className="grid grid-cols-2 gap-4"
      >
        <Input
          label="Horário de chegada"
          type="time"
          value={form.arrival_time}
          onChange={(e) => set("arrival_time", e.target.value)}
        />
        <Input
          label="Tempo de permanência (min)"
          type="number"
          min={0}
          placeholder="ex: 60"
          value={String(form.duration_minutes)}
          onChange={(e) => set("duration_minutes", e.target.value)}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Textarea
          label="Comentários do casal"
          placeholder="o que vocês querem lembrar sobre esse lugar..."
          value={form.comment}
          onChange={(e) => set("comment", e.target.value)}
          rows={2}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.24 }}
      >
        <Textarea
          label="Por que esse lugar entrou?"
          placeholder="o que fez vocês escolherem esse lugar..."
          value={form.why_here}
          onChange={(e) => set("why_here", e.target.value)}
          rows={2}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.28 }}
      >
        <Textarea
          label="Momento que esperamos viver aqui 💛"
          placeholder="o que imaginam sentir, ver ou viver nesse lugar..."
          value={form.expected_moment}
          onChange={(e) => set("expected_moment", e.target.value)}
          rows={2}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 6 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.32 }}
        className="flex gap-3 pt-1"
      >
        {onCancel && (
          <Button type="button" variant="secondary" onClick={onCancel} className="flex-1">
            Cancelar
          </Button>
        )}
        <Button type="submit" variant="primary" loading={loading} className="flex-1">
          {submitLabel}
        </Button>
      </motion.div>
    </form>
  );
}
