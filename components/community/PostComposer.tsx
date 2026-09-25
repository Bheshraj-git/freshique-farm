"use client";

import { useActionState, useEffect, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import Image from "next/image";
import { Send, ImagePlus, X } from "lucide-react";
import {
    createPostAction,
    type CommunityActionResult,
} from "@/app/(consumer)/community/actions";
import { useUser } from "@/lib/hooks/useUser";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

const MAX_SIZE = 3 * 1024 * 1024;
const ALLOWED = ["image/jpeg", "image/png", "image/webp"];

export default function PostComposer() {
    const router = useRouter();
    const { user, profile } = useUser();
    const { push } = useToast();

    const [state, formAction, isPending] = useActionState(
        createPostAction,
        undefined
    );
    const [preview, setPreview] = useState<string | null>(null);
    const inputRef = useRef<HTMLInputElement>(null);
    const formRef = useRef<HTMLFormElement>(null);

    useEffect(() => {
        if (state?.ok) {
            push("success", "Post shared");
            setPreview(null);
            formRef.current?.reset();
            router.refresh();
        }
    }, [state?.ok, push, router]);

    // Not logged in → prompt
    if (!user) {
        return (
            <div className="rounded-2xl bg-white border border-brand-50 shadow-card p-5 text-center">
                <p className="text-sm text-ink-500">
                    <a
                        href="/login?next=%2Fcommunity"
                        className="font-bold text-brand-700 hover:text-brand-800"
                    >
                        Log in
                    </a>{" "}
                    to share with the community
                </p>
            </div>
        );
    }

    function handleFile(e: React.ChangeEvent<HTMLInputElement>) {
        const file = e.target.files?.[0];
        if (!file) return;
        if (!ALLOWED.includes(file.type)) {
            push("error", "Only JPG, PNG, or WebP allowed");
            if (inputRef.current) inputRef.current.value = "";
            return;
        }
        if (file.size > MAX_SIZE) {
            push("error", "Image must be under 3 MB");
            if (inputRef.current) inputRef.current.value = "";
            return;
        }
        if (preview) URL.revokeObjectURL(preview);
        setPreview(URL.createObjectURL(file));
    }

    function clearImage() {
        if (preview) URL.revokeObjectURL(preview);
        setPreview(null);
        if (inputRef.current) inputRef.current.value = "";
    }

    const initials =
        profile?.full_name
            ?.split(" ")
            .map((n) => n[0])
            .slice(0, 2)
            .join("")
            .toUpperCase() || "U";

    return (
        <form
            ref={formRef}
            action={formAction}
            className="rounded-2xl bg-white border border-brand-50 shadow-card p-5"
        >
            <div className="flex gap-4">
                {/* Avatar */}
                <div className="relative h-10 w-10 rounded-full overflow-hidden bg-brand-100 shrink-0">
                    {profile?.avatar_url ? (
                        <Image
                            src={profile.avatar_url}
                            alt={profile.full_name}
                            fill
                            sizes="40px"
                            className="object-cover"
                            unoptimized
                        />
                    ) : (
                        <span className="grid place-items-center h-full w-full text-sm font-bold text-brand-700">
                            {initials}
                        </span>
                    )}
                </div>

                {/* Textarea + controls */}
                <div className="flex-1 min-w-0">
                    <textarea
                        name="content"
                        rows={3}
                        placeholder="Share a recipe, farming tip, or something you grew…"
                        maxLength={1000}
                        className="w-full rounded-xl border border-brand-100 bg-brand-50/30 px-4 py-3 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:bg-white focus:outline-none resize-none"
                    />

                    {preview && (
                        <div className="relative mt-3 h-40 rounded-xl overflow-hidden bg-brand-50">
                            <Image
                                src={preview}
                                alt="Preview"
                                fill
                                sizes="600px"
                                className="object-cover"
                                unoptimized
                            />
                            <button
                                type="button"
                                onClick={clearImage}
                                aria-label="Remove image"
                                className="absolute top-2 right-2 grid place-items-center h-8 w-8 rounded-full bg-black/60 text-white hover:bg-black/80 transition"
                            >
                                <X className="h-4 w-4" />
                            </button>
                        </div>
                    )}

                    {state?.fieldErrors?.content && (
                        <p className="mt-2 text-xs text-danger-600 font-medium">
                            {state.fieldErrors.content}
                        </p>
                    )}
                    {state?.error && state.error !== "NOT_AUTHENTICATED" && (
                        <p className="mt-2 text-xs text-danger-600 font-medium">
                            {state.error}
                        </p>
                    )}

                    <div className="flex items-center justify-between gap-3 mt-3">
                        {/* File input */}
                        <label
                            className={cn(
                                "inline-flex items-center gap-2 rounded-xl px-3.5 py-2 text-xs font-bold text-brand-700 bg-brand-50 hover:bg-brand-100 cursor-pointer transition",
                                isPending && "opacity-50 pointer-events-none"
                            )}
                        >
                            <ImagePlus className="h-3.5 w-3.5" />
                            Add Photo
                            <input
                                ref={inputRef}
                                type="file"
                                name="image"
                                accept="image/jpeg,image/png,image/webp"
                                onChange={handleFile}
                                className="hidden"
                            />
                        </label>

                        {/* Submit */}
                        <button
                            type="submit"
                            disabled={isPending}
                            className={cn(
                                "inline-flex items-center gap-2 rounded-xl bg-brand-600 px-5 py-2.5 text-sm font-bold text-white shadow-card hover:bg-brand-700 active:scale-95 transition",
                                isPending && "opacity-70 cursor-wait"
                            )}
                        >
                            <Send className="h-3.5 w-3.5" />
                            {isPending ? "Posting..." : "Share"}
                        </button>
                    </div>
                </div>
            </div>
        </form>
    );
}