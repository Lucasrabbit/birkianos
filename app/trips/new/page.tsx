"use client";

import { motion } from "framer-motion";
import { ArrowLeft } from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import TripForm from "@/components/trips/TripForm";
import Topbar from "@/components/ui/Topbar";
import { createTrip } from "@/lib/supabase";
import { Trip } from "@/types";

export default function NewTripPage() {
  const router = useRouter();

  const handleSubmit = async (data: Omit<Trip, "id" | "created_at" | "updated_at">) => {
    const trip = await createTrip(data);
    router.push(`/trips/${trip.id}`);
  };

  return (
    <div className="min-h-screen paper-bg">
      <Topbar />

      <div className="max-w-xl mx-auto px-6 py-10">
        <motion.div
          initial={{ opacity: 0, x: -8 }}
          animate={{ opacity: 1, x: 0 }}
          className="mb-8"
        >
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-birk-ink-faint hover:text-birk-ink text-sm transition-colors mb-6"
          >
            <ArrowLeft size={16} />
            <span className="font-mono text-[11px] uppercase tracking-[0.12em]">voltar</span>
          </Link>

          <div className="eyebrow mb-3">novo capítulo</div>

          <h1
            className="font-serif text-birk-ink italic"
            style={{ fontSize: "clamp(1.8rem, 4vw, 2.5rem)", fontWeight: 300, lineHeight: 1.1 }}
          >
            pra onde vamos<br />dessa vez?
          </h1>
          <p className="font-hand text-birk-ink-faint text-xl mt-2">
            vamos montar nosso caminho 💛
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.1 }}
          className="glass-card p-6"
        >
          <TripForm onSubmit={handleSubmit} />
        </motion.div>
      </div>
    </div>
  );
}
