"use client";

import { useEffect, useState } from "react";
import { DayWeather } from "@/types";
import { getWeather } from "@/lib/api";

interface DayWeatherBadgeProps {
  lat?: number;
  lng?: number;
  date?: string;
}

export default function DayWeatherBadge({ lat, lng, date }: DayWeatherBadgeProps) {
  const [weather, setWeather] = useState<DayWeather | null>(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (typeof lat !== "number" || typeof lng !== "number" || !date) return;
    let active = true;
    setLoading(true);
    getWeather(lat, lng, date)
      .then((w) => {
        if (active) setWeather(w);
      })
      .catch(() => {})
      .finally(() => {
        if (active) setLoading(false);
      });
    return () => {
      active = false;
    };
  }, [lat, lng, date]);

  if (typeof lat !== "number" || typeof lng !== "number" || !date) return null;

  if (loading) {
    return (
      <span className="font-mono text-[10px] uppercase tracking-[0.12em] text-birk-ink-faint">
        vendo o clima…
      </span>
    );
  }

  if (!weather) return null;

  return (
    <span
      className="inline-flex items-center gap-1.5 font-mono text-[10px] uppercase tracking-[0.1em] text-birk-ink-faint"
      title={
        weather.kind === "typical"
          ? "clima típico dessa data (previsão de verdade só até ~15 dias antes)"
          : "previsão do tempo"
      }
    >
      <span className="text-sm not-italic">{weather.emoji}</span>
      {weather.tempMax !== null && (
        <span>
          {Math.round(weather.tempMax)}°
          {weather.tempMin !== null ? ` / ${Math.round(weather.tempMin)}°` : ""}
        </span>
      )}
      <span>{weather.label}</span>
      {weather.precipitationChance !== null && weather.precipitationChance > 20 && (
        <span>· {weather.precipitationChance}% chuva</span>
      )}
      {weather.kind === "typical" && (
        <span className="normal-case italic font-serif">(típico do ano passado)</span>
      )}
    </span>
  );
}
