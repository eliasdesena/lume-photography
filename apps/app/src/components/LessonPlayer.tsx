"use client";

import { useCallback, useRef, useState } from "react";
import { useRouter } from "next/navigation";
import { createClient } from "@lume/supabase/client";

interface LessonPlayerProps {
  lessonId: string;
  playbackId: string;
  playbackToken: string | null;
  initialProgress: number;
  isCompleted: boolean;
}

export default function LessonPlayer({
  lessonId,
  playbackId,
  playbackToken,
  initialProgress,
  isCompleted: initialCompleted,
}: LessonPlayerProps) {
  const [completed, setCompleted] = useState(initialCompleted);
  const lastSaveRef = useRef(0);
  const router = useRouter();

  const supabase = createClient();

  const saveProgress = useCallback(
    async (seconds: number, markComplete: boolean) => {
      // Throttle saves to every 10 seconds
      const now = Date.now();
      if (!markComplete && now - lastSaveRef.current < 10000) return;
      lastSaveRef.current = now;

      await supabase.from("course_progress").upsert(
        {
          user_id: (await supabase.auth.getUser()).data.user!.id,
          lesson_id: lessonId,
          progress_seconds: Math.floor(seconds),
          completed: markComplete || completed,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );
    },
    [lessonId, completed, supabase]
  );

  function handleToggleComplete() {
    const newState = !completed;
    setCompleted(newState);

    // Fire-and-forget: optimistic UI, save in background
    (async () => {
      const userId = (await supabase.auth.getUser()).data.user!.id;
      await supabase.from("course_progress").upsert(
        {
          user_id: userId,
          lesson_id: lessonId,
          progress_seconds: 0,
          completed: newState,
          updated_at: new Date().toISOString(),
        },
        { onConflict: "user_id,lesson_id" }
      );
      // Revalidate server data so lessons overview reflects the change
      router.refresh();
    })();
  }

  // Placeholder if no Mux video yet
  if (playbackId === "PLACEHOLDER") {
    return (
      <div className="aspect-video bg-surface border border-hairline/40 rounded-sm flex items-center justify-center">
        <div className="text-center">
          <svg
            width="40"
            height="40"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1"
            className="text-muted/30 mx-auto mb-3"
          >
            <polygon points="5 3 19 12 5 21 5 3" />
          </svg>
          <p className="text-xs text-muted/40 font-body">
            Video coming soon
          </p>
          <button
            onClick={handleToggleComplete}
            className={`mt-4 px-4 py-2 text-xs font-body font-medium transition-colors rounded-sm press-scale ${
              completed
                ? "text-gold hover:text-muted"
                : "bg-gold/10 text-gold border border-gold/20 hover:bg-gold/20"
            }`}
          >
            {completed ? "✓ Mark as incomplete" : "Mark as completed"}
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      <div className="aspect-video bg-surface border border-hairline/40 rounded-sm overflow-hidden">
        {/* @ts-expect-error — mux-player web component */}
        <mux-player
          playback-id={playbackId}
          playback-token={playbackToken ?? undefined}
          metadata-video-title={lessonId}
          accent-color="#C8A45A"
          start-time={initialProgress}
          style={{ width: "100%", height: "100%", "--controls": "none" } as React.CSSProperties}
          onTimeUpdate={(e: Event) => {
            const target = e.target as HTMLMediaElement;
            if (target?.currentTime) {
              saveProgress(target.currentTime, false);
            }
          }}
          onEnded={() => {
            setCompleted(true);
            saveProgress(0, true);
          }}
        />
      </div>

      <button
        onClick={handleToggleComplete}
        className={`text-xs font-body transition-colors press-scale ${
          completed
            ? "text-gold hover:text-muted"
            : "text-muted/50 hover:text-gold"
        }`}
      >
        {completed ? "✓ Mark as incomplete" : "Mark as completed"}
      </button>
    </div>
  );
}
