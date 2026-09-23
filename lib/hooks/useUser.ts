"use client";

import { useEffect, useState } from "react";
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

  useEffect(() => {
    const supabase = createClient();
    let mounted = true;

    async function loadProfile(userId: string) {
      const { data } = await supabase
        .from("profiles")
        .select("id, role, full_name, avatar_url")
        .eq("id", userId)
        .maybeSingle();
      if (mounted) setProfile(data as ClientProfile | null);
    }

    // Initial session
    supabase.auth.getUser().then(({ data: { user } }) => {
      if (!mounted) return;
      setUser(user);
      if (user) loadProfile(user.id);
      setLoading(false);
    });

    // Subscribe to auth changes
    const { data: sub } = supabase.auth.onAuthStateChange((_event, session) => {
      if (!mounted) return;
      setUser(session?.user ?? null);
      if (session?.user) {
        loadProfile(session.user.id);
      } else {
        setProfile(null);
      }
    });

    return () => {
      mounted = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, profile, loading };
}