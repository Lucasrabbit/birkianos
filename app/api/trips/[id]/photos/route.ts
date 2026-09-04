import { NextResponse } from "next/server";
import { getPhotosByTrip, createPhotoRecord } from "@/lib/db";
import { uploadPhotoToDrive } from "@/lib/googleDrive";

export const runtime = "nodejs";

const MAX_FILE_SIZE = 15 * 1024 * 1024; // 15MB
const ALLOWED_TYPES = ["image/jpeg", "image/png", "image/webp", "image/heic", "image/gif"];

export async function GET(request: Request, { params }: { params: { id: string } }) {
  try {
    const photos = await getPhotosByTrip(params.id);
    return NextResponse.json(photos);
  } catch (error) {
    console.error("GET /api/trips/[id]/photos", error);
    return NextResponse.json({ error: "Falha ao carregar fotos" }, { status: 500 });
  }
}

export async function POST(request: Request, { params }: { params: { id: string } }) {
  try {
    const formData = await request.formData();
    const file = formData.get("file");
    if (!(file instanceof File)) {
      return NextResponse.json({ error: "Nenhum arquivo enviado" }, { status: 400 });
    }
    if (file.size > MAX_FILE_SIZE) {
      return NextResponse.json({ error: "Arquivo muito grande (máx. 15MB)" }, { status: 400 });
    }
    if (!ALLOWED_TYPES.includes(file.type)) {
      return NextResponse.json({ error: "Tipo de arquivo não suportado" }, { status: 400 });
    }

    const stopId = formData.get("stop_id");
    const caption = formData.get("caption");

    const buffer = Buffer.from(await file.arrayBuffer());
    const driveFileId = await uploadPhotoToDrive(buffer, file.name || "foto.jpg", file.type);

    const photo = await createPhotoRecord({
      trip_id: params.id,
      stop_id: typeof stopId === "string" && stopId ? stopId : null,
      drive_file_id: driveFileId,
      caption: typeof caption === "string" && caption ? caption : null,
    });

    return NextResponse.json(photo, { status: 201 });
  } catch (error) {
    console.error("POST /api/trips/[id]/photos", error);
    return NextResponse.json({ error: "Falha ao enviar foto" }, { status: 500 });
  }
}
