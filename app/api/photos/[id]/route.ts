import { NextResponse } from "next/server";
import { getPhotoDriveFileId, deletePhotoRecord } from "@/lib/db";
import { deletePhotoFromDrive } from "@/lib/googleDrive";

export const runtime = "nodejs";

export async function DELETE(request: Request, { params }: { params: { id: string } }) {
  try {
    const driveFileId = await getPhotoDriveFileId(params.id);
    if (driveFileId) {
      await deletePhotoFromDrive(driveFileId).catch((err) => {
        console.error("Falha ao apagar do Drive (removendo registro mesmo assim)", err);
      });
    }
    await deletePhotoRecord(params.id);
    return NextResponse.json({ ok: true });
  } catch (error) {
    console.error("DELETE /api/photos/[id]", error);
    return NextResponse.json({ error: "Falha ao apagar foto" }, { status: 500 });
  }
}
