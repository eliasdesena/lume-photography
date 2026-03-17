"use client";

import { useState } from "react";
import { createClient } from "@lume/supabase/client";

export default function SetupPage() {
  const [password, setPassword] = useState("");
  const [confirm, setConfirm] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const supabase = createClient();

  async function handleSetPassword(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (password.length < 8) {
      setError("Password must be at least 8 characters");
      return;
    }

    if (password !== confirm) {
      setError("Passwords don't match");
      return;
    }

    setLoading(true);

    const { error } = await supabase.auth.updateUser({ password });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        <div className="text-center mb-10">
          <div className="w-12 h-12 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center mx-auto mb-6">
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-gold"
            >
              <rect x="3" y="11" width="18" height="11" rx="2" />
              <path d="M7 11V7a5 5 0 0 1 10 0v4" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-2">Set your password</h1>
          <p className="font-body font-light text-muted text-sm">
            Create a password so you can sign in anytime
          </p>
        </div>

        <form onSubmit={handleSetPassword} className="space-y-4">
          <div>
            <label
              htmlFor="password"
              className="block text-[11px] uppercase tracking-[0.08em] text-muted/70 font-body font-medium mb-2"
            >
              Password
            </label>
            <input
              id="password"
              type="password"
              required
              minLength={8}
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-surface border border-hairline rounded-sm px-4 py-3 text-sm text-cream font-body placeholder:text-muted/40 focus:outline-none focus:border-gold/40 transition-colors"
              placeholder="At least 8 characters"
            />
          </div>

          <div>
            <label
              htmlFor="confirm"
              className="block text-[11px] uppercase tracking-[0.08em] text-muted/70 font-body font-medium mb-2"
            >
              Confirm password
            </label>
            <input
              id="confirm"
              type="password"
              required
              value={confirm}
              onChange={(e) => setConfirm(e.target.value)}
              className="w-full bg-surface border border-hairline rounded-sm px-4 py-3 text-sm text-cream font-body placeholder:text-muted/40 focus:outline-none focus:border-gold/40 transition-colors"
              placeholder="Confirm your password"
            />
          </div>

          {error && <p className="text-error text-xs font-body">{error}</p>}

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-obsidian px-8 py-3.5 text-sm uppercase tracking-[0.06em] font-body font-medium hover:bg-cream transition-colors duration-200 disabled:opacity-50"
          >
            {loading ? "..." : "Set password & continue"}
          </button>
        </form>
      </div>
    </div>
  );
}
