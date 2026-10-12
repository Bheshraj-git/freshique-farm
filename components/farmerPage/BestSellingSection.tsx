"use client";

import Image from "next/image";
import Link from "next/link";
import { useRef, useState } from "react";
import { ChevronLeft, ChevronRight, TrendingUp } from "lucide-react";
import { PublicFarmerProduct } from "@/lib/queries/farmerProfile";

interface Props {
  products: PublicFarmerProduct[];
}

export default function BestSellingSection({ products }: Props) {
  const scrollRef = useRef<HTMLDivElement>(null);
  const [activeIndex, setActiveIndex] = useState(0);

  if (!products || products.length === 0) return null;

  const handleScroll = () => {
    if (!scrollRef.current) return;
    const { scrollLeft, scrollWidth, clientWidth } = scrollRef.current;
    const maxScroll = scrollWidth - clientWidth;
    if (maxScroll <= 0) return;
    const ratio = scrollLeft / maxScroll;
    const nextIdx = Math.min(
      Math.floor(ratio * products.length),
      products.length - 1
    );
    setActiveIndex(nextIdx);
  };

  const scroll = (direction: "left" | "right") => {
    if (!scrollRef.current) return;
    const offset = 260;
    scrollRef.current.scrollBy({
      left: direction === "left" ? -offset : offset,
      behavior: "smooth",
    });
  };

  return (
    <section className="py-12 sm:py-16 md:py-20 bg-slate-50/70 border-b border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-8 sm:mb-12">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-emerald-50 text-emerald-700 text-xs font-bold uppercase tracking-wider mb-2">
            <TrendingUp className="w-3.5 h-3.5" />
            <span>Customer Favorites</span>
          </div>
          <h2 className="text-2xl sm:text-3xl md:text-4xl font-black bg-gradient-to-r from-emerald-600 via-teal-600 to-emerald-700 bg-clip-text text-transparent tracking-tight">
            Best Selling Products
          </h2>
        </div>

        {/* Carousel Container */}
        <div className="relative group">
          {/* Scroll buttons for larger screens */}
          {products.length > 4 && (
            <>
              <button
                onClick={() => scroll("left")}
                aria-label="Scroll left"
                className="hidden lg:flex absolute -left-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-emerald-700 shadow-lg border border-gray-100 items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronLeft className="w-5 h-5" />
              </button>
              <button
                onClick={() => scroll("right")}
                aria-label="Scroll right"
                className="hidden lg:flex absolute -right-4 top-1/2 -translate-y-1/2 z-20 w-10 h-10 rounded-full bg-white/95 hover:bg-white text-gray-700 hover:text-emerald-700 shadow-lg border border-gray-100 items-center justify-center transition-all opacity-0 group-hover:opacity-100"
              >
                <ChevronRight className="w-5 h-5" />
              </button>
            </>
          )}

          {/* Cards Scroll Row / Grid */}
          <div
            ref={scrollRef}
            onScroll={handleScroll}
            className="flex sm:grid sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4 sm:gap-6 overflow-x-auto sm:overflow-visible pb-4 sm:pb-0 scrollbar-none snap-x snap-mandatory"
          >
            {products.map((product, idx) => {
              const productHref = `/product/${
                product.supabaseProductId || product.id
              }`;

              return (
                <Link
                  key={product.id}
                  href={productHref}
                  className="flex-shrink-0 w-44 sm:w-auto snap-center group/card block"
                >
                  <div className="bg-white rounded-2xl border border-gray-100 shadow-sm hover:shadow-xl hover:-translate-y-1.5 transition-all duration-300 overflow-hidden flex flex-col h-full">
                    {/* Image with Rank Badge */}
                    <div className="relative aspect-square w-full overflow-hidden bg-slate-100">
                      <Image
                        src={product.image}
                        alt={product.name}
                        fill
                        sizes="(max-width: 640px) 176px, (max-width: 1024px) 240px, 200px"
                        className="object-cover group-hover/card:scale-108 transition-transform duration-500"
                        unoptimized
                      />

                      {/* Rank Badge in top right (#1, #2, etc.) */}
                      <div className="absolute top-2.5 right-2.5 bg-gradient-to-r from-amber-400 to-yellow-400 text-yellow-950 text-xs font-black px-2.5 py-0.5 rounded-full shadow-md shadow-yellow-900/10">
                        #{idx + 1}
                      </div>
                    </div>

                    {/* Card Content */}
                    <div className="p-3.5 text-center flex-1 flex flex-col justify-between">
                      <h4 className="font-bold text-gray-800 text-sm line-clamp-1 group-hover/card:text-emerald-700 transition-colors">
                        {product.name}
                      </h4>
                      <p className="text-xs text-emerald-700/80 font-semibold mt-1">
                        {product.soldCount > 0
                          ? `${product.soldCount} sold`
                          : "Popular choice"}
                      </p>
                    </div>
                  </div>
                </Link>
              );
            })}
          </div>

          {/* Pagination indicators on mobile */}
          <div className="flex sm:hidden justify-center items-center gap-1.5 mt-3">
            {products.slice(0, 5).map((_, i) => (
              <span
                key={i}
                className={`h-1.5 rounded-full transition-all duration-300 ${
                  i === activeIndex
                    ? "w-5 bg-emerald-600"
                    : "w-1.5 bg-gray-300"
                }`}
              />
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
