"use client";

import { useEffect, useRef, useState } from "react";

export interface NominatimResult {
  place_id: number;
  display_name: string;
  lat: string;
  lon: string;
  type: string;
  address?: {
    city?: string;
    town?: string;
    village?: string;
    municipality?: string;
    state?: string;
    country?: string;
    road?: string;
    house_number?: string;
  };
}

export interface SimplifiedPlace {
  id: number;
  fullName: string;
  shortName: string;
  context: string;
  lat: number;
  lng: number;
}

function simplify(r: NominatimResult): SimplifiedPlace {
  const addr = r.address ?? {};
  const city =
    addr.city ?? addr.town ?? addr.village ?? addr.municipality ?? "";
  const state = addr.state ?? "";
  const country = addr.country ?? "";

  // First segment of display_name as the "short" name (place title)
  const parts = r.display_name.split(",").map((s) => s.trim());
  const shortName = parts[0] ?? r.display_name;
  const contextParts = [city, state, country].filter(Boolean);
  const context = contextParts.length > 0 ? contextParts.join(" · ") : parts.slice(1, 4).join(" · ");

  return {
    id: r.place_id,
    fullName: r.display_name,
    shortName,
    context,
    lat: parseFloat(r.lat),
    lng: parseFloat(r.lon),
  };
}

export function useNominatimSearch(query: string, debounceMs = 400) {
  const [results, setResults] = useState<SimplifiedPlace[]>([]);
  const [loading, setLoading] = useState(false);
  const abortRef = useRef<AbortController | null>(null);

  useEffect(() => {
    const trimmed = query.trim();
    if (trimmed.length < 3) {
      setResults([]);
      setLoading(false);
      // cancel any in-flight request
      abortRef.current?.abort();
      return;
    }

    const timer = setTimeout(async () => {
      // cancel previous
      abortRef.current?.abort();
      const ac = new AbortController();
      abortRef.current = ac;
      setLoading(true);

      try {
        const url = `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(
          trimmed
        )}&format=json&addressdetails=1&limit=6&accept-language=pt-BR`;
        const res = await fetch(url, {
          signal: ac.signal,
          headers: { "Accept-Language": "pt-BR" },
        });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: NominatimResult[] = await res.json();
        if (!ac.signal.aborted) {
          setResults(data.map(simplify));
        }
      } catch (err) {
        if ((err as Error)?.name !== "AbortError") {
          setResults([]);
        }
      } finally {
        if (!ac.signal.aborted) setLoading(false);
      }
    }, debounceMs);

    return () => {
      clearTimeout(timer);
    };
  }, [query, debounceMs]);

  // cleanup on unmount
  useEffect(() => {
    return () => {
      abortRef.current?.abort();
    };
  }, []);

  return { results, loading };
}
