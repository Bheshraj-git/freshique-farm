/**
 * Validates required environment variables at startup.
 * Import this file somewhere that runs early (e.g., in root layout)
 * to catch missing config before runtime errors happen.
 */

const requiredPublic = [
  "NEXT_PUBLIC_SUPABASE_URL",
  "NEXT_PUBLIC_SUPABASE_ANON_KEY",
] as const;

export function assertEnv() {
  const missing: string[] = [];

  for (const key of requiredPublic) {
    if (!process.env[key]) missing.push(key);
  }

  if (missing.length > 0) {
    throw new Error(
      `Missing required environment variables: ${missing.join(", ")}. ` +
        `Check your .env.local file (see .env.example for the shape).`
    );
  }
}