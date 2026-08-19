import { Readable } from "stream";
import { getPhotoDriveFileId } from "@/lib/db";
import { streamPhotoFromDrive } from "@/lib/googleDrive";

export const runtime = "nodejs";

export async function GET(request: Request, { params }: { params: { id: string } }) {
  const driveFileId = await getPhotoDriveFileId(params.id);
  if (!driveFileId) {
    return new Response("Foto não encontrada", { status: 404 });
  }
  try {
    const { stream, contentType } = await streamPhotoFromDrive(driveFileId);
    return new Response(Readable.toWeb(stream) as ReadableStream, {
      headers: {
        "Content-Type": contentType,
        "Cache-Control": "private, max-age=86400",
      },
    });
  } catch (error) {
    console.error("GET /api/photos/[id]/raw", error);
    return new Response("Falha ao carregar foto", { status: 500 });
  }
}
