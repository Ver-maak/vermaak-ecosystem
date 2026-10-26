import { useEffect, useState } from "react";
import type { User } from "@supabase/supabase-js";
import { supabase } from "@/integrations/supabase/client";

/** Current user plus whether they can edit site content (admin or editor). */
export function useAuth() {
  const [user, setUser] = useState<User | null>(null);
  const [isEditor, setIsEditor] = useState(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    let active = true;

    async function load(current: User | null) {
      setUser(current);
      if (!current) {
        setIsEditor(false);
        setLoading(false);
        return;
      }
      const { data } = await supabase.rpc("is_editor", { _user_id: current.id });
      if (active) {
        setIsEditor(Boolean(data));
        setLoading(false);
      }
    }

    supabase.auth.getUser().then(({ data }) => load(data.user));
    const { data: sub } = supabase.auth.onAuthStateChange((event, session) => {
      if (event === "SIGNED_IN" || event === "SIGNED_OUT" || event === "USER_UPDATED") {
        load(session?.user ?? null);
      }
    });
    return () => {
      active = false;
      sub.subscription.unsubscribe();
    };
  }, []);

  return { user, isEditor, loading };
}
