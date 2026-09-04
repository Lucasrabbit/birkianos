import "server-only";

// Distância e tempo de carro entre dois pontos, via OSRM (OpenStreetMap).
// Sem API key e sem conta — mesmo ecossistema do Nominatim que o app já usa
// no PlaceAutocomplete. É um servidor público de demonstração: bom para uso
// pessoal, não para volume alto. Trocar por Google Distance Matrix ou
// OpenRouteService depois é só reescrever getLeg().
const OSRM_BASE = process.env.OSRM_BASE_URL ?? "https://router.project-osrm.org";

export interface LatLng {
  lat: number;
  lng: number;
}

export interface Leg {
  distanceKm: number;
  durationMinutes: number;
}

export async function getLeg(from: LatLng, to: LatLng): Promise<Leg | null> {
  const url =
    `${OSRM_BASE}/route/v1/driving/` +
    `${from.lng},${from.lat};${to.lng},${to.lat}?overview=false&alternatives=false`;

  try {
    const res = await fetch(url, { cache: "no-store" });
    if (!res.ok) return null;
    const data = await res.json();
    const route = data?.routes?.[0];
    if (data?.code !== "Ok" || !route) return null;
    return {
      distanceKm: Math.round((route.distance / 1000) * 10) / 10,
      durationMinutes: Math.round(route.duration / 60),
    };
  } catch {
    return null;
  }
}

export function hasCoords(point: {
  lat?: number | null;
  lng?: number | null;
}): point is { lat: number; lng: number } {
  return typeof point.lat === "number" && typeof point.lng === "number";
}
