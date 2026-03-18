"use client";

import { useState, useEffect, useRef, useCallback } from "react";
import Link from "next/link";
import { WordmarkGradient } from "@lume/ui/logos";
import { usePathname } from "next/navigation";
import { createClient } from "@lume/supabase/client";
import type { CourseModule } from "@lume/types";

interface DashboardSidebarProps {
  displayName: string;
  avatarUrl: string | null;
  email: string;
  userId: string;
  courseModules: CourseModule[];
  completedLessons: Set<string>;
  progressPct: number;
  completedCount: number;
  totalLessons: number;
}

export default function DashboardSidebar({
  displayName,
  avatarUrl,
  email,
  userId,
  courseModules,
  completedLessons,
  progressPct,
  completedCount,
  totalLessons,
}: DashboardSidebarProps) {
  const pathname = usePathname();
  const [mobileOpen, setMobileOpen] = useState(false);
  const touchStartX = useRef(0);
  const touchStartY = useRef(0);

  // Swipe right from left edge to open sidebar, swipe left to close
  const handleGlobalTouchStart = useCallback((e: TouchEvent) => {
    touchStartX.current = e.touches[0].clientX;
    touchStartY.current = e.touches[0].clientY;
  }, []);

  const handleGlobalTouchEnd = useCallback((e: TouchEvent) => {
    const deltaX = e.changedTouches[0].clientX - touchStartX.current;
    const deltaY = e.changedTouches[0].clientY - touchStartY.current;
    // Only trigger if horizontal swipe is dominant
    if (Math.abs(deltaX) < 60 || Math.abs(deltaY) > Math.abs(deltaX)) return;

    if (deltaX > 0 && touchStartX.current < 40 && !mobileOpen) {
      setMobileOpen(true);
    } else if (deltaX < 0 && mobileOpen) {
      setMobileOpen(false);
    }
  }, [mobileOpen]);

  useEffect(() => {
    // Only for mobile
    if (window.innerWidth >= 1024) return;
    document.addEventListener("touchstart", handleGlobalTouchStart, { passive: true });
    document.addEventListener("touchend", handleGlobalTouchEnd, { passive: true });
    return () => {
      document.removeEventListener("touchstart", handleGlobalTouchStart);
      document.removeEventListener("touchend", handleGlobalTouchEnd);
    };
  }, [handleGlobalTouchStart, handleGlobalTouchEnd]);

  async function handleSignOut() {
    const supabase = createClient();
    await supabase.auth.signOut();
    window.location.href = "/login";
  }

  const sidebarContent = (
    <>
      {/* Logo */}
      <div className="px-6 pt-8 pb-6">
        <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
          <WordmarkGradient className="h-10 w-auto" />
        </Link>
      </div>

      {/* Progress bar */}
      <div className="px-6 pb-6">
        <div className="flex items-center justify-between text-label text-muted mb-2">
          <span>Progress</span>
          <span>
            {completedCount}/{totalLessons}
          </span>
        </div>
        <div className="h-1 bg-surface-2 rounded-full overflow-hidden">
          <div
            className="h-full bg-gold rounded-full transition-all duration-500"
            style={{ width: `${progressPct}%` }}
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 overflow-y-auto px-3">
        {/* Dashboard home */}
        <Link
          href="/"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body transition-colors mb-1 ${
            pathname === "/"
              ? "bg-surface text-cream"
              : "text-muted hover:text-cream hover:bg-surface/50"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M3 9l9-7 9 7v11a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2z" />
            <polyline points="9 22 9 12 15 12 15 22" />
          </svg>
          Dashboard
        </Link>

        {/* Downloads */}
        <Link
          href="/downloads"
          className={`flex items-center gap-3 px-3 py-2.5 rounded-sm text-sm font-body transition-colors mb-4 ${
            pathname === "/downloads"
              ? "bg-surface text-cream"
              : "text-muted hover:text-cream hover:bg-surface/50"
          }`}
        >
          <svg
            width="16"
            height="16"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
          Downloads
        </Link>

        {/* Course modules */}
        <div className="text-label text-muted/80 px-3 mb-2">
          Course
        </div>
        {courseModules.map((mod) => {
          const modCompleted = mod.lessons.every((l) =>
            completedLessons.has(l.id)
          );
          const modStarted = mod.lessons.some((l) =>
            completedLessons.has(l.id)
          );

          return (
            <div key={mod.id} className="mb-2">
              <div className="flex items-center gap-2 px-3 py-1.5">
                <span
                  className={`w-4 h-4 rounded-full flex items-center justify-center text-[8px] font-body font-medium border ${
                    modCompleted
                      ? "bg-gold/20 border-gold/40 text-gold"
                      : modStarted
                      ? "bg-surface border-hairline text-muted"
                      : "bg-transparent border-hairline/60 text-muted/60"
                  }`}
                >
                  {modCompleted ? "✓" : mod.number}
                </span>
                <span className="text-xs font-body text-muted truncate">
                  {mod.title}
                </span>
              </div>
              {mod.lessons.map((lesson) => {
                const isActive = pathname === `/lessons/${lesson.slug}`;
                const isComplete = completedLessons.has(lesson.id);
                return (
                  <Link
                    key={lesson.id}
                    href={`/lessons/${lesson.slug}`}
                    className={`flex items-center gap-2 pl-9 pr-3 py-1.5 text-xs font-body transition-colors rounded-sm ${
                      isActive
                        ? "bg-surface text-cream"
                        : isComplete
                        ? "text-muted hover:text-cream"
                        : "text-muted/80 hover:text-cream"
                    }`}
                  >
                    {isComplete && (
                      <span className="text-gold text-[10px]">✓</span>
                    )}
                    <span className="truncate">{lesson.title}</span>
                    <span className="ml-auto text-[10px] text-muted/60 shrink-0">
                      {lesson.duration}
                    </span>
                  </Link>
                );
              })}
            </div>
          );
        })}
      </nav>

      {/* User */}
      <div className="border-t border-hairline/40 px-4 py-4">
        <div className="flex items-center justify-between">
          <Link
            href="/settings"
            className="flex items-center gap-3 hover:bg-surface/50 rounded-sm px-1 py-1 -mx-1 transition-colors"
          >
            <div className="w-8 h-8 rounded-full bg-surface-2 flex items-center justify-center text-xs text-muted font-body">
              {displayName.charAt(0).toUpperCase()}
            </div>
            <span className="text-xs font-body text-muted truncate max-w-[120px]">
              {displayName}
            </span>
          </Link>
          <button
            onClick={handleSignOut}
            className="text-[11px] text-muted/60 hover:text-cream font-body uppercase tracking-wider transition-colors border border-hairline/40 hover:border-gold/30 rounded-sm px-3 py-1.5"
          >
            Sign out
          </button>
        </div>
      </div>
    </>
  );

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:flex lg:flex-col lg:w-72 lg:fixed lg:inset-y-0 bg-obsidian border-r border-hairline/40">
        {sidebarContent}
      </aside>

      {/* Mobile header + hamburger */}
      <div className="lg:hidden fixed top-0 left-0 right-0 z-50 bg-obsidian/95 backdrop-blur-md border-b border-hairline/40">
        <div className="flex items-center justify-between px-4 py-3">
          <Link href="/" className="hover:opacity-80 transition-opacity duration-200">
            <WordmarkGradient className="h-9 w-auto" />
          </Link>
          <button
            onClick={() => setMobileOpen(!mobileOpen)}
            className="text-muted hover:text-cream p-1"
          >
            <svg
              width="20"
              height="20"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
            >
              {mobileOpen ? (
                <>
                  <line x1="18" y1="6" x2="6" y2="18" />
                  <line x1="6" y1="6" x2="18" y2="18" />
                </>
              ) : (
                <>
                  <line x1="3" y1="6" x2="21" y2="6" />
                  <line x1="3" y1="12" x2="21" y2="12" />
                  <line x1="3" y1="18" x2="21" y2="18" />
                </>
              )}
            </svg>
          </button>
        </div>
      </div>

      {/* Mobile overlay */}
      {mobileOpen && (
        <div className="lg:hidden fixed inset-0 z-40">
          <div
            className="absolute inset-0 bg-black/60"
            onClick={() => setMobileOpen(false)}
          />
          <aside className="absolute left-0 top-0 bottom-0 w-72 bg-obsidian border-r border-hairline/40 flex flex-col">
            {sidebarContent}
          </aside>
        </div>
      )}

      {/* Mobile top padding */}
      <div className="lg:hidden h-16" />

    </>
  );
}
