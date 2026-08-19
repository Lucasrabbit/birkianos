import { NextResponse } from "next/server";
import { createStop } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const stop = await createStop(body);
    return NextResponse.json(stop, { status: 201 });
  } catch (error) {
    console.error("POST /api/stops", error);
    return NextResponse.json({ error: "Falha ao criar parada" }, { status: 500 });
  }
}
