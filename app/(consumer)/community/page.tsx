import { getCurrentUser } from "@/lib/auth";
import { listPosts } from "@/lib/queries/community";
import PostComposer from "@/components/community/PostComposer";
import PostCard from "@/components/community/PostCard";
import EmptyFeed from "@/components/community/EmptyFeed";

export const metadata = {
    title: "Community — Freshique Farm",
    description: "Share recipes, tips, and stories with the Freshique community",
};

export default async function CommunityPage() {
    const user = await getCurrentUser();
    const { posts } = await listPosts({ limit: 10 });

    return (
        <div className="mx-auto max-w-2xl px-6 py-6">
            {/* Header */}
            <div className="mb-6">
                <h1 className="text-3xl md:text-4xl font-extrabold text-ink-900">
                    Community
                </h1>
                <p className="mt-1 text-sm text-ink-500">
                    Recipes, tips, and stories from Freshique members
                </p>
            </div>

            {/* Composer */}
            <div className="mb-6">
                <PostComposer />
            </div>

            {/* Feed */}
            {posts.length === 0 ? (
                <EmptyFeed />
            ) : (
                <div className="space-y-5">
                    {posts.map((post) => (
                        <PostCard
                            key={post.id}
                            post={post}
                            viewerId={user?.id ?? null}
                        />
                    ))}
                </div>
            )}
        </div>
    );
}