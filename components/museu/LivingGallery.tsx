"use client";

import { motion, AnimatePresence } from "framer-motion";
import { Trash2 } from "lucide-react";
import { Stop, Photo } from "@/types";
import { photoUrl, deletePhoto } from "@/lib/api";
import StopIllustration from "./StopIllustration";
import PhotoUploader from "./PhotoUploader";

interface LivingGalleryProps {
  tripId: string;
  stops: Stop[];
  photos: Photo[];
  onPhotosChange: (photos: Photo[]) => void;
}

function tilt(id: string): number {
  const hash = id.split("").reduce((a, c) => a + c.charCodeAt(0), 0);
  return ((hash % 11) - 5) * 0.7;
}

export default function LivingGallery({ tripId, stops, photos, onPhotosChange }: LivingGalleryProps) {
  if (stops.length === 0) return null;

  const stopIds = new Set(stops.map((s) => s.id));
  const extraPhotos = photos.filter((p) => !p.stop_id || !stopIds.has(p.stop_id));

  const handleDelete = async (id: string) => {
    if (!confirm("Apagar essa foto? Não tem volta.")) return;
    await deletePhoto(id);
    onPhotosChange(photos.filter((p) => p.id !== id));
  };

  return (
    <section className="max-w-[1100px] mx-auto px-6 pt-8 pb-24">
      <div className="section-head" style={{ marginTop: 32, marginBottom: 24 }}>
        <h2>
          <span className="num">03 / galeria</span>
          <em>as polaroids que ficaram.</em>
        </h2>
        <span className="aside">passe o mouse pra abrir ✿</span>
      </div>

      <div className="mb-8">
        <PhotoUploader
          tripId={tripId}
          stops={stops}
          onUploaded={(photo) => onPhotosChange([photo, ...photos])}
        />
      </div>

      <div className="grid grid-cols-2 md:grid-cols-3 gap-x-6 gap-y-10 md:gap-x-10 md:gap-y-14">
        {stops.map((stop, i) => {
          const rotation = tilt(stop.id);
          const photo = photos.find((p) => p.stop_id === stop.id);
          return (
            <motion.div
              key={stop.id}
              initial={{ opacity: 0, y: 24, rotate: rotation * 0.4, scale: 0.95 }}
              whileInView={{ opacity: 1, y: 0, rotate: rotation, scale: 1 }}
              viewport={{ once: true, margin: "-60px" }}
              transition={{ delay: i * 0.05, duration: 0.55, ease: "easeOut" }}
              whileHover={{ rotate: 0, scale: 1.04, y: -6, zIndex: 5 }}
              className="polaroid relative group"
              style={{ transformOrigin: "center bottom" }}
            >
              <span className="tape" />
              <div style={{ aspectRatio: "4/5" }} className="overflow-hidden relative">
                {photo ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={photoUrl(photo.id)}
                    alt={photo.caption ?? stop.name}
                    className="w-full h-full object-cover"
                  />
                ) : (
                  <StopIllustration type={stop.type} />
                )}
                {photo && (
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-1.5 right-1.5 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="apagar foto"
                  >
                    <Trash2 size={12} />
                  </button>
                )}
              </div>
              <div className="font-hand text-birk-ink text-center mt-3 text-xl leading-tight px-1" style={{ fontWeight: 600 }}>
                {stop.name}
              </div>
            </motion.div>
          );
        })}
      </div>

      {extraPhotos.length > 0 && (
        <div className="mt-14">
          <p className="font-hand text-birk-terra text-xl mb-5" style={{ fontWeight: 600 }}>
            mais fotos soltas
          </p>
          <div className="grid grid-cols-3 sm:grid-cols-4 md:grid-cols-6 gap-4">
            <AnimatePresence>
              {extraPhotos.map((photo) => (
                <motion.div
                  key={photo.id}
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.9 }}
                  className="relative group aspect-square rounded overflow-hidden bg-birk-paper-deep"
                >
                  {/* eslint-disable-next-line @next/next/no-img-element */}
                  <img
                    src={photoUrl(photo.id)}
                    alt={photo.caption ?? "foto da viagem"}
                    className="w-full h-full object-cover"
                  />
                  <button
                    onClick={() => handleDelete(photo.id)}
                    className="absolute top-1 right-1 p-1.5 rounded-full bg-black/50 text-white opacity-0 group-hover:opacity-100 transition-opacity cursor-pointer"
                    aria-label="apagar foto"
                  >
                    <Trash2 size={12} />
                  </button>
                </motion.div>
              ))}
            </AnimatePresence>
          </div>
        </div>
      )}
    </section>
  );
}
