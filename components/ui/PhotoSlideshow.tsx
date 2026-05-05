"use client";

import { useEffect, useState } from "react";
import { BACKGROUND_PHOTOS, PHOTO_INTERVAL_MS } from "@/lib/photos";

export default function PhotoSlideshow() {
  const [current, setCurrent] = useState(0);
  const [loaded, setLoaded] = useState<boolean[]>(new Array(BACKGROUND_PHOTOS.length).fill(false));

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrent((prev) => (prev + 1) % BACKGROUND_PHOTOS.length);
    }, PHOTO_INTERVAL_MS);
    return () => clearInterval(interval);
  }, []);

  const markLoaded = (index: number) => {
    setLoaded((prev) => {
      const next = [...prev];
      next[index] = true;
      return next;
    });
  };

  return (
    <div className="absolute inset-0 overflow-hidden">
      {BACKGROUND_PHOTOS.map((url, i) => (
        <div
          key={url}
          className="photo-slide"
          style={{
            backgroundImage: loaded[i] ? `url(${url})` : "none",
            opacity: i === current ? 1 : 0,
          }}
        >
          <img
            src={url}
            alt=""
            className="hidden"
            onLoad={() => markLoaded(i)}
          />
        </div>
      ))}
      {/* Warm gradient overlay */}
      <div
        className="absolute inset-0"
        style={{
          background: "linear-gradient(to bottom, rgba(44,24,16,0.25) 0%, rgba(44,24,16,0.35) 40%, rgba(44,24,16,0.65) 75%, rgba(44,24,16,0.85) 100%)",
        }}
      />
      {/* Warm amber tint */}
      <div
        className="absolute inset-0"
        style={{ background: "rgba(244,196,48,0.06)", mixBlendMode: "multiply" }}
      />
    </div>
  );
}
