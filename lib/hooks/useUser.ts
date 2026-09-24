"use client";

import { useCallback, useEffect, useState } from "react";
import { usePathname } from "next/navigation";
import { createClient } from "@/lib/supabase/client";
import type { User } from "@supabase/supabase-js";

export interface ClientProfile {
  id: string;
  role: "consumer" | "farmer";
  full_name: string;
  avatar_url: string | null;
}

export function useUser() {
  const [user, setUser] = useState<User | null>(null);
  const [profile, setProfile] = useState<ClientProfile | null>(null);
  const [loading, setLoading] = useState(true);
  const pathname = usePathname();

  const loadProfile = useCallback(async (userId: string) => {
    const supabase = createClient();
    const { data } = await supabase
      .from("profiles")
      .select("id, role, full_name, avatar_url")
      .eq("id", userId)
      .maybeSingle();
    return data as ClientProfile | null;
  }, []);

  const refreshUser = useCallback(async () => {
    const supabase = createClient();
    try {
      const {
        data: { user: currentUser },
      } = await supabase.auth.getUser();

      setUser(currentUser);
      if (currentUser) {
        const prof = await loadProfile(currentUser.id);
        setProfile(prof);
      } else {
        setProfile(null);
      }
    } catch {
      setUser(null);
      setProfile(null);
    } finally {
      setLoading(false);
    }
  }, [loadProfile]);

  useEffect(() => {
    const supabase = createClient();

    refreshUser();

    // Subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange(
      async (_event, session) => {
        const currentUser = session?.user ?? null;
        setUser(currentUser);
        if (currentUser) {
          const prof = await loadProfile(currentUser.id);
          setProfile(prof);
        } else {
          setProfile(null);
        }
        setLoading(false);
      }
    );

    return () => {
      sub.subscription.unsubscribe();
    };
  }, [loadProfile, refreshUser]);

  // Re-check auth whenever pathname changes (e.g. navigation across routes)
  useEffect(() => {
    refreshUser();
  }, [pathname, refreshUser]);

  return { user, profile, loading, refreshUser };
}