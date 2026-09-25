import Image from "next/image";
import AuthorAvatar from "./AuthorAvatar";
import PostActions from "./PostActions";
import CommentList from "./CommentList";
import { timeAgo } from "@/lib/utils";
import { MessageCircle } from "lucide-react";
import type { CommunityPost } from "@/lib/queries/community";

interface Props {
    post: CommunityPost;
    viewerId: string | null;
}

export default function PostCard({ post, viewerId }: Props) {
    const isOwner = viewerId === post.author.id;

    return (
        <article className="rounded-2xl bg-white border border-brand-50 shadow-card overflow-hidden">
            {/* Header */}
            <div className="px-5 pt-5 pb-3 flex items-start justify-between gap-3">
                <AuthorAvatar
                    author={post.author}
                    timestamp={timeAgo(post.created_at)}
                />
                {isOwner && <PostActions postId={post.id} />}
            </div>

            {/* Body */}
            <div className="px-5 pb-4">
                {post.content && (
                    <p className="text-sm md:text-base text-ink-800 whitespace-pre-wrap break-words leading-relaxed">
                        {post.content}
                    </p>
                )}

                {post.image_url && (
                    <div className="relative mt-3 rounded-xl overflow-hidden bg-brand-50 aspect-video">
                        <Image
                            src={post.image_url}
                            alt="Post image"
                            fill
                            sizes="(max-width: 768px) 100vw, 600px"
                            className="object-cover"
                        />
                    </div>
                )}
            </div>

            {/* Comments — collapsible via native <details> */}
            <details className="group border-t border-brand-50">
                <summary className="flex items-center gap-2 px-5 py-3 cursor-pointer text-sm font-semibold text-ink-700 hover:bg-brand-50/50 list-none">
                    <MessageCircle className="h-4 w-4 text-brand-600" />
                    {post.comment_count}{" "}
                    {post.comment_count === 1 ? "comment" : "comments"}
                    <span className="ml-auto text-xs text-ink-400 group-open:rotate-180 transition-transform">
                        ▾
                    </span>
                </summary>

                <div className="px-5 pb-5 bg-brand-50/20">
                    <CommentList postId={post.id} viewerId={viewerId} />
                </div>
            </details>
        </article>
    );
}