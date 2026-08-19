import "server-only";
import { neon } from "@neondatabase/serverless";
import { Trip, Stop, Note, Photo } from "@/types";

const databaseUrl = process.env.DATABASE_URL ?? "postgresql://user:pass@localhost/db";
const sql = neon(databaseUrl);

function buildSet(allowed: readonly string[], data: Record<string, unknown>) {
  const fields = Object.keys(data).filter((k) => allowed.includes(k));
  const setClause = fields.map((f, i) => `${f} = $${i + 1}`).join(", ");
  const values = fields.map((f) => data[f] ?? null);
  return { setClause, values, hasFields: fields.length > 0 };
}

// --- Trips ---

export async function getTrips(): Promise<Trip[]> {
  const rows = await sql`SELECT * FROM trips ORDER BY created_at DESC`;
  return rows as unknown as Trip[];
}

export async function getTripById(id: string): Promise<Trip | null> {
  const trips = await sql`SELECT * FROM trips WHERE id = ${id}`;
  const trip = trips[0] as Trip | undefined;
  if (!trip) return null;

  const [stops, notes, photos] = await Promise.all([
    sql`SELECT * FROM stops WHERE trip_id = ${id} ORDER BY position ASC`,
    sql`SELECT * FROM notes WHERE trip_id = ${id} ORDER BY created_at ASC`,
    sql`SELECT id, trip_id, stop_id, caption, width, height, created_at FROM photos WHERE trip_id = ${id} ORDER BY created_at DESC`,
  ]);

  trip.stops = stops as unknown as Stop[];
  trip.notes = notes as unknown as Note[];
  trip.photos = photos as unknown as Photo[];
  return trip;
}

export async function createTrip(
  trip: Omit<Trip, "id" | "created_at" | "updated_at">
): Promise<Trip> {
  const rows = await sql`
    INSERT INTO trips (
      name, origin, origin_lat, origin_lng,
      destination, destination_lat, destination_lng,
      start_date, end_date, observations
    ) VALUES (
      ${trip.name}, ${trip.origin}, ${trip.origin_lat ?? null}, ${trip.origin_lng ?? null},
      ${trip.destination}, ${trip.destination_lat ?? null}, ${trip.destination_lng ?? null},
      ${trip.start_date ?? null}, ${trip.end_date ?? null}, ${trip.observations ?? null}
    )
    RETURNING *
  `;
  return rows[0] as unknown as Trip;
}

const TRIP_FIELDS = [
  "name",
  "origin",
  "origin_lat",
  "origin_lng",
  "destination",
  "destination_lat",
  "destination_lng",
  "start_date",
  "end_date",
  "observations",
] as const;

export async function updateTrip(
  id: string,
  trip: Partial<Omit<Trip, "id" | "created_at" | "updated_at">>
): Promise<Trip> {
  const { setClause, values, hasFields } = buildSet(TRIP_FIELDS, trip);
  if (!hasFields) {
    const rows = await sql`SELECT * FROM trips WHERE id = ${id}`;
    return rows[0] as unknown as Trip;
  }
  const rows = await sql.query(
    `UPDATE trips SET ${setClause}, updated_at = NOW() WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  );
  return rows[0] as unknown as Trip;
}

export async function deleteTrip(id: string): Promise<void> {
  await sql`DELETE FROM trips WHERE id = ${id}`;
}

// --- Stops ---

export async function createStop(
  stop: Omit<Stop, "id" | "created_at">
): Promise<Stop> {
  const rows = await sql`
    INSERT INTO stops (
      trip_id, name, type, position, arrival_time, duration_minutes,
      comment, why_here, expected_moment, address, lat, lng,
      distance_from_prev, duration_from_prev
    ) VALUES (
      ${stop.trip_id}, ${stop.name}, ${stop.type}, ${stop.position},
      ${stop.arrival_time ?? null}, ${stop.duration_minutes ?? null},
      ${stop.comment ?? null}, ${stop.why_here ?? null}, ${stop.expected_moment ?? null},
      ${stop.address ?? null}, ${stop.lat ?? null}, ${stop.lng ?? null},
      ${stop.distance_from_prev ?? null}, ${stop.duration_from_prev ?? null}
    )
    RETURNING *
  `;
  return rows[0] as unknown as Stop;
}

const STOP_FIELDS = [
  "name",
  "type",
  "position",
  "arrival_time",
  "duration_minutes",
  "comment",
  "why_here",
  "expected_moment",
  "address",
  "lat",
  "lng",
  "distance_from_prev",
  "duration_from_prev",
] as const;

export async function updateStop(
  id: string,
  stop: Partial<Omit<Stop, "id" | "created_at">>
): Promise<Stop> {
  const { setClause, values, hasFields } = buildSet(STOP_FIELDS, stop);
  if (!hasFields) {
    const rows = await sql`SELECT * FROM stops WHERE id = ${id}`;
    return rows[0] as unknown as Stop;
  }
  const rows = await sql.query(
    `UPDATE stops SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  );
  return rows[0] as unknown as Stop;
}

