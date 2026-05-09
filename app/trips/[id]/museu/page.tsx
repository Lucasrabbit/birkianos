"use client";

import { useEffect, useRef, useState } from "react";
import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Trip, Stop } from "@/types";
import { getTripById } from "@/lib/supabase";
import Topbar from "@/components/ui/Topbar";
import MuseuHero from "@/components/museu/MuseuHero";
import EmotionalTimeline from "@/components/museu/EmotionalTimeline";
import LivingGallery from "@/components/museu/LivingGallery";

export default function MuseuPage({ params }: { params: { id: string } }) {
  const { id } = params;
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [loading, setLoading] = useState(true);
  const contoRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    getTripById(id)
      .then((data) => {
        if (data) {
          setTrip(data);
          setStops((data.stops ?? []).sort((a, b) => a.position - b.position));
        }
      })
      .catch(() => {})
      .finally(() => setLoading(false));
  }, [id]);

  const handleScrollDown = () => {
    contoRef.current?.scrollIntoView({ behavior: "smooth", block: "start" });
  };

  if (loading) {
    return (
      <>
        <Topbar />
        <div className="min-h-screen paper-bg flex items-center justify-center">
          <div className="text-center">
            <div className="text-4xl mb-3 animate-pulse">✿</div>
            <p className="font-serif text-birk-ink-faint text-sm italic">abrindo o museu…</p>
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
            <Link
              href="/"
              className="font-mono text-birk-ink-faint text-xs mt-2 block uppercase tracking-[0.1em] hover:text-birk-ink"
            >
              voltar para o início
            </Link>
          </div>
        </div>
      </>
    );
  }

  return (
    <motion.div
      initial={{ opacity: 0 }}
      animate={{ opacity: 1 }}
      transition={{ duration: 0.5 }}
      className="paper-bg min-h-screen"
    >
      <Topbar />

      {/* Back link floating */}
      <div className="max-w-[1240px] mx-auto px-6 md:px-14 pt-6">
        <Link
          href={`/trips/${id}`}
          className="inline-flex items-center gap-2 text-birk-ink-faint hover:text-birk-ink text-sm transition-colors"
        >
          <ArrowLeft size={16} />
          <span className="font-hand text-xl">voltar pra viagem</span>
        </Link>
      </div>

      <MuseuHero trip={trip} stopsCount={stops.length} onScrollDown={handleScrollDown} />

      <div ref={contoRef}>
        <EmotionalTimeline stops={stops} />
      </div>

      <LivingGallery stops={stops} />

      <footer
        className="paper-bg"
        style={{
          paddingTop: 48,
          paddingBottom: 48,
          borderTop: "1px solid #d9c79c",
          textAlign: "center",
        }}
      >
        <p className="font-hand text-birk-terra text-2xl mb-2">
          ♥ feito por nós, pra nós.
        </p>
        <p className="font-mono text-birk-ink-faint text-[10px] tracking-[0.2em] uppercase">
          Birkianos Trips · Museu de Nós
        </p>
      </footer>
    </motion.div>
  );
}
