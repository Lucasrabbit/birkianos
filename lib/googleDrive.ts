import "server-only";
import { google } from "googleapis";
import { Readable } from "stream";

// Photos are uploaded to the trip owner's own Google Drive via OAuth2
// (not a service account) so they count against the owner's real storage.
// The refresh token is minted once (see README) and stored as an env var.
function getDriveClient() {
  const oauth2Client = new google.auth.OAuth2(
    process.env.GOOGLE_CLIENT_ID,
    process.env.GOOGLE_CLIENT_SECRET
  );
  oauth2Client.setCredentials({ refresh_token: process.env.GOOGLE_REFRESH_TOKEN });
  return google.drive({ version: "v3", auth: oauth2Client });
}

export async function uploadPhotoToDrive(
  buffer: Buffer,
  filename: string,
  mimeType: string
): Promise<string> {
  const drive = getDriveClient();
  const folderId = process.env.GOOGLE_DRIVE_FOLDER_ID;
  const res = await drive.files.create({
    requestBody: {
      name: filename,
      parents: folderId ? [folderId] : undefined,
    },
    media: {
      mimeType,
      body: Readable.from(buffer),
    },
    fields: "id",
  });
  if (!res.data.id) throw new Error("Google Drive não retornou um file id");
  return res.data.id;
}

// Files are kept private in Drive — we never rely on Drive's public-link
// sharing. The app fetches bytes server-side with its own credentials and
// streams them to the browser through /api/photos/[id]/raw.
export async function streamPhotoFromDrive(fileId: string) {
  const drive = getDriveClient();
  const res = await drive.files.get(
    { fileId, alt: "media" },
    { responseType: "stream" }
  );
  const contentType = (res.headers["content-type"] as string) ?? "application/octet-stream";
  return { stream: res.data as unknown as Readable, contentType };
}

export async function deletePhotoFromDrive(fileId: string): Promise<void> {
  const drive = getDriveClient();
  await drive.files.delete({ fileId });
}
