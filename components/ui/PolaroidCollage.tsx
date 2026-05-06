"use client";

import { motion } from "framer-motion";
import { BACKGROUND_PHOTOS, PHOTO_CAPTIONS } from "@/lib/photos";

interface PolaroidProps {
  src: string;
  caption?: string;
  rotation: number;
  delay: number;
  className?: string;
  size?: "sm" | "md" | "lg";
}

function Polaroid({ src, caption, rotation, delay, className = "", size = "md" }: PolaroidProps) {
  const dims =
    size === "sm"
      ? { w: 140, h: 140 }
      : size === "lg"
      ? { w: 220, h: 220 }
      : { w: 180, h: 180 };

  return (
    <motion.div
      initial={{ opacity: 0, y: 30, rotate: rotation - 8, scale: 0.9 }}
      animate={{ opacity: 1, y: 0, rotate: rotation, scale: 1 }}
      transition={{ delay, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
      whileHover={{ rotate: 0, scale: 1.05, y: -6, zIndex: 30 }}
      className={`polaroid absolute ${className}`}
      style={{ width: dims.w + 24, transformOrigin: "center" }}
    >
      <div
        style={{
          width: dims.w,
          height: dims.h,
          backgroundImage: `url(${src})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          backgroundColor: "#d9c79c",
        }}
      />
      {caption && (
        <p
          className="font-hand text-birk-ink text-center mt-2"
          style={{ fontSize: "1.1rem", fontWeight: 600, lineHeight: 1.1 }}
        >
          {caption}
        </p>
      )}
    </motion.div>
  );
}

export default function PolaroidCollage() {
  const photos = BACKGROUND_PHOTOS.slice(0, 5);

  const positions = [
    { className: "top-[8%] left-[6%]", rotation: -9, delay: 0.4, size: "md" as const },
    { className: "top-[12%] right-[7%]", rotation: 7, delay: 0.55, size: "md" as const },
    { className: "bottom-[14%] left-[10%]", rotation: 6, delay: 0.7, size: "sm" as const },
    { className: "bottom-[10%] right-[12%]", rotation: -8, delay: 0.85, size: "sm" as const },
    { className: "top-[42%] left-[2%] hidden lg:block", rotation: 4, delay: 1, size: "sm" as const },
  ];

  return (
    <div className="absolute inset-0 pointer-events-none">
      <div className="relative w-full h-full pointer-events-auto">
        {photos.map((src, i) => {
          const pos = positions[i];
          if (!pos) return null;
          return (
            <Polaroid
              key={src}
              src={src}
              caption={PHOTO_CAPTIONS[i]}
              rotation={pos.rotation}
              delay={pos.delay}
              className={pos.className}
              size={pos.size}
            />
          );
        })}
      </div>
    </div>
  );
}
