"use client";

import { useEffect, useState, use } from "react";
import { motion } from "framer-motion";
import { Printer, ArrowLeft } from "lucide-react";
import Link from "next/link";
import { Trip, Stop, Note } from "@/types";
import { getTripById } from "@/lib/supabase";
import PrintLayout from "@/components/print/PrintLayout";
import Button from "@/components/ui/Button";

export default function PrintPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = use(params);
  const [trip, setTrip] = useState<Trip | null>(null);
  const [stops, setStops] = useState<Stop[]>([]);
  const [notes, setNotes] = useState<Note[]>([]);
  const [loading, setLoading] = useState(true);

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

  if (loading) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <div className="text-center">
          <div className="text-4xl mb-2">🖨️</div>
          <p className="text-gray-400 text-sm">preparando para imprimir…</p>
        </div>
      </div>
    );
  }

  if (!trip) {
    return (
      <div className="min-h-screen bg-white flex items-center justify-center">
        <p className="text-gray-400">Viagem não encontrada.</p>
      </div>
    );
  }

  return (
    <div className="bg-white min-h-screen">
      <div className="no-print fixed top-4 left-4 right-4 flex justify-between items-center z-10 bg-white/90 backdrop-blur-sm rounded-2xl px-4 py-2 shadow-card border border-gray-100">
        <Link
          href={`/trips/${id}`}
          className="flex items-center gap-2 text-sm text-gray-500 hover:text-gray-800 transition-colors"
        >
          <ArrowLeft size={14} />
          voltar para a viagem
        </Link>
        <Button
          variant="primary"
          size="sm"
          onClick={() => window.print()}
        >
          <Printer size={14} />
          imprimir
        </Button>
      </div>

      <div className="pt-16 no-print-padding">
        <PrintLayout trip={trip} stops={stops} notes={notes} />
      </div>
    </div>
  );
}
