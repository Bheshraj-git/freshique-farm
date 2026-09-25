import AuthorAvatar from "./AuthorAvatar";
import CommentDeleteButton from "./CommentDeleteButton";
import { timeAgo } from "@/lib/utils";
import type { CommunityComment } from "@/lib/queries/community";

interface Props {
    comment: CommunityComment;
    viewerId: string | null;
}

export default function CommentRow({ comment, viewerId }: Props) {
    const isOwner = viewerId === comment.author.id;

    return (
        <div className="flex items-start gap-3 py-3 border-b border-brand-50 last:border-b-0">
            <div className="flex-1 min-w-0">
                <AuthorAvatar
                    author={comment.author}
                    size="sm"
                    timestamp={timeAgo(comment.created_at)}
                />
                <p className="mt-1.5 text-sm text-ink-700 whitespace-pre-wrap break-words">
                    {comment.content}
                </p>
            </div>
            {isOwner && (
                <CommentDeleteButton commentId={comment.id} />
            )}
        </div>
    );
}