"use client";

import { useState } from "react";
import { Button } from "./fields";

export default function LoginForm({ supabase }) {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [busy, setBusy] = useState(false);
  const [err, setErr] = useState(null);

  async function submit(e) {
    e.preventDefault();
    setErr(null);
    setBusy(true);
    try {
      const { error } = await supabase.auth.signInWithPassword({ email, password });
      if (error) throw error;
      // onAuthStateChange in AdminApp handles the redirect to the dashboard.
    } catch (e2) {
      setErr(e2.message || "Sign in failed.");
      setBusy(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-neutral-100 px-4">
      <div className="w-full max-w-sm">
        <div className="mb-8 text-center">
          <p className="font-serif text-2xl">Portfolio Admin</p>
          <p className="mt-1 text-sm text-neutral-500">Sign in to manage your site</p>
        </div>

        <form onSubmit={submit} className="space-y-4 rounded-xl border border-neutral-200 bg-white p-6 shadow-sm">
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">Email</span>
            <input
              type="email"
              autoComplete="username"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
          </label>
          <label className="block">
            <span className="mb-1.5 block text-xs font-medium uppercase tracking-wide text-neutral-500">Password</span>
            <input
              type="password"
              autoComplete="current-password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              className="w-full rounded-md border border-neutral-300 px-3 py-2 text-sm outline-none focus:border-neutral-900"
            />
          </label>

          {err && <p className="rounded-md bg-red-50 px-3 py-2 text-sm text-red-700">{err}</p>}

          <Button type="submit" disabled={busy} className="w-full">
            {busy ? "Signing in…" : "Sign in"}
          </Button>
        </form>

        <a href="/" className="mt-6 block text-center text-sm text-neutral-400 hover:text-neutral-700">
          ← Back to site
        </a>
      </div>
    </div>
  );
}
