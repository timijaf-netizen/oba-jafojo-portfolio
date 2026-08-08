"use client";

import { useEffect, useMemo, useState } from "react";
import { getBrowserSupabase } from "@/lib/supabaseClient";
import { defaultContent, mergeContent } from "@/lib/defaultContent";
import LoginForm from "./LoginForm";
import Dashboard from "./Dashboard";

export default function AdminApp() {
  const supabase = useMemo(() => getBrowserSupabase(), []);
  const [session, setSession] = useState(null);
  const [ready, setReady] = useState(false);
  const [content, setContent] = useState(null);

  // Track auth session
  useEffect(() => {
    if (!supabase) {
      setReady(true);
      return;
    }
    supabase.auth.getSession().then(({ data }) => {
      setSession(data.session);
      setReady(true);
    });
    const { data: sub } = supabase.auth.onAuthStateChange((_e, s) => {
      setSession(s);
    });
    return () => sub.subscription.unsubscribe();
  }, [supabase]);

  // Load current saved content once signed in
  useEffect(() => {
    if (!supabase || !session) return;
    let cancelled = false;
    (async () => {
      const { data } = await supabase
        .from("site_content")
        .select("data")
        .eq("id", 1)
        .maybeSingle();
      if (!cancelled) {
        setContent(data?.data ? mergeContent(data.data) : defaultContent);
      }
    })();
    return () => {
      cancelled = true;
    };
  }, [supabase, session]);

  // --- Not configured ---
  if (!supabase) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
        <div className="max-w-md rounded-xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <p className="font-serif text-xl">Admin not connected yet</p>
          <p className="mt-3 text-sm leading-relaxed text-neutral-600">
            The public site is live and running on placeholder content. To turn on
            the admin panel, add your Supabase keys
            (<code className="text-xs">NEXT_PUBLIC_SUPABASE_URL</code> and
            {" "}<code className="text-xs">NEXT_PUBLIC_SUPABASE_ANON_KEY</code>)
            in your environment, then run the setup script. See the README.
          </p>
          <a href="/" className="mt-6 inline-block text-sm text-neutral-500 hover:text-neutral-900">
            ← Back to site
          </a>
        </div>
      </div>
    );
  }

  if (!ready) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 text-sm text-neutral-400">
        Loading…
      </div>
    );
  }

  if (!session) {
    return <LoginForm supabase={supabase} />;
  }

  if (!content) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-neutral-100 text-sm text-neutral-400">
        Loading content…
      </div>
    );
  }

  return (
    <Dashboard
      supabase={supabase}
      user={session.user}
      initialContent={content}
      onSignOut={() => supabase.auth.signOut()}
    />
  );
}
