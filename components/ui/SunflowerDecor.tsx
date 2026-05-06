"use client";

interface SunflowerProps {
  size?: number;
  rotation?: number;
  opacity?: number;
  className?: string;
  style?: React.CSSProperties;
}

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
        fill="#5a6b3a"
        opacity={0.85}
        transform={`rotate(35 ${cx + 28} ${cy + 32})`}
      />

      {/* back row petals (darker) */}
      <g>
        {Array.from({ length: petals }).map((_, i) => {
          const angle = (i / petals) * 360;
          return (
            <ellipse
              key={`back-${i}`}
              cx={cx}
              cy={cy - petalDistance}
              rx={petalRx}
              ry={petalRy}
              fill="#e89c1f"
              transform={`rotate(${angle + 15} ${cx} ${cy})`}
              opacity={0.85}
            />
          );
        })}
      </g>

      {/* front row petals */}
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
              fill={i % 2 === 0 ? "#f2b134" : "#e89c1f"}
              transform={`rotate(${angle} ${cx} ${cy})`}
              opacity={0.95}
            />
          );
        })}
      </g>

      {/* center */}
      <circle cx={cx} cy={cy} r={14} fill="#5a3a14" />
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
            fill="#2b1f12"
            opacity={0.6}
          />
        );
      })}

      <defs>
        <radialGradient id="sunflower-center" cx="0.5" cy="0.5" r="0.5">
          <stop offset="0%" stopColor="#3d2509" />
          <stop offset="100%" stopColor="#5a3a14" />
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
