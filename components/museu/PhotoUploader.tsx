"use client";

import { useRef, useState } from "react";
import { Upload } from "lucide-react";
import { Stop, Photo } from "@/types";
import { uploadPhoto } from "@/lib/api";
import Button from "@/components/ui/Button";

interface PhotoUploaderProps {
  tripId: string;
  stops: Stop[];
  onUploaded: (photo: Photo) => void;
}

export default function PhotoUploader({ tripId, stops, onUploaded }: PhotoUploaderProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [stopId, setStopId] = useState("");
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleFiles = async (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setUploading(true);
    setError(null);
    try {
      for (const file of Array.from(files)) {
        const photo = await uploadPhoto(tripId, file, { stopId: stopId || undefined });
        onUploaded(photo);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : "Falha ao enviar foto");
    } finally {
      setUploading(false);
      if (inputRef.current) inputRef.current.value = "";
    }
  };

  return (
    <div className="flex flex-wrap items-center gap-3">
      <select
        value={stopId}
        onChange={(e) => setStopId(e.target.value)}
        className="px-3 py-2 rounded border border-birk-edge bg-white/70 text-sm font-serif text-birk-ink focus:outline-none focus:ring-2 focus:ring-birk-sun/40"
      >
        <option value="">sem parada específica</option>
        {stops.map((s) => (
          <option key={s.id} value={s.id}>
            {s.name}
          </option>
        ))}
      </select>
      <Button
        variant="secondary"
        size="sm"
        loading={uploading}
        onClick={() => inputRef.current?.click()}
        type="button"
      >
        <Upload size={14} />
        adicionar fotos
      </Button>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        multiple
        hidden
        onChange={(e) => handleFiles(e.target.files)}
      />
      {error && <span className="text-red-500 text-xs">{error}</span>}
    </div>
  );
}
