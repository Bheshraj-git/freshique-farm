"use server";

import { revalidatePath } from "next/cache";
import { createClient } from "@/lib/supabase/server";
import { z } from "zod";

const postSchema = z.object({
    content: z
        .string()
        .trim()
        .min(1, "Post cannot be empty")
        .max(1000, "Post is too long (max 1000 characters)"),
});

const commentSchema = z.object({
    post_id: z.string().uuid(),
    content: z
        .string()
        .trim()
        .min(1, "Comment cannot be empty")
        .max(500, "Comment is too long (max 500 characters)"),
});

export interface CommunityActionResult {
    ok: boolean;
    error?: string;
    fieldErrors?: Record<string, string>;
}

async function getAuthenticatedUser() {
    const supabase = await createClient();
    const {
        data: { user },
    } = await supabase.auth.getUser();
    return { supabase, user };
}

/**
 * Create a new community post with optional image.
 */
export async function createPostAction(
    _prev: CommunityActionResult | undefined,
    formData: FormData
): Promise<CommunityActionResult> {
    const { supabase, user } = await getAuthenticatedUser();
    if (!user) return { ok: false, error: "NOT_AUTHENTICATED" };

    const parsed = postSchema.safeParse({
        content: String(formData.get("content") || ""),
    });

    const file = formData.get("image") as File | null;

    // Content may be empty IF an image is provided
    if (!parsed.success) {
        const hasImage = file && file.size > 0;
        if (!hasImage) {
            const fieldErrors: Record<string, string> = {};
            for (const issue of parsed.error.issues) {
                fieldErrors[issue.path.join(".")] = issue.message;
            }
            return { ok: false, fieldErrors };
        }
    }

    const content = parsed.success ? parsed.data.content : "";

    // Upload image if provided
    let imageUrl: string | null = null;
    if (file && file.size > 0) {
        const allowed = ["image/jpeg", "image/png", "image/webp"];
        if (!allowed.includes(file.type)) {
            return { ok: false, error: "Only JPG, PNG, or WebP allowed" };
        }
        if (file.size > 3 * 1024 * 1024) {
            return { ok: false, error: "Image must be under 3 MB" };
        }

        const ext = file.name.split(".").pop()?.toLowerCase() || "jpg";
        const path = `${user.id}/${Date.now()}.${ext}`;

        const { error: uploadError } = await supabase.storage
            .from("community-images")
            .upload(path, file, { contentType: file.type });

        if (uploadError) {
            return { ok: false, error: uploadError.message };
        }

        const { data: urlData } = supabase.storage
            .from("community-images")
            .getPublicUrl(path);

        imageUrl = urlData.publicUrl;
    }

    const { error } = await supabase.from("community_posts").insert({
        author_id: user.id,
        content,
        image_url: imageUrl,
    });

    if (error) return { ok: false, error: error.message };

    revalidatePath("/community");
    return { ok: true };
}

/**
 * Delete a post (author only).
 */
export async function deletePostAction(
    postId: string
): Promise<CommunityActionResult> {
    if (!/^[0-9a-f-]{36}$/i.test(postId)) {
        return { ok: false, error: "Invalid post" };
    }

    const { supabase, user } = await getAuthenticatedUser();
    if (!user) return { ok: false, error: "NOT_AUTHENTICATED" };

    // Fetch post to get image URL for cleanup
    const { data: post } = await supabase
        .from("community_posts")
        .select("author_id, image_url")
        .eq("id", postId)
        .maybeSingle();

    if (!post) return { ok: false, error: "Post not found" };
    if (post.author_id !== user.id) {
        return { ok: false, error: "You can only delete your own posts" };
    }

    // Best-effort: delete the storage object if there was an image
    if (post.image_url) {
        try {
            const url = new URL(post.image_url);
            const parts = url.pathname.split("/community-images/");
            if (parts[1]) {
                await supabase.storage.from("community-images").remove([parts[1]]);
            }
        } catch {
            // Ignore — deletion of the row is more important
        }
    }

    const { error } = await supabase
        .from("community_posts")
        .delete()
        .eq("id", postId);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/community");
    return { ok: true };
}

/**
 * Create a comment on a post.
 */
export async function createCommentAction(
    _prev: CommunityActionResult | undefined,
    formData: FormData
): Promise<CommunityActionResult> {
    const { supabase, user } = await getAuthenticatedUser();
    if (!user) return { ok: false, error: "NOT_AUTHENTICATED" };

    const parsed = commentSchema.safeParse({
        post_id: String(formData.get("post_id") || ""),
        content: String(formData.get("content") || ""),
    });

    if (!parsed.success) {
        const fieldErrors: Record<string, string> = {};
        for (const issue of parsed.error.issues) {
            fieldErrors[issue.path.join(".")] = issue.message;
        }
        return { ok: false, fieldErrors };
    }

    const { error } = await supabase.from("community_comments").insert({
        post_id: parsed.data.post_id,
        author_id: user.id,
        content: parsed.data.content,
    });

    if (error) return { ok: false, error: error.message };

    revalidatePath("/community");
    return { ok: true };
}

/**
 * Delete a comment (author only).
 */
export async function deleteCommentAction(
    commentId: string
): Promise<CommunityActionResult> {
    if (!/^[0-9a-f-]{36}$/i.test(commentId)) {
        return { ok: false, error: "Invalid comment" };
    }

    const { supabase, user } = await getAuthenticatedUser();
    if (!user) return { ok: false, error: "NOT_AUTHENTICATED" };

    const { error } = await supabase
        .from("community_comments")
        .delete()
        .eq("id", commentId)
        .eq("author_id", user.id);

    if (error) return { ok: false, error: error.message };

    revalidatePath("/community");
    return { ok: true };
}