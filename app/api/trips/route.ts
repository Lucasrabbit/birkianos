import { NextResponse } from "next/server";
import { getTrips, createTrip } from "@/lib/db";

export async function GET() {
  try {
    const trips = await getTrips();
    return NextResponse.json(trips);
  } catch (error) {
    console.error("GET /api/trips", error);
    return NextResponse.json({ error: "Falha ao carregar viagens" }, { status: 500 });
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const trip = await createTrip(body);
    return NextResponse.json(trip, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips", error);
    return NextResponse.json({ error: "Falha ao criar viagem" }, { status: 500 });
  }
}
