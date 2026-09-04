-- Birk's Trip — Database Schema (Neon Postgres)
-- Run this once in the Neon SQL Editor (or `psql "$DATABASE_URL" -f db/schema.sql`)

-- Enable UUID generation
CREATE EXTENSION IF NOT EXISTS "pgcrypto";

-- Trips
CREATE TABLE IF NOT EXISTS trips (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  name TEXT NOT NULL,
  origin TEXT NOT NULL,
  origin_lat DECIMAL,
  origin_lng DECIMAL,
  destination TEXT NOT NULL,
  destination_lat DECIMAL,
  destination_lng DECIMAL,
  start_date DATE,
  end_date DATE,
  observations TEXT,
  return_distance_km DECIMAL,
  return_duration_minutes INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Stops
CREATE TABLE IF NOT EXISTS stops (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  name TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('food','technical','accommodation','attraction','bathroom','highlight')),
  position INTEGER NOT NULL DEFAULT 0,
  day INTEGER NOT NULL DEFAULT 1,
  arrival_time TIME,
  duration_minutes INTEGER,
  comment TEXT,
  why_here TEXT,
  expected_moment TEXT,
  address TEXT,
  lat DECIMAL,
  lng DECIMAL,
  distance_from_prev DECIMAL,
  duration_from_prev INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Notes
CREATE TABLE IF NOT EXISTS notes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  content TEXT NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('checklist','reminder','idea')),
  completed BOOLEAN NOT NULL DEFAULT FALSE,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Photos (stored in Google Drive; this table only keeps the pointer + metadata)
CREATE TABLE IF NOT EXISTS photos (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  trip_id UUID NOT NULL REFERENCES trips(id) ON DELETE CASCADE,
  stop_id UUID REFERENCES stops(id) ON DELETE SET NULL,
  drive_file_id TEXT NOT NULL,
  caption TEXT,
  width INTEGER,
  height INTEGER,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Indexes
CREATE INDEX IF NOT EXISTS stops_trip_id_idx ON stops(trip_id);
CREATE INDEX IF NOT EXISTS stops_position_idx ON stops(trip_id, day, position);
CREATE INDEX IF NOT EXISTS notes_trip_id_idx ON notes(trip_id);
CREATE INDEX IF NOT EXISTS photos_trip_id_idx ON photos(trip_id);
CREATE INDEX IF NOT EXISTS photos_stop_id_idx ON photos(stop_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

DROP TRIGGER IF EXISTS trips_updated_at ON trips;
CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
