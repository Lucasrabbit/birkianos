"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, MapPin, Heart } from "lucide-react";
import Link from "next/link";
import { Trip } from "@/types";
import TripCard from "@/components/trips/TripCard";
import Button from "@/components/ui/Button";
import { getTrips, deleteTrip } from "@/lib/supabase";

export default function HomePage() {
  const [trips, setTrips] = useState<Trip[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    getTrips()
      .then(setTrips)
      .catch((e) => {
        console.error(e);
        setError("Não conseguimos carregar suas viagens. Verifique a conexão com o Supabase.");
      })
      .finally(() => setLoading(false));
  }, []);

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar essa viagem? Não tem volta.")) return;
    await deleteTrip(id);
    setTrips((prev) => prev.filter((t) => t.id !== id));
  };

  return (
    <div className="min-h-screen bg-birk-bg">
      <div className="max-w-2xl mx-auto px-4 py-8">
        <motion.header
          initial={{ opacity: 0, y: -16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="mb-10"
        >
          <div className="flex items-center gap-2 mb-2">
            <span className="text-3xl">✈️</span>
            <h1 className="text-2xl font-bold text-birk-text">
              Birk&apos;s Trip
            </h1>
          </div>
          <p className="text-birk-muted text-sm font-medium">
            Lucas & Rox, sempre em rota 💛
          </p>
          <p className="text-birk-muted text-xs mt-1 italic">
            Algum ritmo em comum fez nos encontrar
          </p>
        </motion.header>

        <motion.div
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="mb-6 flex items-center justify-between"
        >
          <div>
            <h2 className="text-lg font-semibold text-birk-text">
              {trips.length > 0
                ? "suas viagens"
                : "pra onde vamos dessa vez?"}
            </h2>
            {trips.length > 0 && (
              <p className="text-birk-muted text-sm mt-0.5">
                {trips.length}{" "}
                {trips.length === 1 ? "viagem planejada" : "viagens planejadas"}
              </p>
            )}
          </div>
          <Link href="/trips/new">
            <Button variant="primary" size="md">
              <Plus size={16} />
              nova viagem
            </Button>
          </Link>
        </motion.div>

        {loading && (
          <div className="space-y-3">
            {[1, 2].map((i) => (
              <div
                key={i}
                className="bg-white rounded-3xl h-28 animate-pulse shadow-soft border border-birk-border/50"
              />
            ))}
          </div>
        )}

        {error && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="bg-red-50 border border-red-200 rounded-2xl p-4 text-red-600 text-sm"
          >
            <p className="font-medium">Ops!</p>
            <p className="mt-1">{error}</p>
            <p className="mt-2 text-xs text-red-400">
              Crie o arquivo .env.local com suas credenciais do Supabase.
            </p>
          </motion.div>
        )}

        {!loading && !error && (
          <AnimatePresence>
            {trips.length === 0 ? (
              <motion.div
                initial={{ opacity: 0, scale: 0.97 }}
                animate={{ opacity: 1, scale: 1 }}
                className="text-center py-16"
              >
                <div className="text-5xl mb-4">🌍</div>
                <h3 className="text-lg font-semibold text-birk-text mb-2">
                  nenhuma viagem ainda
                </h3>
                <p className="text-birk-muted text-sm mb-6 max-w-xs mx-auto">
                  vamos montar nosso caminho? cada viagem começa com um primeiro
                  clique 💛
                </p>
                <Link href="/trips/new">
                  <Button variant="primary" size="lg">
                    <Plus size={18} />
                    criar primeira viagem
                  </Button>
                </Link>
              </motion.div>
            ) : (
              <div className="space-y-3">
                {trips.map((trip, i) => (
                  <TripCard
                    key={trip.id}
                    trip={trip}
                    onDelete={handleDelete}
                    index={i}
                  />
                ))}
              </div>
            )}
          </AnimatePresence>
        )}

        <motion.footer
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="mt-16 text-center"
        >
          <div className="flex items-center justify-center gap-1.5 text-birk-muted text-xs">
            <Heart size={11} className="text-birk-yellow fill-birk-yellow" />
            <span>feito com amor pra Lucas & Rox</span>
            <Heart size={11} className="text-birk-yellow fill-birk-yellow" />
          </div>
        </motion.footer>
      </div>
    </div>
  );
}
