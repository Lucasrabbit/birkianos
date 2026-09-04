import { NextResponse } from "next/server";
import { updateNote, deleteNote } from "@/lib/db";

export async function PATCH(request: Request, { params }: { params: { id: string } }) {
  try {
    const body = await request.json();
    const note = await updateNote(params.id, body);
    return NextResponse.json(note);
  } catch (error) {
    console.error("PATCH /api/notes/[id]", error);
    return NextResponse.json({ error: "Falha ao atualizar nota" }, { status: 500 });
  }
}

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    await deleteNote(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/notes/[id]", error);
    return NextResponse.json({ error: "Falha ao apagar nota" }, { status: 500 });
  }
}
