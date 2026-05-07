"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { ArrowLeft, MapPin, ArrowRight, Printer, Edit2 } from "lucide-react";
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
import Topbar from "@/components/ui/Topbar";
import { formatDate, tripDays } from "@/lib/utils";
import { cn } from "@/lib/utils";

const TripMap = dynamic(() => import("@/components/map/TripMap"), {
  ssr: false,
  loading: () => (
    <div
      className="w-full h-96 bg-birk-paper-deep flex items-center justify-center"
      style={{ borderRadius: "4px" }}
    >
      <div className="text-center">
        <div className="text-3xl mb-2">🗺️</div>
        <p className="font-serif text-birk-ink-faint text-sm italic">carregando mapa…</p>
      </div>
    </div>
  ),
});

type LeftTab = "roteiro" | "timeline";

export default function TripPage({ params }: { params: Promise<{ id: string }> }) {
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
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleEditTrip = async (data: Omit<Trip, "id" | "created_at" | "updated_at">) => {
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
      <>
        <Topbar />
        <div className="min-h-screen paper-bg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-bounce">✈️</div>
            <p className="font-serif text-birk-ink-faint text-sm italic">carregando viagem…</p>
          </div>
        </div>
      </>
    );
  }

  if (!trip) {
    return (
      <>
        <Topbar />
        <div className="min-h-screen paper-bg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3">😕</div>
            <p className="font-serif text-birk-ink italic">Viagem não encontrada</p>
            <Link href="/" className="font-mono text-birk-ink-faint text-xs mt-2 block uppercase tracking-[0.1em] hover:text-birk-ink">
              voltar para o início
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.5, ease: "easeOut" }}
      className="min-h-screen paper-bg"
    >
      <Topbar />

      {/* ── HEADER DA VIAGEM ── */}
      <section className="relative overflow-hidden">
        <div className="relative z-10 max-w-[1240px] mx-auto px-6 md:px-14 pt-10 pb-6">
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            className="flex items-center justify-between mb-8"
          >
            <Link
              href="/"
              className="inline-flex items-center gap-2 text-birk-ink-faint hover:text-birk-ink text-sm transition-colors"
            >
              <ArrowLeft size={16} />
              <span className="font-hand text-xl">viagens</span>
            </Link>
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" onClick={() => setEditOpen(true)}>
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
            className="max-w-3xl"
          >
            {(trip.start_date || trip.end_date) && (
              <p className="font-mono text-birk-terra text-[11px] tracking-[0.2em] uppercase mb-3">
                {trip.start_date ? formatDate(trip.start_date) : ""}
                {trip.start_date && trip.end_date ? " — " : ""}
                {trip.end_date ? formatDate(trip.end_date) : ""}
                {days > 1 && <span className="text-birk-ink-faint"> · {days} dias</span>}
              </p>
            )}

            <div className="eyebrow mb-2">diário de viagem</div>

            <h1
              className="font-serif text-birk-ink italic"
              style={{
                fontSize: "clamp(2rem, 5vw, 3.5rem)",
                fontWeight: 300,
                lineHeight: 1.05,
                letterSpacing: "-0.02em",
                marginBottom: 20,
              }}
            >
              {trip.name}
            </h1>

            <div className="flex items-center gap-3 flex-wrap font-hand text-2xl text-birk-ink-soft">
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-flex w-7 h-7 rounded-full bg-birk-sun-pale items-center justify-center"
                  style={{ border: "1px solid #d9c79c" }}
                >
                  <MapPin size={14} className="text-birk-terra" />
                </span>
                {trip.origin}
              </span>
              <ArrowRight size={18} className="text-birk-ink-faint" />
              <span className="inline-flex items-center gap-1.5">
                <span
                  className="inline-flex w-7 h-7 rounded-full items-center justify-center"
                  style={{ background: "rgba(90,107,58,0.12)", border: "1px solid rgba(90,107,58,0.2)" }}
                >
                  <MapPin size={14} className="text-birk-leaf" />
                </span>
                {trip.destination}
              </span>
            </div>

            {trip.observations && (
              <p className="font-serif italic text-birk-ink-faint text-base mt-5 max-w-xl">
                &ldquo;{trip.observations}&rdquo;
              </p>
            )}
          </motion.div>
        </div>
      </section>

      {/* ── RESUMO ── */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-14 mt-2 mb-8">
        <motion.div
          initial={{ opacity: 0, y: 12 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.25, duration: 0.5 }}
        >
          <TripSummary data={summaryData} />
        </motion.div>
      </section>

      {/* ── DIVISOR: o roteiro ── */}
      <div className="section-head max-w-[1240px] mx-auto px-6 md:px-14" style={{ marginTop: 48, marginBottom: 32 }}>
        <h2>
          <span className="num">02 / roteiro</span>
          <em>o caminho que traçamos.</em>
        </h2>
        <span className="aside">arraste pra reordenar ✿</span>
      </div>

      {/* ── DUAS COLUNAS: roteiro + mapa ── */}
      <section className="max-w-[1240px] mx-auto px-6 md:px-14 pb-10">
        <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
          {/* ESQUERDA — Roteiro / Timeline */}
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
                      "flex items-center gap-2 px-4 py-2 rounded-full font-mono text-[11px] uppercase tracking-[0.1em] transition-all cursor-pointer",
                      leftTab === t.id
                        ? "bg-birk-sun-pale text-birk-ink border border-birk-sun/50"
                        : "bg-transparent text-birk-ink-faint hover:text-birk-ink hover:bg-birk-paper/60 border border-transparent"
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
                    <StopList trip={trip} stops={stops} onStopsChange={setStops} />
                  )}
                  {leftTab === "timeline" && (
                    <Timeline trip={trip} stops={stops} />
                  )}
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* DIREITA — mapa sticky */}
          <div className="lg:col-span-2 min-w-0">
            <div className="lg:sticky lg:top-[80px] space-y-4">
              <motion.div
                initial={{ opacity: 0, y: 12 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ duration: 0.5 }}
                className="glass-card overflow-hidden"
              >
                <div className="px-4 pt-3 pb-2 flex items-center gap-2">
                  <span className="text-base">📍</span>
                  <span className="font-hand text-2xl text-birk-ink" style={{ fontWeight: 600 }}>
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

      {/* ── DIVISOR: anotações ── */}
      <div className="section-head max-w-[1240px] mx-auto px-6 md:px-14" style={{ marginTop: 48, marginBottom: 32 }}>
        <h2>
          <span className="num">03 / anotações</span>
          <em>o que não pode esquecer.</em>
        </h2>
        <span className="aside">📝</span>
      </div>

      {/* ── NOTAS ── */}
      <section className="relative max-w-[1240px] mx-auto px-6 md:px-14 pb-24">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <Notes trip={trip} notes={notes} onNotesChange={setNotes} />
        </motion.div>
      </section>

      <Modal open={editOpen} onClose={() => setEditOpen(false)} title="Editar viagem" size="lg">
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
