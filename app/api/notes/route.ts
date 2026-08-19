import { NextResponse } from "next/server";
import { createNote } from "@/lib/db";

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const note = await createNote(body);
    return NextResponse.json(note, { status: 201 });
  } catch (error) {
    console.error("POST /api/notes", error);
    return NextResponse.json({ error: "Falha ao criar nota" }, { status: 500 });
  }
}
