"use client";

import { useState } from "react";
import { createClient } from "@lume/supabase/client";
import { WordmarkGradient } from "@lume/ui/logos";

type Step = "email" | "password" | "magic-sent" | "reset-sent";

export default function LoginPage() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [step, setStep] = useState<Step>("email");

  const supabase = createClient();

  // Step 1: User enters email, we try password login first.
  // If they don't have a password, we guide them to magic link.
  async function handleEmailSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      setError("Enter a valid email address");
      return;
    }

    // Try to see if this user exists — send them to password step
    // (If they don't have a password, the password login will fail and we'll guide them)
    setStep("password");
  }

  async function handlePasswordLogin(e: React.FormEvent) {
    e.preventDefault();
    setError(null);
    setLoading(true);

    const { error: signInError } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (signInError) {
      // If invalid credentials, could be wrong password OR no password set
      if (signInError.message.includes("Invalid login credentials")) {
        setError("Wrong password. Try a magic link instead.");
      } else {
        setError(signInError.message);
      }
      setLoading(false);
      return;
    }

    window.location.href = "/";
  }

  async function handleSendMagicLink() {
    setError(null);
    setLoading(true);

    const { error: otpError } = await supabase.auth.signInWithOtp({
      email,
      options: {
        emailRedirectTo: `${window.location.origin}/auth/callback`,
      },
    });

    if (otpError) {
      setError(otpError.message);
      setLoading(false);
      return;
    }

    setStep("magic-sent");
    setLoading(false);
  }

  async function handleForgotPassword() {
    setError(null);
    setLoading(true);

    await supabase.auth.resetPasswordForEmail(email, {
      redirectTo: `${window.location.origin}/auth/setup`,
    });

    setStep("reset-sent");
    setLoading(false);
  }

  // Confirmation screens
  if (step === "magic-sent" || step === "reset-sent") {
    return (
      <div className="h-full overflow-y-auto flex items-center justify-center px-6">
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
          <p className="font-body font-light text-muted text-sm leading-relaxed mb-6">
            {step === "magic-sent"
              ? <>We sent a sign-in link to <span className="text-cream">{email}</span>. Click the link to access your course.</>
              : <>We sent a password reset link to <span className="text-cream">{email}</span>. Click it to set a new password.</>}
          </p>
          <button
            onClick={() => {
              setStep("email");
              setLoading(false);
            }}
            className="text-xs text-muted hover:text-cream font-body transition-colors"
          >
            ← Back to sign in
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="h-full overflow-y-auto flex items-center justify-center px-6">
      <div className="w-full max-w-sm">
        {/* Logo */}
        <div className="flex flex-col items-center mb-10">
          <WordmarkGradient className="h-10 w-auto mb-4" />
          <p className="font-body font-light text-muted text-sm">
            Sign in to your course
          </p>
        </div>

        {step === "email" && (
          <form onSubmit={handleEmailSubmit} className="space-y-4">
            <div>
              <label
                htmlFor="email"
                className="block text-label text-muted mb-2"
              >
                Email
              </label>
              <input
                id="email"
                type="email"
                required
                autoFocus
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full bg-surface border border-hairline rounded-sm px-4 py-3 text-sm text-cream font-body placeholder:text-muted/50 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="you@example.com"
              />
            </div>

            {error && (
              <p className="text-error text-xs font-body">{error}</p>
            )}

            <button
              type="submit"
              className="w-full bg-gold text-obsidian px-8 py-3.5 text-sm uppercase tracking-[0.06em] font-body font-medium hover:bg-cream transition-colors duration-200"
            >
              Continue
            </button>
          </form>
        )}

        {step === "password" && (
          <form onSubmit={handlePasswordLogin} className="space-y-4">
            {/* Show email (not editable, with back button) */}
            <div>
              <div className="flex items-center justify-between mb-2">
                <label className="block text-label text-muted">
                  Email
                </label>
                <button
                  type="button"
                  onClick={() => { setStep("email"); setError(null); }}
                  className="text-[10px] text-muted hover:text-cream font-body transition-colors"
                >
                  Change
                </button>
              </div>
              <div className="w-full bg-surface border border-hairline rounded-sm px-4 py-3 text-sm text-cream/70 font-body">
                {email}
              </div>
            </div>

            <div>
              <label
                htmlFor="password"
                className="block text-label text-muted mb-2"
              >
                Password
              </label>
              <input
                id="password"
                type="password"
                required
                autoFocus
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full bg-surface border border-hairline rounded-sm px-4 py-3 text-sm text-cream font-body placeholder:text-muted/50 focus:outline-none focus:border-gold/40 transition-colors"
                placeholder="••••••••"
              />
            </div>

            {error && (
              <p className="text-error text-xs font-body">{error}</p>
            )}

            <button
              type="submit"
              disabled={loading}
              className="w-full bg-gold text-obsidian px-8 py-3.5 text-sm uppercase tracking-[0.06em] font-body font-medium hover:bg-cream transition-colors duration-200 disabled:opacity-50"
            >
              {loading ? "Signing in..." : "Sign in"}
            </button>

            {/* Alternative actions */}
            <div className="flex items-center justify-between pt-2">
              <button
                type="button"
                onClick={handleSendMagicLink}
                disabled={loading}
                className="text-xs text-muted hover:text-cream font-body transition-colors"
              >
                Send me a sign-in link instead
              </button>
              <button
                type="button"
                onClick={handleForgotPassword}
                disabled={loading}
                className="text-xs text-muted hover:text-cream font-body transition-colors"
              >
                Forgot password?
              </button>
            </div>
          </form>
        )}
      </div>
    </div>
  );
}
