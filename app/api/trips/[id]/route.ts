import { NextResponse } from "next/server";
import { getTripById, updateTrip, deleteTrip } from "@/lib/db";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const trip = await getTripById(params.id);
    if (!trip) return NextResponse.json({ error: "Viagem não encontrada" }, { status: 404 });
    return NextResponse.json(trip);
  } catch (error) {
    console.error("GET /api/trips/[id]", error);
    return NextResponse.json({ error: "Falha ao carregar viagem" }, { status: 500 });
  }
}

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const trip = await updateTrip(params.id, body);
    return NextResponse.json(trip);
  } catch (error) {
    console.error("PATCH /api/trips/[id]", error);
    return NextResponse.json({ error: "Falha ao atualizar viagem" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteTrip(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/trips/[id]", error);
    return NextResponse.json({ error: "Falha ao apagar viagem" }, { status: 500 });
  }
}
