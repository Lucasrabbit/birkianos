"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Heart, ChevronDown } from "lucide-react";
import Link from "next/link";
import { Trip } from "@/types";
import TripCard from "@/components/trips/TripCard";
import Button from "@/components/ui/Button";
import PolaroidCollage from "@/components/ui/PolaroidCollage";
import { getTrips, deleteTrip } from "@/lib/supabase";

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .catch(() => setError("Não conseguimos carregar suas viagens. Configure o Supabase."))
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar essa viagem? Não tem volta.")) return;
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-birk-bg">
      {/* ── HERO ── */}
      <section className="paper-bg relative min-h-[88vh] flex flex-col items-center justify-center overflow-hidden px-4 py-16">
        <PolaroidCollage />

        {/* Content — ilha central acima das polaroids */}
        <motion.div
          initial={{ opacity: 0, y: 24 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1, ease: "easeOut" }}
          className="relative z-20 text-center max-w-xl pointer-events-none"
        >
          <motion.p
            initial={{ opacity: 0, letterSpacing: "0.4em" }}
            animate={{ opacity: 1, letterSpacing: "0.3em" }}
            transition={{ delay: 0.2, duration: 0.8 }}
            className="text-birk-muted text-xs font-medium uppercase mb-4 font-sans"
          >
            Lucas & Rox
          </motion.p>

          <motion.h1
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.35, duration: 0.8 }}
            className="font-serif text-birk-text mb-3"
            style={{ fontSize: "clamp(2.75rem, 7vw, 5rem)", lineHeight: 1.05, fontWeight: 700 }}
          >
            Birk&apos;s Trip
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5, duration: 0.8 }}
            className="font-hand text-birk-terra text-3xl sm:text-4xl mb-5"
            style={{ fontWeight: 600 }}
          >
            sempre em rota 💛
          </motion.p>

          <motion.p
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.7, duration: 1 }}
            className="font-serif italic text-birk-text-soft text-base sm:text-lg max-w-md mx-auto"
            style={{ fontWeight: 400 }}
          >
            &ldquo;Algum ritmo em comum fez nos encontrar&rdquo;
          </motion.p>
        </motion.div>

        {/* Scroll indicator */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 1.2 }}
          className="absolute bottom-6 left-1/2 -translate-x-1/2 z-20 flex flex-col items-center gap-1"
        >
          <span className="text-birk-muted text-xs tracking-widest uppercase font-sans">
            nossas viagens
          </span>
          <motion.div
            animate={{ y: [0, 6, 0] }}
            transition={{ repeat: Infinity, duration: 1.8, ease: "easeInOut" }}
          >
            <ChevronDown size={18} className="text-birk-muted" />
          </motion.div>
        </motion.div>
      </section>

      {/* ── TRIPS SECTION ── */}
      <section className="paper-bg min-h-screen">
        <div className="max-w-2xl mx-auto px-4 py-16">

          {/* Section header */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="flex items-end justify-between gap-4 mb-10"
          >
            <div>
              <p className="font-hand text-birk-terra text-lg mb-1" style={{ fontWeight: 600 }}>
                onde já fomos e pra onde vamos
              </p>
              <h2 className="font-serif text-birk-text text-3xl sm:text-4xl" style={{ fontWeight: 700 }}>
                {trips.length > 0 ? "nossas viagens" : "pra onde vamos dessa vez?"}
              </h2>
            </div>
            <Link href="/trips/new" className="flex-shrink-0">
              <Button variant="primary" size="lg">
                <Plus size={18} />
                nova viagem
              </Button>
            </Link>
          </motion.div>

          {/* Loading skeleton */}
          {loading && (
            <div className="space-y-4">
              {[1, 2].map((i) => (
                <div key={i} className="bg-white rounded-3xl h-32 animate-pulse shadow-soft" />
              ))}
            </div>
          )}

          {/* Error */}
          {error && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              className="bg-red-50 border border-red-100 rounded-2xl p-5"
            >
              <p className="font-serif text-red-700 font-semibold text-lg mb-1">Ops!</p>
              <p className="text-red-600 text-sm">{error}</p>
              <p className="text-red-400 text-xs mt-2">
                Configure as variáveis do Supabase no painel da Vercel.
              </p>
            </motion.div>
          )}

          {/* Trips */}
          {!loading && !error && (
            <AnimatePresence>
              {trips.length === 0 ? (
                <motion.div
                  initial={{ opacity: 0, scale: 0.97 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="text-center py-20"
                >
                  <div className="font-hand text-7xl mb-6" style={{ fontWeight: 700 }}>
                    ✈️
                  </div>
                  <h3 className="font-serif text-birk-text text-2xl mb-3" style={{ fontWeight: 600 }}>
                    ainda não tem nenhuma viagem
                  </h3>
                  <p className="text-birk-muted text-sm mb-8 max-w-xs mx-auto font-hand text-lg">
                    cada aventura começa com um primeiro passo 💛
                  </p>
                  <Link href="/trips/new">
                    <Button variant="primary" size="lg">
                      <Plus size={18} />
                      criar primeira viagem
                    </Button>
                  </Link>
                </motion.div>
              ) : (
                <div className="space-y-4">
                  {trips.map((trip, i) => (
                    <TripCard key={trip.id} trip={trip} onDelete={handleDelete} index={i} />
                  ))}
                </div>
              )}
            </AnimatePresence>
          )}
        </div>
      </section>

      {/* ── FOOTER ── */}
      <footer className="paper-bg border-t border-birk-border/40 py-10 text-center">
        <div className="flex items-center justify-center gap-2">
          <Heart size={12} className="text-birk-yellow fill-birk-yellow" />
          <p className="font-hand text-birk-muted text-xl">
            feito com amor pra Lucas & Rox
          </p>
          <Heart size={12} className="text-birk-yellow fill-birk-yellow" />
        </div>
        <p className="font-serif italic text-birk-muted/60 text-xs mt-2">
          Algum ritmo em comum fez nos encontrar
        </p>
      </footer>
    </div>
  );
}
