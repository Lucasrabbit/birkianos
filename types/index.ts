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
  // trecho final: última parada → destino ("volta pra casa")
  return_distance_km?: number;
  return_duration_minutes?: number;
  created_at: string;
  updated_at: string;
  stops?: Stop[];
  notes?: Note[];
  photos?: Photo[];
}

export interface Stop {
  id: string;
  trip_id: string;
  name: string;
  type: StopType;
  position: number;
  day: number;
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

export interface Photo {
  id: string;
  trip_id: string;
  stop_id?: string | null;
  caption?: string;
  width?: number;
  height?: number;
  created_at: string;
}

export interface DayWeather {
  kind: "forecast" | "typical";
  date: string;
  tempMax: number | null;
  tempMin: number | null;
  precipitationChance: number | null;
  code: number | null;
  label: string;
  emoji: string;
}

export interface TripSummaryData {
  totalKm: number;
  totalMinutes: number;
  stopsCount: number;
  days: number;
}
