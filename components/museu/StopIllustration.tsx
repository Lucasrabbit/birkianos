"use client";

import { StopType } from "@/types";

interface StopIllustrationProps {
  type: StopType;
  className?: string;
}

/**
 * Illustrated SVG per StopType — temática "diário de estrada".
 * Same 4:5 polaroid ratio, paper-friendly palette.
 */
export default function StopIllustration({ type, className = "" }: StopIllustrationProps) {
  const inner = ILLUSTRATIONS[type];

  return (
    <svg
      viewBox="0 0 100 125"
      width="100%"
      height="100%"
      preserveAspectRatio="xMidYMid slice"
      className={className}
      aria-hidden
    >
      {inner}
    </svg>
  );
}

const ILLUSTRATIONS: Record<StopType, React.ReactElement> = {
  food: (
    <>
      <defs>
        <linearGradient id="ill-food" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#d4825a" />
          <stop offset="1" stopColor="#8a3a26" />
        </linearGradient>
      </defs>
      <rect width="100" height="125" fill="url(#ill-food)" />
      {/* steam */}
      <path d="M40 38 Q42 30 38 22" stroke="#fffbf0" strokeWidth="1.2" fill="none" opacity=".7" strokeLinecap="round" />
      <path d="M50 36 Q52 28 48 20" stroke="#fffbf0" strokeWidth="1.2" fill="none" opacity=".55" strokeLinecap="round" />
      <path d="M60 38 Q62 30 58 22" stroke="#fffbf0" strokeWidth="1.2" fill="none" opacity=".7" strokeLinecap="round" />
      {/* cup */}
      <ellipse cx="50" cy="62" rx="22" ry="6" fill="#fffbf0" />
      <path d="M28 62 L31 92 Q31 96 35 96 H65 Q69 96 69 92 L72 62 Z" fill="#fffbf0" />
      <ellipse cx="50" cy="62" rx="18" ry="4" fill="#3a1a08" />
      <ellipse cx="44" cy="60" rx="6" ry="2" fill="#5a2a10" opacity=".6" />
      {/* handle */}
      <path d="M72 70 Q82 72 82 80 Q82 88 72 88" stroke="#fffbf0" strokeWidth="3" fill="none" />
    </>
  ),

  technical: (
    <>
      <defs>
        <linearGradient id="ill-tech" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#94a8b4" />
          <stop offset="1" stopColor="#3d4a55" />
        </linearGradient>
      </defs>
      <rect width="100" height="125" fill="url(#ill-tech)" />
      {/* road */}
      <path d="M0 95 Q50 85 100 95 V125 H0 Z" fill="#2b1f12" />
      <path d="M0 100 L100 102" stroke="#fde9a8" strokeWidth=".8" strokeDasharray="4 5" opacity=".7" fill="none" />
      {/* gas pump */}
      <rect x="42" y="55" width="16" height="35" rx="2" fill="#b4533a" />
      <rect x="44" y="58" width="12" height="10" fill="#fde9a8" />
      <rect x="46" y="60" width="3" height="2" fill="#2b1f12" />
      <rect x="51" y="60" width="3" height="2" fill="#2b1f12" />
      <rect x="46" y="63" width="3" height="2" fill="#2b1f12" />
      <rect x="51" y="63" width="3" height="2" fill="#2b1f12" />
      <rect x="58" y="62" width="6" height="2" rx="1" fill="#5a2a10" />
      <rect x="62" y="62" width="2" height="14" fill="#5a2a10" />
      {/* base */}
      <rect x="38" y="88" width="24" height="4" fill="#2b1f12" />
    </>
  ),

  accommodation: (
    <>
      <rect width="100" height="125" fill="#2a3a4a" />
      {/* stars */}
      <circle cx="20" cy="20" r=".8" fill="#f5ecd9" />
      <circle cx="40" cy="14" r=".5" fill="#f5ecd9" />
      <circle cx="65" cy="22" r=".7" fill="#f5ecd9" />
      <circle cx="85" cy="16" r=".6" fill="#f5ecd9" />
      <circle cx="30" cy="35" r=".4" fill="#f5ecd9" />
      <circle cx="78" cy="38" r=".5" fill="#f5ecd9" />
      {/* moon */}
      <circle cx="78" cy="28" r="6" fill="#fde9a8" opacity=".85" />
      <circle cx="80" cy="26" r="5" fill="#2a3a4a" />
      {/* cabin */}
      <path d="M30 80 L50 65 L70 80 V95 H30 Z" fill="#3a2410" />
      <path d="M28 80 L50 63 L72 80 L70 80 L50 65 L30 80 Z" fill="#2a1808" />
      <rect x="46" y="82" width="8" height="13" fill="#f2b134" />
      <rect x="36" y="83" width="6" height="6" fill="#e89c1f" />
      {/* ground */}
      <path d="M0 95 Q50 90 100 95 V125 H0Z" fill="#1a1408" />
    </>
  ),

  attraction: (
    <>
      <defs>
        <linearGradient id="ill-attr" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#a8c66a" />
          <stop offset="1" stopColor="#5a6b3a" />
        </linearGradient>
      </defs>
      <rect width="100" height="125" fill="url(#ill-attr)" />
      {/* sun */}
      <circle cx="22" cy="22" r="9" fill="#fde9a8" opacity=".85" />
      {/* sunflowers */}
      <g transform="translate(10,40)">
        <circle cx="15" cy="15" r="13" fill="#f2b134" />
        <circle cx="15" cy="15" r="6" fill="#5a3a14" />
      </g>
      <g transform="translate(40,28)">
        <circle cx="15" cy="15" r="16" fill="#f2b134" />
        <circle cx="15" cy="15" r="7" fill="#5a3a14" />
      </g>
      <g transform="translate(70,42)">
        <circle cx="12" cy="12" r="11" fill="#e89c1f" />
        <circle cx="12" cy="12" r="5" fill="#5a3a14" />
      </g>
      {/* ground */}
      <rect y="100" width="100" height="25" fill="#3d4a26" />
      <path d="M10 100 L8 125 M22 100 L20 125 M35 100 L37 125 M50 100 L48 125 M65 100 L67 125 M80 100 L82 125 M92 100 L90 125" stroke="#2a3318" strokeWidth=".5" />
    </>
  ),

  bathroom: (
    <>
      <defs>
        <linearGradient id="ill-bath" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#b9c9b8" />
          <stop offset="1" stopColor="#5a8270" />
        </linearGradient>
      </defs>
      <rect width="100" height="125" fill="url(#ill-bath)" />
      {/* waves / drops */}
      <path d="M20 50 Q25 45 30 50 T40 50" stroke="#fffbf0" strokeWidth="1.2" fill="none" opacity=".5" />
      <path d="M60 50 Q65 45 70 50 T80 50" stroke="#fffbf0" strokeWidth="1.2" fill="none" opacity=".5" />
      {/* sign */}
      <rect x="28" y="60" width="44" height="44" rx="4" fill="#fffbf0" />
      <text x="50" y="92" fontFamily="Fraunces, serif" fontSize="32" textAnchor="middle" fill="#2b1f12" fontStyle="italic">wc</text>
      <rect x="38" y="100" width="24" height="3" rx="1" fill="#5a8270" />
    </>
  ),

  highlight: (
    <>
      <defs>
        <linearGradient id="ill-hl" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor="#f5cd84" />
          <stop offset=".5" stopColor="#e89858" />
          <stop offset="1" stopColor="#a04428" />
        </linearGradient>
      </defs>
      <rect width="100" height="125" fill="url(#ill-hl)" />
      <circle cx="50" cy="55" r="14" fill="#fde9a8" opacity=".9" />
      {/* rays */}
      <g stroke="#fde9a8" strokeWidth="1" opacity=".5">
        <line x1="50" y1="32" x2="50" y2="22" />
        <line x1="32" y1="55" x2="22" y2="55" />
        <line x1="68" y1="55" x2="78" y2="55" />
        <line x1="36" y1="40" x2="29" y2="33" />
        <line x1="64" y1="40" x2="71" y2="33" />
      </g>
      {/* mountains silhouette */}
      <path d="M0 95 Q25 78 50 88 T100 92 V125 H0 Z" fill="#3d2509" />
      <path d="M0 100 Q30 90 55 96 T100 100 V125 H0 Z" fill="#2b1f12" />
      {/* stars / heart */}
      <text x="78" y="30" fontFamily="serif" fontSize="14" fill="#fffbf0" opacity=".85">★</text>
    </>
  ),
};
