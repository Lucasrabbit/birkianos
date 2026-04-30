import { StopType } from "@/types";

export const STOP_TYPE_CONFIG: Record<
  StopType,
  { label: string; emoji: string; color: string; bg: string }
> = {
  food: {
    label: "Comida",
    emoji: "🍴",
    color: "text-orange-600",
    bg: "bg-orange-50",
  },
  technical: {
    label: "Parada técnica",
    emoji: "⛽",
    color: "text-gray-600",
    bg: "bg-gray-50",
  },
  accommodation: {
    label: "Hospedagem",
    emoji: "🏨",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  attraction: {
    label: "Ponto turístico",
    emoji: "📸",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  bathroom: {
    label: "Banheiro",
    emoji: "🚻",
    color: "text-teal-600",
    bg: "bg-teal-50",
  },
  highlight: {
    label: "Destaque",
    emoji: "⭐",
    color: "text-yellow-600",
    bg: "bg-yellow-50",
  },
};

export const NOTE_TYPE_CONFIG = {
  checklist: { label: "Checklist", emoji: "✅", color: "text-green-600" },
  reminder: { label: "Lembrete", emoji: "🔔", color: "text-blue-600" },
  idea: { label: "Ideia", emoji: "💡", color: "text-yellow-600" },
};

export const BRAND_PHRASE = "Algum ritmo em comum fez nos encontrar 💛";
