import CommentRow from "./CommentRow";
import CommentForm from "./CommentForm";
import { listComments } from "@/lib/queries/community";

interface Props {
    postId: string;
    viewerId: string | null;
}

export default async function CommentList({ postId, viewerId }: Props) {
    const comments = await listComments(postId);

    return (
        <div className="mt-4 pt-4 border-t border-brand-50">
            {comments.length > 0 && (
                <div className="mb-3">
                    {comments.map((c) => (
                        <CommentRow key={c.id} comment={c} viewerId={viewerId} />
                    ))}
                </div>
            )}

            <CommentForm postId={postId} />
        </div>
    );
}