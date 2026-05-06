"use client";

import { useEffect, useState } from "react";
import { Stop, Trip } from "@/types";
import { STOP_TYPE_CONFIG } from "@/lib/constants";

interface TripMapProps {
  trip: Trip;
  stops: Stop[];
}

interface GeoPoint {
  lat: number;
  lng: number;
  label: string;
  type: "origin" | "destination" | "stop";
  stopType?: Stop["type"];
}

async function geocode(query: string): Promise<{ lat: number; lng: number } | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(query)}&format=json&limit=1`,
      { headers: { "Accept-Language": "pt-BR" } }
    );
    const data = await res.json();
    if (data[0]) {
      return { lat: parseFloat(data[0].lat), lng: parseFloat(data[0].lon) };
    }
  } catch {
    // silently fail
  }
  return null;
}

export default function TripMap({ trip, stops }: TripMapProps) {
  const [points, setPoints] = useState<GeoPoint[]>([]);
  const [loading, setLoading] = useState(true);
  const [MapComponents, setMapComponents] = useState<{
    MapContainer: typeof import("react-leaflet")["MapContainer"];
    TileLayer: typeof import("react-leaflet")["TileLayer"];
    Marker: typeof import("react-leaflet")["Marker"];
    Popup: typeof import("react-leaflet")["Popup"];
    Polyline: typeof import("react-leaflet")["Polyline"];
    useMap: typeof import("react-leaflet")["useMap"];
  } | null>(null);
  const [L, setL] = useState<typeof import("leaflet") | null>(null);

  useEffect(() => {
    Promise.all([import("react-leaflet"), import("leaflet")]).then(
      ([rl, leaflet]) => {
        setMapComponents({
          MapContainer: rl.MapContainer,
          TileLayer: rl.TileLayer,
          Marker: rl.Marker,
          Popup: rl.Popup,
          Polyline: rl.Polyline,
          useMap: rl.useMap,
        });
        setL(leaflet.default || leaflet);
      }
    );
  }, []);

  useEffect(() => {
    const buildPoints = async () => {
      setLoading(true);
      const pts: GeoPoint[] = [];

      const originCoords =
        trip.origin_lat && trip.origin_lng
          ? { lat: trip.origin_lat, lng: trip.origin_lng }
          : await geocode(trip.origin);
      if (originCoords) {
        pts.push({ ...originCoords, label: trip.origin, type: "origin" });
      }

      for (const stop of stops) {
        if (stop.lat && stop.lng) {
          pts.push({ lat: stop.lat, lng: stop.lng, label: stop.name, type: "stop", stopType: stop.type });
        } else if (stop.address || stop.name) {
          const coords = await geocode(stop.address ?? stop.name);
          if (coords) {
            pts.push({ ...coords, label: stop.name, type: "stop", stopType: stop.type });
          }
        }
      }

      const destCoords =
        trip.destination_lat && trip.destination_lng
          ? { lat: trip.destination_lat, lng: trip.destination_lng }
          : await geocode(trip.destination);
      if (destCoords) {
        pts.push({ ...destCoords, label: trip.destination, type: "destination" });
      }

      setPoints(pts);
      setLoading(false);
    };

    buildPoints();
  }, [trip, stops]);

  if (loading || !MapComponents || !L) {
    return (
      <div className="w-full h-96 bg-birk-paper-deep flex items-center justify-center" style={{ borderRadius: "4px" }}>
        <div className="text-center">
          <div className="text-3xl mb-2">🗺️</div>
          <p className="font-serif text-birk-ink-faint text-sm italic">carregando mapa…</p>
        </div>
      </div>
    );
  }

  if (points.length === 0) {
    return (
      <div className="w-full h-96 bg-birk-paper-deep flex items-center justify-center" style={{ borderRadius: "4px" }}>
        <div className="text-center">
          <div className="text-3xl mb-2">📍</div>
          <p className="font-serif text-birk-ink-faint text-sm italic">
            adicione paradas para ver o mapa
          </p>
        </div>
      </div>
    );
  }

  const { MapContainer, TileLayer, Marker, Popup, Polyline } = MapComponents;
  const center = points[Math.floor(points.length / 2)];
  const polylinePoints = points.map((p) => [p.lat, p.lng] as [number, number]);

  const makeIcon = (emoji: string, color: string) => {
    return L.divIcon({
      html: `<div style="
        width:34px;height:34px;border-radius:50%;
        background:${color};border:2px solid #2b1f12;
        box-shadow:2px 2px 0 #2b1f12;
        display:flex;align-items:center;justify-content:center;
        font-size:16px;line-height:1;
      ">${emoji}</div>`,
      className: "",
      iconSize: [34, 34],
      iconAnchor: [17, 17],
    });
  };

  const getIcon = (pt: GeoPoint) => {
    if (pt.type === "origin") return makeIcon("🟡", "#f2b134");
    if (pt.type === "destination") return makeIcon("🟢", "#5a6b3a");
    const cfg = STOP_TYPE_CONFIG[pt.stopType!];
    return makeIcon(cfg.emoji, "#fde9a8");
  };

  return (
    <div className="w-full h-[28rem] overflow-hidden shadow-soft border border-birk-edge" style={{ borderRadius: "4px" }}>
      <MapContainer
        center={[center.lat, center.lng]}
        zoom={9}
        style={{ width: "100%", height: "100%" }}
        scrollWheelZoom
      >
        <TileLayer
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        />
        <Polyline
          positions={polylinePoints}
          pathOptions={{ color: "#b4533a", weight: 3, dashArray: "2 6", opacity: 0.8 }}
        />
        {points.map((pt, i) => (
          <Marker key={i} position={[pt.lat, pt.lng]} icon={getIcon(pt)}>
            <Popup>
              <strong>{pt.label}</strong>
              <br />
              <small className="text-gray-500">
                {pt.type === "origin"
                  ? "Origem"
                  : pt.type === "destination"
                  ? "Destino"
                  : pt.stopType
                  ? STOP_TYPE_CONFIG[pt.stopType].label
                  : "Parada"}
              </small>
            </Popup>
          </Marker>
        ))}
      </MapContainer>
    </div>
  );
}
