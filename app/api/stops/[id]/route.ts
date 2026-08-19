import { NextResponse } from "next/server";
import { updateStop, deleteStop } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const stop = await updateStop(params.id, body);
    return NextResponse.json(stop);
  } catch (error) {
    console.error("PATCH /api/stops/[id]", error);
    return NextResponse.json({ error: "Falha ao atualizar parada" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteStop(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/stops/[id]", error);
    return NextResponse.json({ error: "Falha ao apagar parada" }, { status: 500 });
  }
}
