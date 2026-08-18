"use client";

import { useRef, useState } from "react";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { uploadImage } from "@/lib/firebase/storage";

interface ImageUploadProps {
  value?: string;
  onChange: (url: string) => void;
  /** Firebase Storage folder to upload into, e.g. "gallery", "events", "products", "members". */
  folder: string;
  aspect?: "square" | "video";
  className?: string;
  /** Required for member-only folders (e.g. "members") — resolves a fresh Firebase Auth ID token right before upload. Admin folders don't need this; they rely on the admin session cookie. */
  getIdToken?: () => Promise<string>;
}

// Guards against a hung token refresh so the upload can never spin forever with no feedback.
function withTimeout<T>(promise: Promise<T> | undefined, ms: number, message: string): Promise<T | undefined> {
  if (!promise) return Promise.resolve(undefined);
  return new Promise((resolve, reject) => {
    const timer = setTimeout(() => reject(new Error(message)), ms);
    promise.then(
      (value) => {
        clearTimeout(timer);
        resolve(value);
      },
      (err) => {
        clearTimeout(timer);
        reject(err);
      }
    );
  });
}

export function ImageUpload({ value, onChange, folder, aspect = "square", className, getIdToken }: ImageUploadProps) {
  const inputRef = useRef<HTMLInputElement>(null);
  const [loading, setLoading] = useState(false);
  const [progress, setProgress] = useState(0);
  const [error, setError] = useState<string | null>(null);

  async function handleFile(file: File) {
    setLoading(true);
    setProgress(0);
    setError(null);
    try {
      const idToken = await withTimeout(getIdToken?.(), 10_000, "Couldn't verify your session. Try again.");
      const url = await uploadImage(file, folder, { idToken, onProgress: setProgress });
      onChange(url);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Upload failed. Try again.");
    } finally {
      setLoading(false);
    }
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
          {loading ? (
            <div className="absolute inset-0 flex flex-col items-center justify-center gap-2 bg-black/60 text-white">
              <span className="text-xs font-semibold">{progress}%</span>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-white/30">
                <div
                  className="h-full rounded-full bg-white transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => onChange("")}
              aria-label="Remove image"
              className="absolute top-1.5 right-1.5 flex h-6 w-6 items-center justify-center rounded-full bg-black/60 text-white transition-colors hover:bg-black/80"
            >
              <X className="h-3.5 w-3.5" />
            </button>
          )}
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
          {loading ? (
            <>
              <span className="text-xs font-medium">Uploading… {progress}%</span>
              <div className="h-1 w-16 overflow-hidden rounded-full bg-secondary">
                <div
                  className="h-full rounded-full bg-brand-primary transition-[width]"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </>
          ) : (
            <>
              <ImagePlus className="h-5 w-5" />
              <span className="text-xs font-medium">Upload photo</span>
            </>
          )}
        </button>
      )}

      {value && (
        <button
          type="button"
          onClick={() => inputRef.current?.click()}
          disabled={loading}
          className="text-xs font-medium text-brand-primary hover:underline disabled:opacity-50"
        >
          Replace photo
        </button>
      )}

      {error && <p className="text-xs font-medium text-error">{error}</p>}
    </div>
  );
}
