"use client";

import { useState } from "react";
import { motion } from "motion/react";
import { createClient } from "@lume/supabase/client";

interface AccountSettingsProps {
  displayName: string;
  email: string;
  userId: string;
  onClose: () => void;
  onSignOut: () => void;
}

export default function AccountSettings({
  displayName,
  email,
  userId,
  onClose,
  onSignOut,
}: AccountSettingsProps) {
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [resetSent, setResetSent] = useState(false);
  const [error, setError] = useState<string | null>(null);

  async function handleSaveName() {
    if (!name.trim() || name === displayName) return;
    setSaving(true);
    setError(null);
    try {
      const supabase = createClient();
      const { error: updateError } = await supabase
        .from("profiles")
        .update({ display_name: name.trim() })
        .eq("id", userId);
      if (updateError) throw updateError;
      setSaved(true);
      setTimeout(() => setSaved(false), 2000);
    } catch {
      setError("Failed to update name");
    } finally {
      setSaving(false);
    }
  }

  async function handleResetPassword() {
    setError(null);
    try {
      const supabase = createClient();
      const { error: resetError } = await supabase.auth.resetPasswordForEmail(
        email,
        { redirectTo: `${window.location.origin}/auth/setup` }
      );
      if (resetError) throw resetError;
      setResetSent(true);
    } catch {
      setError("Failed to send reset email");
    }
  }

  return (
    <>
      {/* Backdrop */}
      <motion.div
        className="fixed inset-0 z-[60] bg-black/40"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
        onClick={onClose}
      />

      {/* Panel */}
      <motion.div
        className="fixed top-0 bottom-0 left-0 lg:left-72 z-[70] w-80 bg-obsidian border-r border-hairline/40 flex flex-col overflow-y-auto"
        initial={{ x: -320 }}
        animate={{ x: 0 }}
        exit={{ x: -320 }}
        transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
      >
        {/* Header */}
        <div className="flex items-center justify-between px-6 pt-8 pb-6 border-b border-hairline/40">
          <h2 className="font-display text-lg text-cream">Account</h2>
          <button
            onClick={onClose}
            className="text-muted hover:text-cream transition-colors p-1"
          >
            <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
              <line x1="18" y1="6" x2="6" y2="18" />
              <line x1="6" y1="6" x2="18" y2="18" />
            </svg>
          </button>
        </div>

        {/* User info */}
        <div className="px-6 py-6 border-b border-hairline/40">
          <div className="w-14 h-14 rounded-full bg-surface-2 flex items-center justify-center text-lg text-muted font-body mb-4">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <p className="font-body text-sm text-cream">{displayName}</p>
          <p className="font-body text-xs text-muted">{email}</p>
        </div>

        {/* Display name */}
        <div className="px-6 py-6 border-b border-hairline/40">
          <label className="text-[10px] uppercase tracking-[0.08em] text-muted/60 font-body font-medium block mb-2">
            Display name
          </label>
          <input
            type="text"
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="w-full bg-surface border border-hairline/40 rounded-sm px-3 py-2 text-sm font-body text-cream placeholder:text-muted/40 focus:outline-none focus:border-gold/40 transition-colors"
          />
          <button
            onClick={handleSaveName}
            disabled={saving || !name.trim() || name === displayName}
            className="mt-3 text-xs font-body text-gold hover:text-gold/80 transition-colors disabled:text-muted/30 disabled:cursor-not-allowed"
          >
            {saving ? "Saving..." : saved ? "Saved" : "Save changes"}
          </button>
        </div>

        {/* Change password */}
        <div className="px-6 py-6 border-b border-hairline/40">
          <label className="text-[10px] uppercase tracking-[0.08em] text-muted/60 font-body font-medium block mb-2">
            Password
          </label>
          {resetSent ? (
            <p className="font-body text-xs text-gold">
              Reset link sent to {email}
            </p>
          ) : (
            <button
              onClick={handleResetPassword}
              className="text-xs font-body text-muted hover:text-cream transition-colors"
            >
              Send password reset email
            </button>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="px-6 py-3">
            <p className="font-body text-xs text-error">{error}</p>
          </div>
        )}

        {/* Sign out */}
        <div className="px-6 py-6 mt-auto">
          <button
            onClick={onSignOut}
            className="w-full bg-surface border border-hairline/40 hover:border-gold/30 text-cream font-body text-sm py-2.5 rounded-sm transition-colors"
          >
            Sign out
          </button>
        </div>
      </motion.div>
    </>
  );
}
