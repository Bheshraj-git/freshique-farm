"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { X } from "lucide-react";
import { deleteCommentAction } from "@/app/(consumer)/community/actions";
import { useToast } from "@/lib/toast";

interface Props {
    commentId: string;
}

export default function CommentDeleteButton({ commentId }: Props) {
    const router = useRouter();
    const { push } = useToast();
    const [busy, setBusy] = useState(false);

    async function handleDelete() {
        setBusy(true);
        const result = await deleteCommentAction(commentId);
        setBusy(false);
        if (!result.ok) {
            push("error", result.error || "Could not delete");
            return;
        }
        router.refresh();
    }

    return (
        <button
            type="button"
            onClick={handleDelete}
            disabled={busy}
            aria-label="Delete comment"
            className="grid place-items-center h-6 w-6 rounded-md text-ink-400 hover:text-danger-600 hover:bg-danger-500/10 transition disabled:opacity-50"
        >
            <X className="h-3.5 w-3.5" />
        </button>
    );
}