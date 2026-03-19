"use client";

import { useState } from "react";
import Link from "next/link";
import { createClient } from "@lume/supabase/client";
import { motion, AnimatePresence } from "motion/react";

interface Entitlement {
  id: string;
  product_id: string;
  stripe_payment_intent_id: string | null;
  granted_at: string;
}

interface SettingsClientProps {
  userId: string;
  email: string;
  displayName: string;
  avatarUrl: string | null;
  createdAt: string;
  entitlements: Entitlement[];
}

const PRODUCT_NAMES: Record<string, string> = {
  prod_U9zCzd0tuKoOuU: "LUMÉ iPhone Photography Course",
};

type RefundStep = "idle" | "reason" | "confirm" | "processing" | "done";

const REFUND_REASONS = [
  "The course didn't meet my expectations",
  "I found a better alternative",
  "I no longer need this",
  "Financial reasons",
  "Other",
];

export default function SettingsClient({
  userId,
  email,
  displayName,
  avatarUrl,
  createdAt,
  entitlements,
}: SettingsClientProps) {
  // Profile editing
  const [name, setName] = useState(displayName);
  const [saving, setSaving] = useState(false);
  const [saved, setSaved] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Password
  const [resetSent, setResetSent] = useState(false);

  // Refund flow
  const [refundStep, setRefundStep] = useState<RefundStep>("idle");
  const [refundReason, setRefundReason] = useState("");
  const [refundError, setRefundError] = useState<string | null>(null);
  const [refundEntitlementId, setRefundEntitlementId] = useState<string | null>(
    null
  );

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
      const { error: resetError } =
        await supabase.auth.resetPasswordForEmail(email, {
          redirectTo: `${window.location.origin}/auth/setup`,
        });
      if (resetError) throw resetError;
      setResetSent(true);
    } catch {
      setError("Failed to send reset email");
    }
  }

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  function startRefund(entitlementId: string) {
    setRefundEntitlementId(entitlementId);
    setRefundStep("reason");
    setRefundReason("");
    setRefundError(null);
  }

  async function submitRefund() {
    if (!refundReason.trim()) return;
    setRefundStep("processing");
    setRefundError(null);

    try {
      const res = await fetch("/api/refund", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ reason: refundReason }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Refund failed");
      setRefundStep("done");
    } catch (err) {
      setRefundError(
        err instanceof Error ? err.message : "Failed to process refund"
      );
      setRefundStep("confirm");
    }
  }

  const accountAge = Math.floor(
    (Date.now() - new Date(createdAt).getTime()) / (1000 * 60 * 60 * 24)
  );

  return (
    <div className="max-w-2xl">
      {/* Header */}
      <div className="mb-8">
        <Link
          href="/"
          className="text-muted hover:text-cream text-xs font-body transition-colors press-scale inline-block"
        >
          ← Back to dashboard
        </Link>
        <h1 className="font-display text-3xl text-cream mt-4">
          Account Settings
        </h1>
      </div>

      {/* Profile section */}
      <section className="bg-surface border border-hairline rounded-sm p-6 mb-6">
        <h2 className="text-label text-muted mb-5">Profile</h2>

        <div className="flex items-center gap-4 mb-6">
          <div className="w-16 h-16 rounded-full bg-surface-2 flex items-center justify-center text-xl text-muted font-body">
            {displayName.charAt(0).toUpperCase()}
          </div>
          <div>
            <p className="font-body text-sm text-cream">{displayName}</p>
            <p className="font-body text-xs text-muted">{email}</p>
            <p className="font-body text-[11px] text-muted/80 mt-1">
              Member for {accountAge} day{accountAge !== 1 ? "s" : ""} · Joined{" "}
              {new Date(createdAt).toLocaleDateString("en-US", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>
          </div>
        </div>

        {/* Display name */}
        <div className="mb-5">
          <label className="text-label text-muted/80 block mb-2">
            Display name
          </label>
          <div className="flex gap-3">
            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              className="flex-1 bg-surface-2 border border-hairline rounded-sm px-3 py-2.5 text-sm font-body text-cream placeholder:text-muted/40 focus:outline-none focus:border-gold/40 transition-colors"
            />
            <button
              onClick={handleSaveName}
              disabled={saving || !name.trim() || name === displayName}
              className="px-4 py-2.5 bg-surface-2 border border-hairline rounded-sm text-xs font-body text-cream hover:border-gold/40 transition-colors disabled:text-muted/40 disabled:cursor-not-allowed"
            >
              {saving ? "Saving..." : saved ? "Saved ✓" : "Save"}
            </button>
          </div>
        </div>

        {/* Password */}
        <div>
          <label className="text-label text-muted/80 block mb-2">
            Password
          </label>
          {resetSent ? (
            <p className="font-body text-xs text-gold">
              Reset link sent to {email}
            </p>
          ) : (
            <button
              onClick={handleResetPassword}
              className="text-xs font-body text-muted hover:text-cream transition-colors underline underline-offset-2"
            >
              Send password reset email
            </button>
          )}
        </div>

        {error && (
          <p className="font-body text-xs text-error mt-4">{error}</p>
        )}
      </section>

      {/* Purchase history */}
      <section className="bg-surface border border-hairline rounded-sm p-6 mb-6">
        <h2 className="text-label text-muted mb-5">Purchase History</h2>

        {entitlements.length === 0 ? (
          <p className="font-body text-sm text-muted">No purchases yet.</p>
        ) : (
          <div className="space-y-4">
            {entitlements.map((ent) => {
              const grantedDate = new Date(ent.granted_at);
              const daysSince = Math.floor(
                (Date.now() - grantedDate.getTime()) / (1000 * 60 * 60 * 24)
              );
              const refundEligible = daysSince <= 30;

              return (
                <div
                  key={ent.id}
                  className="flex items-center justify-between py-3 border-b border-hairline/40 last:border-0"
                >
                  <div>
                    <p className="font-body text-sm text-cream">
                      {PRODUCT_NAMES[ent.product_id] ?? "Course Access"}
                    </p>
                    <p className="font-body text-xs text-muted mt-0.5">
                      Purchased{" "}
                      {grantedDate.toLocaleDateString("en-US", {
                        month: "long",
                        day: "numeric",
                        year: "numeric",
                      })}
                    </p>
                  </div>
                  <div className="text-right">
                    {refundEligible && refundStep === "idle" && (
                      <button
                        onClick={() => startRefund(ent.id)}
                        className="text-[11px] font-body text-muted/80 hover:text-cream transition-colors underline underline-offset-2"
                      >
                        Request refund
                      </button>
                    )}
                    {!refundEligible && (
                      <span className="text-[11px] font-body text-muted/60">
                        Refund window expired
                      </span>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        )}

        {/* Refund flow */}
        <AnimatePresence>
          {refundStep !== "idle" && refundStep !== "done" && (
            <motion.div
              initial={{ opacity: 0, height: 0 }}
              animate={{ opacity: 1, height: "auto" }}
              exit={{ opacity: 0, height: 0 }}
              className="overflow-hidden"
            >
              <div className="mt-6 bg-surface-2 border border-hairline rounded-sm p-5">
                {refundStep === "reason" && (
                  <>
                    <p className="font-body text-sm text-cream mb-4">
                      We&apos;re sorry to see you go. Could you tell us why
                      you&apos;d like a refund?
                    </p>
                    <div className="space-y-2 mb-4">
                      {REFUND_REASONS.map((r) => (
                        <label
                          key={r}
                          className="flex items-center gap-3 cursor-pointer group"
                        >
                          <input
                            type="radio"
                            name="refund-reason"
                            value={r}
                            checked={refundReason === r}
                            onChange={() => setRefundReason(r)}
                            className="accent-gold"
                          />
                          <span className="font-body text-xs text-muted group-hover:text-cream transition-colors">
                            {r}
                          </span>
                        </label>
                      ))}
                    </div>
                    <div className="flex gap-3">
                      <button
                        onClick={() => {
                          if (refundReason) setRefundStep("confirm");
                        }}
                        disabled={!refundReason}
                        className="px-4 py-2 bg-surface border border-hairline rounded-sm text-xs font-body text-cream hover:border-gold/40 transition-colors disabled:text-muted/40 disabled:cursor-not-allowed"
                      >
                        Continue
                      </button>
                      <button
                        onClick={() => setRefundStep("idle")}
                        className="px-4 py-2 text-xs font-body text-muted hover:text-cream transition-colors"
                      >
                        Cancel
                      </button>
                    </div>
                  </>
                )}

                {refundStep === "confirm" && (
                  <>
                    <p className="font-body text-sm text-cream mb-2">
                      Are you sure?
                    </p>
                    <p className="font-body text-xs text-muted mb-4 leading-relaxed">
                      If you proceed, your course access will be revoked
                      immediately and a full refund will be issued to your
                      original payment method. This may take 5–10 business days
                      to appear.
                    </p>
                    {refundError && (
                      <p className="font-body text-xs text-error mb-3">
                        {refundError}
                      </p>
                    )}
                    <div className="flex gap-3">
                      <button
                        onClick={submitRefund}
                        className="px-4 py-2 bg-error/10 border border-error/30 rounded-sm text-xs font-body text-error hover:bg-error/20 transition-colors"
                      >
                        Yes, refund my purchase
                      </button>
                      <button
                        onClick={() => setRefundStep("idle")}
                        className="px-4 py-2 text-xs font-body text-muted hover:text-cream transition-colors"
                      >
                        Keep my access
                      </button>
                    </div>
                  </>
                )}

                {refundStep === "processing" && (
                  <div className="flex items-center gap-3 py-2">
                    <div className="w-4 h-4 border-2 border-gold/40 border-t-gold rounded-full animate-spin" />
                    <p className="font-body text-sm text-muted">
                      Processing your refund...
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>

        {refundStep === "done" && (
          <div className="mt-6 bg-gold/5 border border-gold/20 rounded-sm p-5">
            <p className="font-body text-sm text-cream mb-1">
              Refund processed
            </p>
            <p className="font-body text-xs text-muted leading-relaxed">
              Your refund has been submitted. It may take 5–10 business days to
              appear on your statement. Your course access has been revoked.
            </p>
          </div>
        )}
      </section>

      {/* Sign out */}
      <section className="bg-surface border border-hairline rounded-sm p-6 mb-6">
        <div className="flex items-center justify-between">
          <div>
            <p className="font-body text-sm text-cream">Sign out</p>
            <p className="font-body text-xs text-muted mt-0.5">
              Sign out of your account on this device.
            </p>
          </div>
          <button
            onClick={handleSignOut}
            className="px-5 py-2.5 bg-surface-2 border border-hairline hover:border-gold/30 rounded-sm text-xs font-body text-cream transition-colors"
          >
            Sign out
          </button>
        </div>
      </section>
    </div>
  );
}