export async function deleteStop(id: string): Promise<void> {
  await sql`DELETE FROM stops WHERE id = ${id}`;
}

export async function reorderStops(
  stops: Array<{ id: string; position: number }>
): Promise<void> {
  await Promise.all(
    stops.map(({ id, position }) => sql`UPDATE stops SET position = ${position} WHERE id = ${id}`)
  );
}

// --- Notes ---

export async function createNote(
  note: Omit<Note, "id" | "created_at">
): Promise<Note> {
  const rows = await sql`
    INSERT INTO notes (trip_id, content, type, completed)
    VALUES (${note.trip_id}, ${note.content}, ${note.type}, ${note.completed})
    RETURNING *
  `;
  return rows[0] as unknown as Note;
}

const NOTE_FIELDS = ["content", "type", "completed"] as const;

export async function updateNote(
  id: string,
  note: Partial<Omit<Note, "id" | "created_at">>
): Promise<Note> {
  const { setClause, values, hasFields } = buildSet(NOTE_FIELDS, note);
  if (!hasFields) {
    const rows = await sql`SELECT * FROM notes WHERE id = ${id}`;
    return rows[0] as unknown as Note;
  }
  const rows = await sql.query(
    `UPDATE notes SET ${setClause} WHERE id = $${values.length + 1} RETURNING *`,
    [...values, id]
  );
  return rows[0] as unknown as Note;
}

export async function deleteNote(id: string): Promise<void> {
  await sql`DELETE FROM notes WHERE id = ${id}`;
}

// --- Photos ---
// Only drive_file_id is kept server-side; it's never returned to the client.
// Clients read photo bytes through /api/photos/[id]/raw.

export async function getPhotosByTrip(tripId: string): Promise<Photo[]> {
  const rows = await sql`
    SELECT id, trip_id, stop_id, caption, width, height, created_at
    FROM photos WHERE trip_id = ${tripId} ORDER BY created_at DESC
  `;
  return rows as unknown as Photo[];
}

export async function createPhotoRecord(data: {
  trip_id: string;
  stop_id?: string | null;
  drive_file_id: string;
  caption?: string | null;
  width?: number | null;
  height?: number | null;
}): Promise<Photo> {
  const rows = await sql`
    INSERT INTO photos (trip_id, stop_id, drive_file_id, caption, width, height)
    VALUES (
      ${data.trip_id}, ${data.stop_id ?? null}, ${data.drive_file_id},
      ${data.caption ?? null}, ${data.width ?? null}, ${data.height ?? null}
    )
    RETURNING id, trip_id, stop_id, caption, width, height, created_at
  `;
  return rows[0] as unknown as Photo;
}

export async function getPhotoDriveFileId(id: string): Promise<string | null> {
  const rows = await sql`SELECT drive_file_id FROM photos WHERE id = ${id}`;
  const row = rows[0] as { drive_file_id: string } | undefined;
  return row?.drive_file_id ?? null;
}

export async function deletePhotoRecord(id: string): Promise<void> {
  await sql`DELETE FROM photos WHERE id = ${id}`;
}
