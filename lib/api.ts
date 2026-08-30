"use client";

import { Trip, Stop, Note, Photo } from "@/types";

async function request<T>(url: string, init?: RequestInit): Promise<T> {
  const res = await fetch(url, {
    ...init,
    headers: init?.body instanceof FormData ? init.headers : { "Content-Type": "application/json", ...init?.headers },
  });
  if (!res.ok) {
    const body = await res.json().catch(() => null);
    throw new Error(body?.error ?? `Erro ${res.status} em ${url}`);
  }
  return res.json();
}

// --- Trips ---

export async function getTrips(): Promise<Trip[]> {
  return request<Trip[]>("/api/trips");
}

export async function getTripById(id: string): Promise<Trip | null> {
  const res = await fetch(`/api/trips/${id}`);
  if (res.status === 404) return null;
  if (!res.ok) throw new Error(`Erro ${res.status} ao carregar viagem`);
  return res.json();
}

export async function createTrip(
  trip: Omit<Trip, "id" | "created_at" | "updated_at">
): Promise<Trip> {
  return request<Trip>("/api/trips", { method: "POST", body: JSON.stringify(trip) });
}

export async function updateTrip(
  id: string,
  trip: Partial<Omit<Trip, "id" | "created_at" | "updated_at">>
): Promise<Trip> {
  return request<Trip>(`/api/trips/${id}`, { method: "PATCH", body: JSON.stringify(trip) });
}

export async function deleteTrip(id: string): Promise<void> {
  await request(`/api/trips/${id}`, { method: "DELETE" });
}

// --- Stops ---

export async function createStop(
  stop: Omit<Stop, "id" | "created_at">
): Promise<Stop> {
  return request<Stop>("/api/stops", { method: "POST", body: JSON.stringify(stop) });
}

export async function updateStop(
  id: string,
  stop: Partial<Omit<Stop, "id" | "created_at">>
): Promise<Stop> {
  return request<Stop>(`/api/stops/${id}`, { method: "PATCH", body: JSON.stringify(stop) });
}

export async function deleteStop(id: string): Promise<void> {
  await request(`/api/stops/${id}`, { method: "DELETE" });
}

export async function reorderStops(
  stops: Array<{ id: string; position: number }>
): Promise<void> {
  await request("/api/stops/reorder", { method: "POST", body: JSON.stringify(stops) });
}

// --- Notes ---

export async function createNote(
  note: Omit<Note, "id" | "created_at">
): Promise<Note> {
  return request<Note>("/api/notes", { method: "POST", body: JSON.stringify(note) });
}

export async function updateNote(
  id: string,
  note: Partial<Omit<Note, "id" | "created_at">>
): Promise<Note> {
  return request<Note>(`/api/notes/${id}`, { method: "PATCH", body: JSON.stringify(note) });
}

export async function deleteNote(id: string): Promise<void> {
  await request(`/api/notes/${id}`, { method: "DELETE" });
}

// --- Photos ---

export async function getTripPhotos(tripId: string): Promise<Photo[]> {
  return request<Photo[]>(`/api/trips/${tripId}/photos`);
}

export async function uploadPhoto(
  tripId: string,
  file: File,
  opts?: { stopId?: string; caption?: string }
): Promise<Photo> {
  const formData = new FormData();
  formData.append("file", file);
  if (opts?.stopId) formData.append("stop_id", opts.stopId);
  if (opts?.caption) formData.append("caption", opts.caption);
  return request<Photo>(`/api/trips/${tripId}/photos`, { method: "POST", body: formData });
}

export async function deletePhoto(id: string): Promise<void> {
  await request(`/api/photos/${id}`, { method: "DELETE" });
}

export function photoUrl(id: string): string {
  return `/api/photos/${id}/raw`;
}

// --- Config ---

export async function getConfig(): Promise<{ photosEnabled: boolean }> {
  return request<{ photosEnabled: boolean }>("/api/config");
}
