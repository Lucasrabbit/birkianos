"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  ArrowRight,
  Printer,
  Edit2,
} from "lucide-react";
import Link from "next/link";
import dynamic from "next/dynamic";
import { Trip, Stop, Note } from "@/types";
import { getTripById, updateTrip } from "@/lib/supabase";
import TripSummary from "@/components/trips/TripSummary";
import StopList from "@/components/stops/StopList";
import Timeline from "@/components/timeline/Timeline";
import Notes from "@/components/notes/Notes";
import TripForm from "@/components/trips/TripForm";
import Modal from "@/components/ui/Modal";
import Button from "@/components/ui/Button";
import FloralCorner from "@/components/ui/FloralCorner";
import { formatDate, tripDays } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TripMap = dynamic(() => import("@/components/map/TripMap"), {
  ssr: false,
  loading: () => (
    <div className="w-full h-96 rounded-2xl bg-birk-bg flex items-center justify-center">
      <div className="text-center">
        <div className="text-3xl mb-2">🗺️</div>
        <p className="text-birk-muted text-sm">carregando mapa…</p>
      </div>
    </div>
  ),
});

type LeftTab = "roteiro" | "timeline";

export default function TripPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);
  const [leftTab, setLeftTab] = useState<LeftTab>("roteiro");
  const [editOpen, setEditOpen] = useState(false);

  useEffect(() => {
    getTripById(id)
      .then((data) => {
        if (data) {
          setTrip(data);
          setStops(data.stops ?? []);
          setNotes(data.notes ?? []);
        }
      })
      .finally(() => setLoading(false));
  }, [id]);

  const handleEditTrip = async (
    data: Omit<Trip, "id" | "created_at" | "updated_at">
  ) => {
    if (!trip) return;
    const updated = await updateTrip(trip.id, data);
    setTrip(updated);
    setEditOpen(false);
  };

  const days = trip ? tripDays(trip.start_date, trip.end_date) : 1;

  const summaryData = {
    totalKm: stops.reduce((a, s) => a + (s.distance_from_prev ?? 0), 0),
    totalMinutes: stops.reduce(
      (a, s) => a + (s.duration_minutes ?? 0) + (s.duration_from_prev ?? 0),
      0
    ),
    stopsCount: stops.length,
    days,
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-birk-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3 animate-bounce">✈️</div>
          <p className="text-birk-muted text-sm">carregando viagem…</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-birk-bg flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-3">😕</div>
          <p className="text-birk-text font-medium">Viagem não encontrada</p>
          <Link
            href="/"
            className="text-birk-muted text-sm mt-2 block hover:text-birk-text"
          >
            voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen paper-bg"
    >
      {/* ── HEADER ── */}
      <section className="relative overflow-hidden">
        <FloralCorner corner="top-left" density="medium" baseOpacity={0.45} />
        <FloralCorner corner="top-right" density="light" baseOpacity={0.4} />

        <div className="relative z-10 max-w-6xl mx-auto px-4 pt-8 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-birk-muted hover:text-birk-text text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="font-hand text-lg">viagens</span>
            </Link>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setEditOpen(true)}
              >
                <Edit2 size={14} />
                editar
              </Button>
              <Link href={`/trips/${id}/print`} target="_blank">
                <Button variant="secondary" size="sm">
                  <Printer size={14} />
                  imprimir
                </Button>
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.6 }}
            className="text-center max-w-3xl mx-auto"
          >
            {(trip.start_date || trip.end_date) && (
              <p
                className="font-hand text-birk-terra text-2xl mb-2"
                style={{ fontWeight: 600 }}
              >
                {trip.start_date ? formatDate(trip.start_date) : ""}
                {trip.start_date && trip.end_date ? " — " : ""}
                {trip.end_date ? formatDate(trip.end_date) : ""}
                {days > 1 && (
                  <span className="text-birk-muted"> · {days} dias</span>
                )}
              </p>
            )}

            <h1
              className="font-serif text-birk-text leading-tight mb-4"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 700,
              }}
            >
              {trip.name}
            </h1>

            <div className="flex items-center justify-center gap-3 flex-wrap font-hand text-2xl text-birk-text-soft">
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex w-7 h-7 rounded-full bg-birk-yellow-soft items-center justify-center">
                  <MapPin size={14} className="text-birk-terra" />
                </span>
                {trip.origin}
              </span>
              <ArrowRight size={18} className="text-birk-muted" />
              <span className="inline-flex items-center gap-1.5">
                <span className="inline-flex w-7 h-7 rounded-full bg-birk-green/15 items-center justify-center">
                  <MapPin size={14} className="text-birk-green" />
                </span>
                {trip.destination}
              </span>
            </div>

            {trip.observations && (
              <p className="font-serif italic text-birk-muted text-base mt-5 max-w-xl mx-auto">
                &ldquo;{trip.observations}&rdquo;
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── SUMMARY ── */}
      <section className="max-w-6xl mx-auto px-4 mt-2 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <TripSummary data={summaryData} />
        </motion.div>
      </section>

      {/* ── DIVIDER WITH FLOWERS ── */}
      <div className="relative max-w-6xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-birk-border" />
          <span className="font-hand text-birk-terra text-xl" style={{ fontWeight: 600 }}>
            o roteiro 🌻
          </span>
          <div className="flex-1 h-px bg-birk-border" />
        </div>
      </div>

      {/* ── TWO-COLUMN: roteiro + mini-map ── */}
      <section className="max-w-6xl mx-auto px-4 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* LEFT — Roteiro / Timeline */}
          <div className="lg:col-span-3 min-w-0">
            <div className="glass-card p-5 mb-4">
              <div className="flex gap-2 mb-4">
                {([
                  { id: "roteiro" as LeftTab, label: "Roteiro", emoji: "🗺️" },
                  { id: "timeline" as LeftTab, label: "Timeline", emoji: "🗓️" },
                ]).map((t) => (
                  <button
                    key={t.id}
                    onClick={() => setLeftTab(t.id)}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-2xl text-sm font-medium transition-all cursor-pointer",
                      leftTab === t.id
                        ? "bg-birk-yellow-soft text-birk-text border border-birk-yellow/50"
                        : "bg-transparent text-birk-muted hover:text-birk-text hover:bg-birk-bg/60 border border-transparent"
                    )}
                  >
                    <span>{t.emoji}</span>
                    <span>{t.label}</span>
                  </button>
                ))}
              </div>

              <AnimatePresence mode="wait">
                <motion.div
                  key={leftTab}
                  initial={{ opacity: 0, y: 8 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -8 }}
                  transition={{ duration: 0.25 }}
                >
                  {leftTab === "roteiro" && (
                    <StopList
                      trip={trip}
                      stops={stops}
                      onStopsChange={setStops}
                    />
                  )}
                  {leftTab === "timeline" && (
                    <Timeline trip={trip} stops={stops} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* RIGHT — sticky mini-map */}
          <div className="lg:col-span-2 min-w-0">
            <div className="lg:sticky lg:top-6 space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-card overflow-hidden"
              >
                <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <span
                    className="font-hand text-xl text-birk-text"
                    style={{ fontWeight: 600 }}
                  >
                    o caminho
                  </span>
                </div>
                <div className="p-2">
                  <TripMap trip={trip} stops={stops} />
                </div>
              </motion.div>
            </div>
          </div>
        </div>
      </section>

      {/* ── DIVIDER ── */}
      <div className="relative max-w-6xl mx-auto px-4 mb-6">
        <div className="flex items-center gap-4">
          <div className="flex-1 h-px bg-birk-border" />
          <span
            className="font-hand text-birk-terra text-xl"
            style={{ fontWeight: 600 }}
          >
            anotações 📝
          </span>
          <div className="flex-1 h-px bg-birk-border" />
        </div>
      </div>

      {/* ── NOTES ── */}
      <section className="relative max-w-6xl mx-auto px-4 pb-16">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Notes trip={trip} notes={notes} onNotesChange={setNotes} />
        </motion.div>
      </section>

      <Modal
        open={editOpen}
        onClose={() => setEditOpen(false)}
        title="Editar viagem"
        size="lg"
      >
        <TripForm
          initial={trip}
          onSubmit={handleEditTrip}
          onCancel={() => setEditOpen(false)}
          submitLabel="Salvar alterações"
        />
      </Modal>
    </motion.div>
  );
}
