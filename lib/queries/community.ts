import { createClient } from "@/lib/supabase/server";

export interface PostAuthor {
    id: string;
    full_name: string;
    avatar_url: string | null;
    role: "consumer" | "farmer";
}

export interface CommunityPost {
    id: string;
    content: string;
    image_url: string | null;
    created_at: string;
    author: PostAuthor;
    comment_count: number;
}

export interface CommunityComment {
    id: string;
    post_id: string;
    content: string;
    created_at: string;
    author: PostAuthor;
}

interface ListPostsOptions {
    limit?: number;
    offset?: number;
}

/**
 * Fetch a page of posts, newest first. Includes author + comment count.
 */
export async function listPosts(
    options: ListPostsOptions = {}
): Promise<{ posts: CommunityPost[]; hasMore: boolean }> {
    const limit = options.limit ?? 10;
    const offset = options.offset ?? 0;

    const supabase = await createClient();

    const { data, error, count } = await supabase
        .from("community_posts")
        .select(
            `
      id,
      content,
      image_url,
      created_at,
      author:profiles!community_posts_author_id_fkey(id, full_name, avatar_url, role),
      comments:community_comments(count)
    `,
            { count: "exact" }
        )
        .order("created_at", { ascending: false })
        .range(offset, offset + limit - 1);

    if (error || !data) return { posts: [], hasMore: false };

    const posts: CommunityPost[] = data.map((row: any) => {
        const commentCount =
            Array.isArray(row.comments) && row.comments[0]?.count
                ? Number(row.comments[0].count)
                : 0;

        return {
            id: row.id,
            content: row.content,
            image_url: row.image_url,
            created_at: row.created_at,
            author: {
                id: row.author.id,
                full_name: row.author.full_name,
                avatar_url: row.author.avatar_url,
                role: row.author.role,
            },
            comment_count: commentCount,
        };
    });

    const totalFetched = offset + posts.length;
    const hasMore = typeof count === "number" ? totalFetched < count : false;

    return { posts, hasMore };
}

/**
 * Fetch comments for a single post, oldest first.
 */
export async function listComments(
    postId: string
): Promise<CommunityComment[]> {
    const supabase = await createClient();

    const { data, error } = await supabase
        .from("community_comments")
        .select(
            `
      id,
      post_id,
      content,
      created_at,
      author:profiles!community_comments_author_id_fkey(id, full_name, avatar_url, role)
    `
        )
        .eq("post_id", postId)
        .order("created_at", { ascending: true });

    if (error || !data) return [];

    return data.map((row: any) => ({
        id: row.id,
        post_id: row.post_id,
        content: row.content,
        created_at: row.created_at,
        author: {
            id: row.author.id,
            full_name: row.author.full_name,
            avatar_url: row.author.avatar_url,
            role: row.author.role,
        },
    }));
}