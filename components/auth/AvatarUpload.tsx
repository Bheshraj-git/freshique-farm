"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";
import { cn } from "@/lib/utils";

const MAX_SIZE = 2 * 1024 * 1024; // 2 MB
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function AvatarUpload() {
  const inputRef = useRef<HTMLInputElement>(null);
  const [preview, setPreview] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);

  // Revoke object URLs when preview changes to avoid memory leaks
  useEffect(() => {
    return () => {
      if (preview) URL.revokeObjectURL(preview);
    };
  }, [preview]);

  function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
    setError(null);
    const file = e.target.files?.[0];
    if (!file) {
      setPreview(null);
      return;
    }
    if (!ALLOWED.includes(file.type)) {
      setError("Only JPG, PNG, or WebP allowed");
      if (inputRef.current) inputRef.current.value = "";
      setPreview(null);
      return;
    }
    if (file.size > MAX_SIZE) {
      setError("Max file size is 2 MB");
      if (inputRef.current) inputRef.current.value = "";
      setPreview(null);
      return;
    }
    setPreview(URL.createObjectURL(file));
  }

  function clear() {
    if (inputRef.current) inputRef.current.value = "";
    setPreview(null);
    setError(null);
  }

  return (
    <div className="flex flex-col gap-3">
      <label className="text-sm font-semibold text-ink-900">
        Profile Picture (Optional)
      </label>

      <div className="flex items-center gap-5">
        <div className="relative h-24 w-24 rounded-full overflow-hidden bg-brand-50 ring-4 ring-white shadow-card">
          {preview ? (
            <>
              <Image src={preview} alt="Preview" fill className="object-cover" unoptimized />
              <button
                type="button"
                onClick={clear}
                aria-label="Remove picture"
                className="absolute top-0 right-0 grid place-items-center h-6 w-6 rounded-full bg-danger-600 text-white text-xs shadow"
              >
                <X className="h-3 w-3" />
              </button>
            </>
          ) : (
            <div className="grid place-items-center h-full w-full text-brand-300">
              <ImagePlus className="h-8 w-8" />
            </div>
          )}
        </div>

        <div className="flex-1">
          <input
            ref={inputRef}
            type="file"
            name="avatar"
            accept="image/jpeg,image/png,image/webp"
            onChange={handleChange}
            className="block w-full text-sm text-ink-500 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700 file:cursor-pointer"
          />
          <p className="mt-2 text-xs text-ink-500">
            JPG, PNG, or WebP — max 2 MB
          </p>
          {error && (
            <p className="mt-1 text-xs text-danger-600 font-medium">{error}</p>
          )}
        </div>
      </div>
    </div>
  );
}