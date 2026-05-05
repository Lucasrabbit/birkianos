"use client";

interface SunflowerProps {
  size?: number;
  rotation?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

/**
 * Inline hand-drawn sunflower SVG.
 * Yellow petals with a brown center and a tiny green leaf accent.
 */
export default function SunflowerDecor({
  size = 64,
  rotation = 0,
  opacity = 1,
  className = "",
  style,
}: SunflowerProps) {
  const petals = 12;
  const cx = 50;
  const cy = 50;
  const petalRx = 8;
  const petalRy = 22;
  const petalDistance = 22;

  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 100 100"
      className={className}
      style={{
        transform: `rotate(${rotation}deg)`,
        opacity,
        ...style,
      }}
      aria-hidden
    >
      {/* small leaf */}
      <ellipse
        cx={cx + 28}
        cy={cy + 32}
        rx={9}
        ry={4}
        fill="#7FB77E"
        opacity={0.85}
        transform={`rotate(35 ${cx + 28} ${cy + 32})`}
      />

      {/* petals */}
      <g>
        {Array.from({ length: petals }).map((_, i) => {
          const angle = (i / petals) * 360;
          return (
            <ellipse
              key={i}
              cx={cx}
              cy={cy - petalDistance}
              rx={petalRx}
              ry={petalRy}
              fill={i % 2 === 0 ? "#F4C430" : "#E8A020"}
              transform={`rotate(${angle} ${cx} ${cy})`}
              opacity={0.95}
            />
          );
        })}
      </g>

      {/* center */}
      <circle cx={cx} cy={cy} r={14} fill="#6B4C3B" />
      <circle cx={cx} cy={cy} r={14} fill="url(#sunflower-center)" opacity={0.9} />
      {/* tiny seeds */}
      {Array.from({ length: 8 }).map((_, i) => {
        const a = (i / 8) * Math.PI * 2;
        return (
          <circle
            key={i}
            cx={cx + Math.cos(a) * 7}
            cy={cy + Math.sin(a) * 7}
            r={1.2}
            fill="#2C1810"
            opacity={0.6}
          />
        );
      })}

      <defs>
        <radialGradient id="sunflower-center" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#8B6244" />
          <stop offset="100%" stopColor="#4A2E1A" />
        </radialGradient>
      </defs>
    </svg>
  );
}

export function SunflowerSm(props: Omit<SunflowerProps, "size">) {
  return <SunflowerDecor size={36} {...props} />;
}

export function SunflowerMd(props: Omit<SunflowerProps, "size">) {
  return <SunflowerDecor size={64} {...props} />;
}

export function SunflowerLg(props: Omit<SunflowerProps, "size">) {
  return <SunflowerDecor size={96} {...props} />;
}
