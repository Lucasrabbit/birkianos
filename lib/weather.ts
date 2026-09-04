import "server-only";
import { DayWeather } from "@/types";

// Clima via Open-Meteo — sem API key e sem conta.
// Até ~15 dias à frente existe previsão de verdade; mais longe que isso o app
// mostra o clima típico daquela data (mesma data no ano anterior), que é o que
// dá pra saber com honestidade sobre uma viagem marcada pra daqui a meses.
const FORECAST_URL = "https://api.open-meteo.com/v1/forecast";
const ARCHIVE_URL = "https://archive-api.open-meteo.com/v1/archive";
const FORECAST_HORIZON_DAYS = 15;

// Códigos WMO usados pelo Open-Meteo
const WEATHER_CODES: Record<number, { label: string; emoji: string }> = {
  0: { label: "céu limpo", emoji: "☀️" },
  1: { label: "quase limpo", emoji: "🌤️" },
  2: { label: "parcialmente nublado", emoji: "⛅" },
  3: { label: "nublado", emoji: "☁️" },
  45: { label: "névoa", emoji: "🌫️" },
  48: { label: "névoa com geada", emoji: "🌫️" },
  51: { label: "garoa fraca", emoji: "🌦️" },
  53: { label: "garoa", emoji: "🌦️" },
  55: { label: "garoa forte", emoji: "🌦️" },
  56: { label: "garoa congelante", emoji: "🌧️" },
  57: { label: "garoa congelante forte", emoji: "🌧️" },
  61: { label: "chuva fraca", emoji: "🌦️" },
  63: { label: "chuva", emoji: "🌧️" },
  65: { label: "chuva forte", emoji: "🌧️" },
  66: { label: "chuva congelante", emoji: "🌧️" },
  67: { label: "chuva congelante forte", emoji: "🌧️" },
  71: { label: "neve fraca", emoji: "🌨️" },
  73: { label: "neve", emoji: "🌨️" },
  75: { label: "neve forte", emoji: "❄️" },
  77: { label: "granizo fino", emoji: "🌨️" },
  80: { label: "pancadas de chuva", emoji: "🌦️" },
  81: { label: "pancadas fortes", emoji: "🌧️" },
  82: { label: "temporal", emoji: "⛈️" },
  85: { label: "pancadas de neve", emoji: "🌨️" },
  86: { label: "nevasca", emoji: "❄️" },
  95: { label: "tempestade", emoji: "⛈️" },
  96: { label: "tempestade com granizo", emoji: "⛈️" },
  99: { label: "tempestade forte com granizo", emoji: "⛈️" },
};

function describe(code: number | null) {
  if (code === null) return { label: "sem dados", emoji: "🌍" };
  return WEATHER_CODES[code] ?? { label: "tempo variável", emoji: "🌤️" };
}

function daysFromToday(date: string): number {
  const target = new Date(`${date}T12:00:00Z`).getTime();
  const today = new Date();
  const todayUtc = Date.UTC(today.getUTCFullYear(), today.getUTCMonth(), today.getUTCDate(), 12);
  return Math.round((target - todayUtc) / (1000 * 60 * 60 * 24));
}

function firstValue<T>(arr: T[] | undefined): T | null {
  return arr && arr.length > 0 ? arr[0] : null;
}

export async function getDayWeather(
  lat: number,
  lng: number,
  date: string
): Promise<DayWeather | null> {
  const offset = daysFromToday(date);
  const useForecast = offset >= 0 && offset <= FORECAST_HORIZON_DAYS;

  const url = useForecast
    ? `${FORECAST_URL}?latitude=${lat}&longitude=${lng}` +
      `&daily=weather_code,temperature_2m_max,temperature_2m_min,precipitation_probability_max` +
      `&timezone=auto&start_date=${date}&end_date=${date}`
    : buildArchiveUrl(lat, lng, date);

  try {
    const res = await fetch(url, { next: { revalidate: 3600 } });
    if (!res.ok) return null;
    const data = await res.json();
    const daily = data?.daily;
    if (!daily) return null;

    const code = firstValue<number>(daily.weather_code);
    const { label, emoji } = describe(code);

    return {
      kind: useForecast ? "forecast" : "typical",
      date,
      tempMax: firstValue<number>(daily.temperature_2m_max),
      tempMin: firstValue<number>(daily.temperature_2m_min),
      precipitationChance: firstValue<number>(daily.precipitation_probability_max),
      code,
      label,
      emoji,
    };
  } catch {
    return null;
  }
}

// Mesma data do ano passado, como referência de clima típico
function buildArchiveUrl(lat: number, lng: number, date: string): string {
  const lastYear = new Date(`${date}T12:00:00Z`);
  lastYear.setUTCFullYear(lastYear.getUTCFullYear() - 1);
  const ref = lastYear.toISOString().slice(0, 10);
  return (
    `${ARCHIVE_URL}?latitude=${lat}&longitude=${lng}` +
    `&daily=weather_code,temperature_2m_max,temperature_2m_min` +
    `&timezone=auto&start_date=${ref}&end_date=${ref}`
  );
}
