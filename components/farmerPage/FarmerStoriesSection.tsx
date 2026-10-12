"use client";

import Image from "next/image";
import { useState } from "react";
import { BookOpen, Calendar, Heart, X, Sparkles } from "lucide-react";
import { PublicFarmerBlog } from "@/lib/queries/farmerProfile";

interface Props {
  blogs: PublicFarmerBlog[];
}

export default function FarmerStoriesSection({ blogs }: Props) {
  const [selectedBlog, setSelectedBlog] = useState<PublicFarmerBlog | null>(null);
  const [likesMap, setLikesMap] = useState<Record<string, number>>({});
  const [hasLikedMap, setHasLikedMap] = useState<Record<string, boolean>>({});

  if (!blogs || blogs.length === 0) return null;

  const formatDate = (dateStr: string) => {
    try {
      const d = new Date(dateStr);
      return d.toLocaleDateString("en-IN", {
        day: "numeric",
        month: "short",
      });
    } catch {
      return "Recent";
    }
  };

  const getValidImageUrl = (url: string, title = "") => {
    if (!url || url.includes("pollinations.ai") || url.includes("pollinations")) {
      return title.toLowerCase().includes("mango")
        ? "https://images.unsplash.com/photo-1595974482597-4b8da8879bc5?q=80&w=1200&auto=format&fit=crop"
        : "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop";
    }
    return url;
  };

  const handleToggleLike = (e: React.MouseEvent, blogId: string, initialLikes = 0) => {
    e.stopPropagation();
    const currentLiked = hasLikedMap[blogId];
    setHasLikedMap((prev) => ({ ...prev, [blogId]: !currentLiked }));
    setLikesMap((prev) => {
      const current = prev[blogId] ?? initialLikes;
      return { ...prev, [blogId]: currentLiked ? current - 1 : current + 1 };
    });
  };

  return (
    <section className="py-12 sm:py-16 md:py-24 bg-slate-50/60 border-t border-gray-100 relative">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        {/* Heading */}
        <div className="text-center mb-10 sm:mb-14">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-teal-50 text-teal-700 text-xs font-bold uppercase tracking-wider mb-2">
            <BookOpen className="w-3.5 h-3.5" />
            <span>Wisdom From the Ground</span>
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black bg-gradient-to-r from-teal-700 via-emerald-600 to-cyan-700 bg-clip-text text-transparent tracking-tight">
            Farming Stories & Tips
          </h2>
          <p className="mt-2 text-sm sm:text-base text-gray-500 max-w-xl mx-auto">
            Practical knowledge, sustainable growing tips, and authentic experiences
          </p>
        </div>

        {/* Stories Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
          {blogs.map((blog) => {
            const currentLikes = likesMap[blog.id] ?? (blog.likesCount || 12);
            const isLiked = hasLikedMap[blog.id] ?? false;

            return (
              <div
                key={blog.id}
                onClick={() => setSelectedBlog(blog)}
                className="group cursor-pointer bg-white rounded-3xl border border-gray-100 shadow-sm hover:shadow-2xl hover:-translate-y-2 transition-all duration-300 overflow-hidden flex flex-col h-full"
              >
                {/* Image Cover */}
                <div className="relative aspect-video w-full overflow-hidden bg-slate-100">
                  <Image
                    src={getValidImageUrl(blog.image, blog.title)}
                    alt={blog.title}
                    fill
                    sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                    className="object-cover group-hover:scale-108 transition-transform duration-700"
                    unoptimized
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/60 via-transparent to-transparent" />

                  {/* Date badge */}
                  <div className="absolute bottom-3 left-3 flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-black/60 backdrop-blur-md text-white text-xs font-semibold">
                    <Calendar className="w-3.5 h-3.5 text-amber-300" />
                    <span>{formatDate(blog.createdAt)}</span>
                  </div>

                  {/* Quick read pill */}
                  <div className="absolute top-3 right-3 opacity-0 group-hover:opacity-100 transition-opacity">
                    <span className="px-3 py-1 rounded-full bg-white/90 text-emerald-800 text-xs font-bold backdrop-blur-xs shadow-sm">
                      Read Article
                    </span>
                  </div>
                </div>

                {/* Content */}
                <div className="p-6 flex flex-col flex-1 justify-between space-y-4">
                  <div>
                    <h3 className="text-xl font-bold text-gray-900 group-hover:text-emerald-700 transition-colors line-clamp-2">
                      {blog.title}
                    </h3>
                    <p className="mt-2 text-sm text-gray-600 line-clamp-3 leading-relaxed whitespace-pre-line">
                      {blog.description}
                    </p>
                  </div>

                  {/* Footer: Author & Likes */}
                  <div className="pt-4 border-t border-gray-100 flex items-center justify-between">
                    <div className="flex items-center gap-3">
                      <div className="relative w-10 h-10 rounded-full overflow-hidden ring-2 ring-emerald-100">
                        <Image
                          src={
                            blog.authorAvatar && !blog.authorAvatar.includes("chs5mh6tnxh72cj0p4ej")
                              ? blog.authorAvatar
                              : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                                  blog.authorName || "Farmer"
                                )}&background=047857&color=fff&size=160&bold=true`
                          }
                          alt={blog.authorName}
                          fill
                          sizes="40px"
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                      <div>
                        <p className="text-sm font-bold text-gray-900 line-clamp-1">
                          {blog.authorName}
                        </p>
                        <p className="text-xs text-gray-500 font-medium">
                          {blog.authorRole || "Farmer & Blogger"}
                        </p>
                      </div>
                    </div>

                    <button
                      type="button"
                      onClick={(e) => handleToggleLike(e, blog.id, blog.likesCount)}
                      className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full text-xs font-semibold transition-all ${
                        isLiked
                          ? "bg-rose-50 text-rose-600"
                          : "bg-gray-100 hover:bg-gray-200 text-gray-600"
                      }`}
                    >
                      <Heart
                        className={`w-3.5 h-3.5 ${
                          isLiked ? "fill-rose-500 text-rose-500" : ""
                        }`}
                      />
                      <span>{currentLikes}</span>
                    </button>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Reader Modal */}
      {selectedBlog && (
        <div
          role="dialog"
          aria-modal="true"
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/60 backdrop-blur-sm animate-in fade-in duration-200"
          onClick={() => setSelectedBlog(null)}
        >
          <div
            className="relative w-full max-w-2xl max-h-[90vh] bg-white rounded-3xl shadow-2xl overflow-hidden flex flex-col"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Modal Header Image */}
            <div className="relative aspect-video w-full bg-slate-800">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={getValidImageUrl(selectedBlog.image, selectedBlog.title)}
                alt={selectedBlog.title}
                onError={(e) => {
                  (e.target as HTMLImageElement).src =
                    "https://images.unsplash.com/photo-1523348837708-15d4a09cfac2?q=80&w=1200&auto=format&fit=crop";
                }}
                className="w-full h-full object-cover"
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/30 to-transparent" />

              {/* Close Button */}
              <button
                onClick={() => setSelectedBlog(null)}
                aria-label="Close modal"
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-black/50 hover:bg-black/70 text-white flex items-center justify-center transition-all"
              >
                <X className="w-5 h-5" />
              </button>

              <div className="absolute bottom-4 left-5 right-5 text-white">
                <span className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-md bg-emerald-600/90 text-white text-xs font-bold mb-2">
                  <Sparkles className="w-3 h-3" />
                  Farm Guide
                </span>
                <h3 className="text-xl sm:text-2xl font-black leading-snug text-white drop-shadow-md">
                  {selectedBlog.title}
                </h3>
              </div>
            </div>

            {/* Modal Scrollable Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1">
              {/* Author row */}
              <div className="flex items-center justify-between pb-4 border-b border-gray-100">
                <div className="flex items-center gap-3">
                  <div className="relative w-11 h-11 rounded-full overflow-hidden ring-2 ring-emerald-200">
                    <Image
                      src={
                        selectedBlog.authorAvatar && !selectedBlog.authorAvatar.includes("chs5mh6tnxh72cj0p4ej")
                          ? selectedBlog.authorAvatar
                          : `https://ui-avatars.com/api/?name=${encodeURIComponent(
                              selectedBlog.authorName || "Farmer"
                            )}&background=047857&color=fff&size=160&bold=true`
                      }
                      alt={selectedBlog.authorName}
                      fill
                      sizes="44px"
                      className="object-cover"
                      unoptimized
                    />
                  </div>
                  <div>
                    <p className="font-bold text-gray-900">
                      {selectedBlog.authorName}
                    </p>
                    <p className="text-xs text-gray-500">
                      {selectedBlog.authorRole || "Farmer & Blogger"} •{" "}
                      {formatDate(selectedBlog.createdAt)}
                    </p>
                  </div>
                </div>
              </div>

              {/* Article text */}
              <div className="text-gray-700 leading-relaxed text-sm sm:text-base space-y-4 whitespace-pre-line font-normal">
                {selectedBlog.description}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="px-6 py-4 bg-gray-50 border-t border-gray-100 flex items-center justify-between">
              <span className="text-xs text-gray-500 font-medium">
                Freshique Farm Community Wisdom
              </span>
              <button
                onClick={() => setSelectedBlog(null)}
                className="px-5 py-2 rounded-xl bg-emerald-700 hover:bg-emerald-800 text-white font-bold text-sm transition-all"
              >
                Close
              </button>
            </div>
          </div>
        </div>
      )}
    </section>
  );
}
