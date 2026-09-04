import { NextResponse } from "next/server";
import { getDayWeather } from "@/lib/weather";

export const runtime = "nodejs";

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const lat = Number(searchParams.get("lat"));
  const lng = Number(searchParams.get("lng"));
  const date = searchParams.get("date") ?? "";

  const validCoords =
    Number.isFinite(lat) && Number.isFinite(lng) && Math.abs(lat) <= 90 && Math.abs(lng) <= 180;
  if (!validCoords || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
    return NextResponse.json({ error: "Parâmetros inválidos" }, { status: 400 });
  }

  const weather = await getDayWeather(lat, lng, date);
  if (!weather) {
    return NextResponse.json({ error: "Sem previsão disponível agora" }, { status: 502 });
  }
  return NextResponse.json(weather);
}
