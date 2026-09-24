"use client";

import { useRef, useState, useEffect } from "react";
import Image from "next/image";
import { ImagePlus, X } from "lucide-react";

interface Props {
    initialUrl?: string | null;
}

const MAX_SIZE = 5 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function ProductImageUpload({ initialUrl }: Props) {
    const inputRef = useRef<HTMLInputElement>(null);
    const [preview, setPreview] = useState<string | null>(initialUrl ?? null);
    const [error, setError] = useState<string | null>(null);

    useEffect(() => {
        return () => {
            if (preview && preview.startsWith("blob:")) {
                URL.revokeObjectURL(preview);
            }
        };
    }, [preview]);

    function handleChange(e: React.ChangeEvent<HTMLInputElement>) {
        setError(null);
        const file = e.target.files?.[0];
        if (!file) return;

        if (!ALLOWED.includes(file.type)) {
            setError("Only JPG, PNG, or WebP allowed");
            if (inputRef.current) inputRef.current.value = "";
            return;
        }
        if (file.size > MAX_SIZE) {
            setError("Max file size is 5 MB");
            if (inputRef.current) inputRef.current.value = "";
            return;
        }
        setPreview(URL.createObjectURL(file));
    }

    function clear() {
        if (inputRef.current) inputRef.current.value = "";
        setPreview(null);
    }

    return (
        <div>
            <label className="text-sm font-semibold text-ink-900 mb-2 block">
                Product Image
            </label>

            <div className="flex items-start gap-4">
                <div className="relative h-32 w-32 rounded-xl overflow-hidden bg-brand-50 border border-brand-100 shrink-0">
                    {preview ? (
                        <>
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                sizes="128px"
                                className="object-cover"
                                unoptimized
                            />
                            <button
                                type="button"
                                onClick={clear}
                                aria-label="Remove image"
                                className="absolute top-1.5 right-1.5 grid place-items-center h-6 w-6 rounded-full bg-danger-600 text-white"
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
                        name="image"
                        accept="image/jpeg,image/png,image/webp"
                        onChange={handleChange}
                        className="block w-full text-sm text-ink-500 file:mr-4 file:rounded-xl file:border-0 file:bg-brand-600 file:px-4 file:py-2 file:text-sm file:font-semibold file:text-white hover:file:bg-brand-700 file:cursor-pointer"
                    />
                    <p className="mt-2 text-xs text-ink-500">
                        JPG, PNG, or WebP — max 5 MB. Leave empty to keep current image on
                        edit.
                    </p>
                    {error && (
                        <p className="mt-1 text-xs text-danger-600 font-medium">{error}</p>
                    )}
                </div>
            </div>
        </div>
    );
}