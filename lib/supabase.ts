import { createClient } from "@supabase/supabase-js";
import { Trip, Stop, Note } from "@/types";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!;

export const supabase = createClient(supabaseUrl, supabaseAnonKey);

// --- Trips ---

export async function getTrips(): Promise<Trip[]> {
  const { data, error } = await supabase
    .from("trips")
    .select("*")
    .order("created_at", { ascending: false });
  if (error) throw error;
  return data ?? [];
}

export async function getTripById(id: string): Promise<Trip | null> {
  const { data, error } = await supabase
    .from("trips")
    .select("*, stops(*), notes(*)")
    .eq("id", id)
    .single();
  if (error) throw error;
  if (data?.stops) {
    data.stops = data.stops.sort(
      (a: Stop, b: Stop) => a.position - b.position
    );
  }
  return data;
}

export async function createTrip(
  trip: Omit<Trip, "id" | "created_at" | "updated_at">
): Promise<Trip> {
  const { data, error } = await supabase
    .from("trips")
    .insert([trip])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateTrip(
  id: string,
  trip: Partial<Omit<Trip, "id" | "created_at" | "updated_at">>
): Promise<Trip> {
  const { data, error } = await supabase
    .from("trips")
    .update({ ...trip, updated_at: new Date().toISOString() })
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteTrip(id: string): Promise<void> {
  const { error } = await supabase.from("trips").delete().eq("id", id);
  if (error) throw error;
}

// --- Stops ---

export async function createStop(
  stop: Omit<Stop, "id" | "created_at">
): Promise<Stop> {
  const { data, error } = await supabase
    .from("stops")
    .insert([stop])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateStop(
  id: string,
  stop: Partial<Omit<Stop, "id" | "created_at">>
): Promise<Stop> {
  const { data, error } = await supabase
    .from("stops")
    .update(stop)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteStop(id: string): Promise<void> {
  const { error } = await supabase.from("stops").delete().eq("id", id);
  if (error) throw error;
}

export async function reorderStops(
  stops: Array<{ id: string; position: number }>
): Promise<void> {
  const updates = stops.map(({ id, position }) =>
    supabase.from("stops").update({ position }).eq("id", id)
  );
  await Promise.all(updates);
}

// --- Notes ---

export async function createNote(
  note: Omit<Note, "id" | "created_at">
): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .insert([note])
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function updateNote(
  id: string,
  note: Partial<Omit<Note, "id" | "created_at">>
): Promise<Note> {
  const { data, error } = await supabase
    .from("notes")
    .update(note)
    .eq("id", id)
    .select()
    .single();
  if (error) throw error;
  return data;
}

export async function deleteNote(id: string): Promise<void> {
  const { error } = await supabase.from("notes").delete().eq("id", id);
  if (error) throw error;
}
