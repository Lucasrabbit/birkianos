-- Birk's Trip — Database Schema
-- Run this in your Supabase SQL editor

-- Enable UUID extension
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

-- Indexes
CREATE INDEX IF NOT EXISTS stops_trip_id_idx ON stops(trip_id);
CREATE INDEX IF NOT EXISTS stops_position_idx ON stops(trip_id, position);
CREATE INDEX IF NOT EXISTS notes_trip_id_idx ON notes(trip_id);

-- Auto-update updated_at
CREATE OR REPLACE FUNCTION update_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER trips_updated_at
  BEFORE UPDATE ON trips
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

-- Row Level Security (optional - enable if you add auth)
-- ALTER TABLE trips ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE stops ENABLE ROW LEVEL SECURITY;
-- ALTER TABLE notes ENABLE ROW LEVEL SECURITY;
