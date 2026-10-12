"use client";

import Image from "next/image";
import Link from "next/link";
import { Leaf, ArrowRight, CheckCircle2 } from "lucide-react";
import { PublicFarmerProduct } from "@/lib/queries/farmerProfile";

interface Props {
  products: PublicFarmerProduct[];
  farmerName?: string;
}

export default function FarmerProductsSection({
  products,
  farmerName = "Farmer",
}: Props) {
  if (!products || products.length === 0) {
    return (
      <section className="py-16 bg-white text-center">
        <p className="text-gray-500">No products available at this time.</p>
      </section>
    );
  }

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-white relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Section Heading */}
        <div className="text-center mb-10 sm:mb-16">
          <span className="text-emerald-700 font-bold uppercase text-xs tracking-wider mb-2 block">
            Farm Fresh Selection
          </span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-emerald-700 via-green-600 to-teal-700 bg-clip-text text-transparent tracking-tight">
            All Products ({products.length})
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            100% authentic produce grown with love by {farmerName}
          </p>
        </div>

        {/* Products Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 sm:gap-8">
          {products.map((product) => {
            const productHref = `/product/${
              product.supabaseProductId || product.id
            }`;

            return (
              <Link
                key={product.id}
                href={productHref}
                className="group relative bg-white rounded-3xl border border-gray-100/90 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Product Image Box */}
                <div className="relative aspect-[4/3] w-full bg-slate-50 overflow-hidden">
                  <Image
                    src={product.image}
                    alt={product.name}
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 25vw"
                    className="object-cover group-hover:scale-110 transition-transform duration-700"
                    unoptimized
                  />

                  {/* Stock Pill on image */}
                  <div className="absolute top-3 left-3">
                    <span className="inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-semibold bg-emerald-500/95 text-white backdrop-blur-xs shadow-xs">
                      <CheckCircle2 className="w-3 h-3" />
                      In Stock
                    </span>
                  </div>

                  {/* Hover Overlay */}
                  <div className="absolute inset-0 bg-emerald-950/30 opacity-0 group-hover:opacity-100 transition-opacity duration-300 flex items-center justify-center p-4">
                    <span className="inline-flex items-center gap-2 px-4 py-2 rounded-xl bg-white text-emerald-800 font-bold text-xs shadow-lg transform translate-y-2 group-hover:translate-y-0 transition-transform">
                      View Details
                      <ArrowRight className="w-3.5 h-3.5" />
                    </span>
                  </div>
                </div>

                {/* Card Content */}
                <div className="p-5 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <h3 className="font-extrabold text-gray-900 text-lg group-hover:text-emerald-700 transition-colors line-clamp-1">
                      {product.name}
                    </h3>
                    <p className="text-xs font-semibold text-gray-400 capitalize mt-0.5">
                      {product.category}
                    </p>
                  </div>

                  {/* Price and Stock status row */}
                  <div>
                    <div className="flex items-baseline justify-between gap-2">
                      <div className="flex items-baseline gap-1">
                        <span className="text-2xl font-black text-emerald-700">
                          ₹{product.price}
                        </span>
                        <span className="text-xs text-gray-500 font-medium">
                          /{product.unit}
                        </span>
                      </div>

                      <span className="inline-flex items-center text-[11px] font-bold text-emerald-800 bg-emerald-50 border border-emerald-100 px-2.5 py-0.5 rounded-full">
                        In Stock
                      </span>
                    </div>

                    {/* Organic Guarantee Tag */}
                    <div className="mt-3 pt-3 border-t border-gray-100 flex items-center gap-1.5 text-xs text-emerald-700 font-semibold">
                      <Leaf className="w-3.5 h-3.5 text-emerald-600" />
                      <span>100% Organic</span>
                    </div>
                  </div>
                </div>
              </Link>
            );
          })}
        </div>
      </div>
    </section>
  );
}
