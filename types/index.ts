export type StopType =
  | "food"
  | "technical"
  | "accommodation"
  | "attraction"
  | "bathroom"
  | "highlight";

export interface Trip {
  id: string;
  name: string;
  origin: string;
  origin_lat?: number;
  origin_lng?: number;
  destination: string;
  destination_lat?: number;
  destination_lng?: number;
  start_date?: string;
  end_date?: string;
  observations?: string;
  created_at: string;
  updated_at: string;
  stops?: Stop[];
  notes?: Note[];
}

export interface Stop {
  id: string;
  trip_id: string;
  name: string;
  type: StopType;
  position: number;
  arrival_time?: string;
  duration_minutes?: number;
  comment?: string;
  why_here?: string;
  expected_moment?: string;
  lat?: number;
  lng?: number;
  address?: string;
  distance_from_prev?: number;
  duration_from_prev?: number;
  created_at: string;
}

export interface Note {
  id: string;
  trip_id: string;
  content: string;
  type: "checklist" | "reminder" | "idea";
  completed: boolean;
  created_at: string;
}

export interface TripSummaryData {
  totalKm: number;
  totalMinutes: number;
  stopsCount: number;
  days: number;
}
