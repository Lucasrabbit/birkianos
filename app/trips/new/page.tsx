"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TripForm from "@/components/trips/TripForm";
import { createTrip } from "@/lib/supabase";
import { Trip } from "@/types";

export default function NewTripPage() {
  const router = useRouter();

  const handleSubmit = async (
    data: Omit<Trip, "id" | "created_at" | "updated_at">
  ) => {
    const trip = await createTrip(data);
    router.push(`/trips/${trip.id}`);
  };

  return (
    <div className="min-h-screen bg-birk-bg">
      <div className="max-w-xl mx-auto px-4 py-8">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-birk-muted hover:text-birk-text text-sm transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            voltar
          </Link>

          <div className="flex items-center gap-3 mb-1">
            <span className="text-3xl">✈️</span>
            <h1 className="text-2xl font-bold text-birk-text">
              nova viagem
            </h1>
          </div>
          <p className="text-birk-muted text-sm">
            vamos montar nosso caminho 💛
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="bg-white rounded-3xl shadow-card p-6 border border-birk-border/50"
        >
          <TripForm onSubmit={handleSubmit} />
        </motion.div>
      </div>
    </div>
  );
}
