import { NextResponse } from "next/server";
import { getTripById, updateStop, updateTrip } from "@/lib/db";
import { getLeg, hasCoords } from "@/lib/routing";

export const runtime = "nodejs";
export const maxDuration = 60;

type RoutePoint =
  | { kind: "stop"; id: string; lat: number; lng: number }
  | { kind: "origin" | "destination"; lat: number; lng: number };

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const trip = await getTripById(params.id);
    if (!trip) return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });

    // origem → paradas (ordem dia/posição) → destino
    const points: RoutePoint[] = [];

    const origin = { lat: trip.origin_lat, lng: trip.origin_lng };
    if (hasCoords(origin)) points.push({ kind: "origin", lat: origin.lat, lng: origin.lng });

    for (const stop of trip.stops ?? []) {
      if (hasCoords(stop)) {
        points.push({ kind: "stop", id: stop.id, lat: stop.lat, lng: stop.lng });
      }
    }

    const destination = { lat: trip.destination_lat, lng: trip.destination_lng };
    if (hasCoords(destination)) {
      points.push({ kind: "destination", lat: destination.lat, lng: destination.lng });
    }

    if (points.length < 2) {
      return NextResponse.json(
        {
          error:
            "Faltam coordenadas. Escolha origem, destino e paradas pela busca de endereço para o cálculo funcionar.",
        },
        { status: 400 }
      );
    }

    let calculated = 0;
    let failed = 0;

    for (let i = 1; i < points.length; i++) {
      const to = points[i];
      const leg = await getLeg(points[i - 1], to);
      if (!leg) {
        failed++;
        continue;
      }
      calculated++;

      if (to.kind === "stop") {
        await updateStop(to.id, {
          distance_from_prev: leg.distanceKm,
          duration_from_prev: leg.durationMinutes,
        });
      } else if (to.kind === "destination") {
        await updateTrip(trip.id, {
          return_distance_km: leg.distanceKm,
          return_duration_minutes: leg.durationMinutes,
        });
      }
    }

    const updated = await getTripById(params.id);
    return NextResponse.json({ trip: updated, calculated, failed });
  } catch (error) {
    console.error("POST /api/trips/[id]/route-legs", error);
    return NextResponse.json({ error: "Falha ao calcular as rotas" }, { status: 500 });
  }
}
