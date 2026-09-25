"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Trash2 } from "lucide-react";
import { deletePostAction } from "@/app/(consumer)/community/actions";
import { useToast } from "@/lib/toast";

interface Props {
    postId: string;
}

export default function PostActions({ postId }: Props) {
    const router = useRouter();
    const { push } = useToast();
    const [busy, setBusy] = useState(false);

    async function handleDelete() {
        if (!window.confirm("Delete this post? This cannot be undone.")) return;
        setBusy(true);
        const result = await deletePostAction(postId);
        setBusy(false);
        if (!result.ok) {
            push("error", result.error || "Could not delete");
            return;
        }
        push("success", "Post deleted");
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            aria-label="Delete post"
            className="grid place-items-center h-8 w-8 rounded-lg text-ink-500 hover:text-danger-600 hover:bg-danger-500/10 transition disabled:opacity-50"
        >
            <Trash2 className="h-4 w-4" />
        </button>
    );
}