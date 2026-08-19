import { NextResponse } from "next/server";
import { reorderStops } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    await reorderStops(body);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("POST /api/stops/reorder", error);
    return NextResponse.json({ error: "Falha ao reordenar paradas" }, { status: 500 });
  }
}
