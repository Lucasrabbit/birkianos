"use client";

import { useState } from "react";
import { motion } from "framer-motion";
import { MapPin, Calendar } from "lucide-react";
import { Input, Textarea } from "@/components/ui/Input";
import Button from "@/components/ui/Button";
import { Trip } from "@/types";

interface TripFormProps {
  initial?: Partial<Trip>;
  onSubmit: (data: Omit<Trip, "id" | "created_at" | "updated_at">) => Promise<void>;
  onCancel?: () => void;
  submitLabel?: string;
}

export default function TripForm({
  initial,
  onSubmit,
  onCancel,
  submitLabel = "Criar viagem ✨",
}: TripFormProps) {
  const [form, setForm] = useState({
    name: initial?.name ?? "",
    origin: initial?.origin ?? "",
    destination: initial?.destination ?? "",
    start_date: initial?.start_date ?? "",
    end_date: initial?.end_date ?? "",
    observations: initial?.observations ?? "",
  });
  const [loading, setLoading] = useState(false);
  const [errors, setErrors] = useState<Record<string, string>>({});

  const validate = () => {
    const e: Record<string, string> = {};
    if (!form.name.trim()) e.name = "Dá um nome pra viagem!";
    if (!form.origin.trim()) e.origin = "De onde vocês saem?";
    if (!form.destination.trim()) e.destination = "Pra onde vão?";
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
        name: form.name.trim(),
        origin: form.origin.trim(),
        destination: form.destination.trim(),
        start_date: form.start_date || undefined,
        end_date: form.end_date || undefined,
        observations: form.observations.trim() || undefined,
      });
    } finally {
      setLoading(false);
    }
  };

  const set = (key: string, value: string) => {
    setForm((f) => ({ ...f, [key]: value }));
    if (errors[key]) setErrors((e) => ({ ...e, [key]: "" }));
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-5">
      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.05 }}
      >
        <Input
          label="Nome da viagem"
          placeholder="ex: Fim de semana em Campos do Jordão"
          value={form.name}
          onChange={(e) => set("name", e.target.value)}
          error={errors.name}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.1 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="relative">
          <Input
            label="Saindo de"
            placeholder="ex: São Paulo, SP"
            value={form.origin}
            onChange={(e) => set("origin", e.target.value)}
            error={errors.origin}
          />
          <MapPin size={14} className="absolute right-4 top-9 text-birk-sun" />
        </div>
        <div className="relative">
          <Input
            label="Chegando em"
            placeholder="ex: Campos do Jordão, SP"
            value={form.destination}
            onChange={(e) => set("destination", e.target.value)}
            error={errors.destination}
          />
          <MapPin size={14} className="absolute right-4 top-9 text-birk-leaf" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.15 }}
        className="grid grid-cols-1 sm:grid-cols-2 gap-4"
      >
        <div className="relative">
          <Input
            label="Data de ida"
            type="date"
            value={form.start_date}
            onChange={(e) => set("start_date", e.target.value)}
          />
          <Calendar size={14} className="absolute right-4 top-9 text-birk-ink-faint pointer-events-none" />
        </div>
        <div className="relative">
          <Input
            label="Data de volta"
            type="date"
            value={form.end_date}
            onChange={(e) => set("end_date", e.target.value)}
            min={form.start_date}
          />
          <Calendar size={14} className="absolute right-4 top-9 text-birk-ink-faint pointer-events-none" />
        </div>
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.2 }}
      >
        <Textarea
          label="Observações"
          placeholder="qualquer coisa que precisam lembrar antes de sair..."
          value={form.observations}
          onChange={(e) => set("observations", e.target.value)}
          rows={3}
        />
      </motion.div>

      <motion.div
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.25 }}
        className="flex gap-3 pt-2"
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
