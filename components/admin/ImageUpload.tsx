"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

interface ImageUploadProps {
  value?: string;
  onChange: (dataUrl: string) => void;
  aspect?: "square" | "video";
  className?: string;
}

export function ImageUpload({ value, onChange, aspect = "square", className }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);

  function handleFile(file: File) {
    setLoading(true);
    const reader = new FileReader();
    reader.onload = () => {
      onChange(reader.result as string);
      setLoading(false);
    };
    reader.readAsDataURL(file);
  }

  const frameCls = cn(
    "overflow-hidden rounded-md border border-border bg-secondary",
    aspect === "square" ? "aspect-square w-32" : "aspect-video w-full"
  );

  return (
    <div className={cn("space-y-2", className)}>
      <input
        ref={inputRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) handleFile(file);
          e.target.value = "";
        }}
      />

      {value ? (
        <div className={cn(frameCls, "relative")}>
          <img src={value} alt="" className="h-full w-full object-cover" />
          <button
            type="button"
            onClick={() => onChange("")}
            aria-label="Remove image"
            className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className={cn(
            frameCls,
            "flex flex-col items-center justify-center gap-1.5 text-text-muted transition-colors hover:border-brand-primary hover:text-brand-primary disabled:opacity-50",
            "border-dashed"
          )}
        >
          <ImagePlus className="h-5 w-5" />
          <span className="text-xs font-medium">{loading ? "Uploading…" : "Upload photo"}</span>
        </button>
      )}

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          className="text-xs font-medium text-brand-primary hover:underline"
        >
          Replace photo
        </button>
      )}
    </div>
  );
}
