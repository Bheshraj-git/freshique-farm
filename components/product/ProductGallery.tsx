"use client";

import { useState } from "react";
import Image from "next/image";
import { ImageOff } from "lucide-react";
import Badge from "@/components/ui/Badge";
import FavoriteButton from "@/components/favorites/FavoriteButton";
import { cn } from "@/lib/utils";

interface Props {
  images: string[];
  name: string;
  productId: string;
  initialFavorited: boolean;
}

export default function ProductGallery({
  images,
  name,
  productId,
  initialFavorited,
}: Props) {
  const [active, setActive] = useState(0);
  const safeImages = images.length > 0 ? images : [""];
  const current = safeImages[Math.min(active, safeImages.length - 1)];

  return (
    <div className="space-y-4">
      <div className="relative aspect-square rounded-3xl overflow-hidden bg-white border border-brand-50 shadow-card">
        <div className="absolute top-4 left-4 z-10">
          <Badge tone="success" size="md">
            FRESH HARVEST
          </Badge>
        </div>

        {/* Heart — top right */}
        <FavoriteButton
          productId={productId}
          initialFavorited={initialFavorited}
          className="absolute top-4 right-4 z-10"
        />

        {current ? (
          <Image
            src={current}
            alt={name}
            fill
            sizes="(max-width: 1024px) 100vw, 50vw"
            className="object-cover"
            priority
          />
        ) : (
          <div className="grid place-items-center h-full w-full text-brand-300">
            <ImageOff className="h-12 w-12" />
          </div>
        )}
      </div>

      {safeImages.length > 1 && (
        <div className="flex gap-3">
          {safeImages.map((url, i) => (
            <button
              key={i}
              type="button"
              onClick={() => setActive(i)}
              aria-label={`View image ${i + 1}`}
              className={cn(
                "relative h-16 w-16 rounded-xl overflow-hidden border-2 transition",
                i === active
                  ? "border-brand-600"
                  : "border-brand-100 hover:border-brand-300"
              )}
            >
              <Image
                src={url}
                alt=""
                fill
                sizes="64px"
                className="object-cover"
              />
            </button>
          ))}
        </div>
      )}
    </div>
  );
}