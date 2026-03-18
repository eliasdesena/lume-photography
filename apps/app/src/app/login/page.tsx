"use client";

import { useState } from "react";
import { createClient } from "@lume/supabase/client";
import { WordmarkGradient } from "@lume/ui/logos";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [magicLinkSent, setMagicLinkSent] = useState(false);
  const [mode, setMode] = useState<"password" | "magic">("password");

  const supabase = createClient();

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  async function handleMagicLink(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (error) {
      setError(error.message);
      setLoading(false);
      return;
    }

    setMagicLinkSent(true);
    setLoading(false);
  }

  if (magicLinkSent) {
    return (
      <div className="min-h-screen flex items-center justify-center px-6">
        <div className="w-full max-w-sm text-center">
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
              <path d="M3 8l9 6 9-6" />
              <rect x="2" y="4" width="20" height="16" rx="2" />
            </svg>
          </div>
          <h1 className="font-display text-2xl mb-3">Check your email</h1>
          <p className="font-body font-light text-muted text-sm leading-relaxed">
            We sent a magic link to <span className="text-cream">{email}</span>.
            Click the link to sign in.
          </p>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <WordmarkGradient className="h-10 w-auto mb-4" />
          <p className="font-body font-light text-muted text-sm">
            Sign in to your course
          </p>
        </div>

        <form
          onSubmit={mode === "password" ? handlePasswordLogin : handleMagicLink}
          className="space-y-4"
        >
          {/* Email */}
          <div>
            <label
              htmlFor="email"
              className="block text-[11px] uppercase tracking-[0.08em] text-muted/70 font-body font-medium mb-2"
            >
              Email
            </label>
            <input
              id="email"
              type="email"
              required
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-surface border border-hairline rounded-sm px-4 py-3 text-sm text-cream font-body placeholder:text-muted/40 focus:outline-none focus:border-gold/40 transition-colors"
              placeholder="you@example.com"
            />
          </div>

          {/* Password (only in password mode) */}
          {mode === "password" && (
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
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-hairline rounded-sm px-4 py-3 text-sm text-cream font-body placeholder:text-muted/40 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="••••••••"
              />
            </div>
          )}

          {/* Error */}
          {error && (
            <p className="text-error text-xs font-body">{error}</p>
          )}

          {/* Submit */}
          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gold text-obsidian px-8 py-3.5 text-sm uppercase tracking-[0.06em] font-body font-medium hover:bg-cream transition-colors duration-200 disabled:opacity-50"
          >
            {loading
              ? "..."
              : mode === "password"
              ? "Sign in"
              : "Send magic link"}
          </button>
        </form>

        {/* Toggle mode */}
        <div className="mt-6 text-center">
          <button
            type="button"
            onClick={() => setMode(mode === "password" ? "magic" : "password")}
            className="text-muted/60 hover:text-cream/70 text-xs font-body transition-colors"
          >
            {mode === "password"
              ? "Sign in with magic link instead"
              : "Sign in with password instead"}
          </button>
        </div>

        {/* Forgot password */}
        {mode === "password" && (
          <div className="mt-3 text-center">
            <button
              type="button"
              onClick={async () => {
                if (!email) {
                  setError("Enter your email first");
                  return;
                }
                setLoading(true);
                await supabase.auth.resetPasswordForEmail(email, {
                  redirectTo: `${window.location.origin}/auth/setup`,
                });
                setMagicLinkSent(true);
                setLoading(false);
              }}
              className="text-muted/40 hover:text-cream/50 text-xs font-body transition-colors"
            >
              Forgot password?
            </button>
          </div>
        )}
      </div>
    </div>
  );
}
