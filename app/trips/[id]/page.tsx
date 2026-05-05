"use client";

import { useEffect, useState, use } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowLeft,
  MapPin,
  ArrowRight,
  Calendar,
  Printer,
  Edit2,
  Check,
  X,
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

type Tab = "roteiro" | "mapa" | "timeline" | "notas";

const TABS: { id: Tab; label: string; emoji: string }[] = [
  { id: "roteiro", label: "Roteiro", emoji: "🗺️" },
  { id: "mapa", label: "Mapa", emoji: "📍" },
  { id: "timeline", label: "Timeline", emoji: "🗓️" },
  { id: "notas", label: "Notas", emoji: "📝" },
];

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
  const [tab, setTab] = useState<Tab>("roteiro");
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
    totalMinutes: stops.reduce((a, s) => a + (s.duration_minutes ?? 0) + (s.duration_from_prev ?? 0), 0),
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
          <Link href="/" className="text-birk-muted text-sm mt-2 block hover:text-birk-text">
            voltar para o início
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-birk-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, y: -8 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center justify-between mb-6"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-birk-muted hover:text-birk-text text-sm transition-colors"
          >
            <ArrowLeft size={16} />
            viagens
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
          transition={{ delay: 0.05 }}
          className="bg-white rounded-3xl shadow-card border border-birk-border/50 p-6 mb-5"
        >
          <div className="flex items-start justify-between gap-3 mb-4">
            <div className="min-w-0">
              <h1 className="text-2xl font-bold text-birk-text leading-tight">
                {trip.name}
              </h1>
              {(trip.start_date || trip.end_date) && (
                <div className="flex items-center gap-1.5 text-birk-muted text-sm mt-1">
                  <Calendar size={13} />
                  <span>
                    {trip.start_date ? formatDate(trip.start_date) : ""}
                    {trip.start_date && trip.end_date ? " → " : ""}
                    {trip.end_date ? formatDate(trip.end_date) : ""}
                  </span>
                  {days > 1 && (
                    <span className="px-2 py-0.5 rounded-lg bg-birk-yellow-soft text-xs font-medium text-birk-text">
                      {days} dias
                    </span>
                  )}
                </div>
              )}
            </div>
            <div className="text-3xl flex-shrink-0">✈️</div>
          </div>

          <div className="flex items-center gap-2 flex-wrap">
            <div className="flex items-center gap-1.5 text-sm font-medium text-birk-text">
              <div className="w-6 h-6 rounded-lg bg-birk-yellow-soft flex items-center justify-center">
                <MapPin size={12} className="text-birk-yellow" />
              </div>
              {trip.origin}
            </div>
            <ArrowRight size={14} className="text-birk-muted" />
            <div className="flex items-center gap-1.5 text-sm font-medium text-birk-text">
              <div className="w-6 h-6 rounded-lg bg-green-50 flex items-center justify-center">
                <MapPin size={12} className="text-birk-green" />
              </div>
              {trip.destination}
            </div>
          </div>

          {trip.observations && (
            <p className="text-sm text-birk-muted mt-3 pt-3 border-t border-birk-border">
              {trip.observations}
            </p>
          )}
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-5"
        >
          <TripSummary data={summaryData} />
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.15 }}
          className="bg-white rounded-3xl shadow-card border border-birk-border/50 overflow-hidden"
        >
          <div className="flex border-b border-birk-border overflow-x-auto">
            {TABS.map((t) => (
              <button
                key={t.id}
                onClick={() => setTab(t.id)}
                className={cn(
                  "flex items-center gap-2 px-5 py-3.5 text-sm font-medium whitespace-nowrap transition-all flex-1 justify-center cursor-pointer",
                  tab === t.id
                    ? "text-birk-text border-b-2 border-birk-yellow -mb-px bg-birk-yellow-soft/30"
                    : "text-birk-muted hover:text-birk-text hover:bg-birk-bg"
                )}
              >
                <span>{t.emoji}</span>
                <span className="hidden sm:inline">{t.label}</span>
              </button>
            ))}
          </div>

          <div className="p-5">
            <AnimatePresence mode="wait">
              <motion.div
                key={tab}
                initial={{ opacity: 0, y: 8 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -8 }}
                transition={{ duration: 0.2 }}
              >
                {tab === "roteiro" && (
                  <StopList
                    trip={trip}
                    stops={stops}
                    onStopsChange={setStops}
                  />
                )}
                {tab === "mapa" && <TripMap trip={trip} stops={stops} />}
                {tab === "timeline" && (
                  <Timeline trip={trip} stops={stops} />
                )}
                {tab === "notas" && (
                  <Notes
                    trip={trip}
                    notes={notes}
                    onNotesChange={setNotes}
                  />
                )}
              </motion.div>
            </AnimatePresence>
          </div>
        </motion.div>
      </div>

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
    </div>
  );
}
