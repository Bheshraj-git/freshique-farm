"use client";

import { useActionState, useEffect, useRef } from "react";
import { useRouter } from "next/navigation";
import { Send } from "lucide-react";
import {
    createCommentAction,
    type CommunityActionResult,
} from "@/app/(consumer)/community/actions";
import { useUser } from "@/lib/hooks/useUser";
import { useToast } from "@/lib/toast";
import { cn } from "@/lib/utils";

interface Props {
    postId: string;
}

export default function CommentForm({ postId }: Props) {
    const router = useRouter();
    const { user } = useUser();
    const { push } = useToast();
    const formRef = useRef<HTMLFormElement>(null);

    const [state, formAction, isPending] = useActionState(
        createCommentAction,
        undefined
    );

    useEffect(() => {
        if (state?.ok) {
            formRef.current?.reset();
            router.refresh();
        }
    }, [state?.ok, router]);

    if (!user) {
        return (
            <p className="text-xs text-ink-500 py-2">
                <a
                    href="/login?next=%2Fcommunity"
                    className="font-bold text-brand-700 hover:text-brand-800"
                >
                    Log in
                </a>{" "}
                to comment
            </p>
        );
    }

    return (
        <form ref={formRef} action={formAction} className="flex items-start gap-2">
            <input type="hidden" name="post_id" value={postId} />
            <input
                name="content"
                type="text"
                placeholder="Write a comment…"
                maxLength={500}
                autoComplete="off"
                className="flex-1 rounded-xl border border-brand-100 bg-brand-50/30 px-3.5 py-2 text-sm text-ink-900 placeholder:text-ink-500 focus:border-brand-500 focus:bg-white focus:outline-none transition"
            />
            <button
                type="submit"
                disabled={isPending}
                aria-label="Post comment"
                className={cn(
                    "grid place-items-center h-9 w-9 rounded-xl bg-brand-600 text-white shadow-card hover:bg-brand-700 active:scale-95 transition",
                    isPending && "opacity-60 cursor-wait"
                )}
            >
                <Send className="h-3.5 w-3.5" />
            </button>
        </form>
    );
}