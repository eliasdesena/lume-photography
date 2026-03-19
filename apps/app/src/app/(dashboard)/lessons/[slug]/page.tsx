import { createClient } from "@lume/supabase/server";
import { allLessons, courseModules } from "@/data/course";
import { notFound } from "next/navigation";
import Link from "next/link";
import LessonPlayer from "@/components/LessonPlayer";

interface LessonPageProps {
  params: Promise<{ slug: string }>;
}

export default async function LessonPage({ params }: LessonPageProps) {
  const { slug } = await params;
  const supabase = await createClient();

  const lesson = allLessons.find((l) => l.slug === slug);
  if (!lesson) notFound();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  // Get progress for this lesson
  const { data: progress } = await supabase
    .from("course_progress")
    .select("completed, progress_seconds")
    .eq("user_id", user!.id)
    .eq("lesson_id", lesson.id)
    .single();

  // Get signed playback token
  let playbackToken: string | null = null;
  if (lesson.muxPlaybackId !== "PLACEHOLDER") {
    try {
      const res = await fetch(
        `${process.env.NEXT_PUBLIC_APP_URL ?? "http://localhost:3001"}/api/mux/sign`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ playbackId: lesson.muxPlaybackId }),
        }
      );
      if (res.ok) {
        const data = await res.json();
        playbackToken = data.token;
      }
    } catch {
      // Token signing failed — will show fallback
    }
  }

  // Find prev/next lessons
  const currentIndex = allLessons.findIndex((l) => l.slug === slug);
  const prevLesson = currentIndex > 0 ? allLessons[currentIndex - 1] : null;
  const nextLesson =
    currentIndex < allLessons.length - 1
      ? allLessons[currentIndex + 1]
      : null;

  const module = courseModules.find((m) => m.id === lesson.moduleId);
  const lessonNumber = currentIndex + 1;

  return (
    <div className="space-y-6 pb-tab-safe lg:pb-0">
      {/* Breadcrumb */}
      <div className="flex items-center gap-2">
        <Link
          href="/lessons"
          className="text-[11px] uppercase tracking-[0.06em] text-muted hover:text-cream font-body font-medium transition-colors press-scale"
        >
          ← Lessons
        </Link>
        <span className="text-muted/30 text-[11px]">/</span>
        <span className="text-[11px] uppercase tracking-[0.06em] text-muted/60 font-body font-medium">
          Module {module?.number}
        </span>
      </div>

      {/* Video player */}
      <LessonPlayer
        lessonId={lesson.id}
        playbackId={lesson.muxPlaybackId}
        playbackToken={playbackToken}
        initialProgress={progress?.progress_seconds ?? 0}
        isCompleted={progress?.completed ?? false}
      />

      {/* Lesson info */}
      <div>
        <h1 className="font-display text-xl sm:text-2xl mb-1">
          {lesson.title}
        </h1>
        <p className="text-xs text-muted font-body">
          Lesson {lessonNumber} of {allLessons.length} · {lesson.duration}
        </p>
      </div>

      {/* Prev / Next navigation — bigger touch targets */}
      <div className="flex items-stretch gap-3 pt-4 border-t border-hairline/40">
        {prevLesson ? (
          <Link
            href={`/lessons/${prevLesson.slug}`}
            prefetch={true}
            className="flex-1 bg-surface border border-hairline/60 rounded-sm px-4 py-3.5 press-scale hover:border-gold/20 transition-colors group"
          >
            <p className="text-[10px] text-muted/60 font-body uppercase tracking-wider mb-1">Previous</p>
            <p className="text-sm font-body text-muted group-hover:text-cream transition-colors truncate">
              {prevLesson.title}
            </p>
          </Link>
        ) : (
          <div className="flex-1" />
        )}
        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            prefetch={true}
            className="flex-1 bg-surface border border-hairline/60 rounded-sm px-4 py-3.5 press-scale hover:border-gold/20 transition-colors group text-right"
          >
            <p className="text-[10px] text-muted/60 font-body uppercase tracking-wider mb-1">Next</p>
            <p className="text-sm font-body text-muted group-hover:text-cream transition-colors truncate">
              {nextLesson.title}
            </p>
          </Link>
        ) : (
          <Link
            href="/"
            className="flex-1 bg-gold/10 border border-gold/20 rounded-sm px-4 py-3.5 press-scale hover:bg-gold/15 transition-colors text-right"
          >
            <p className="text-[10px] text-gold/60 font-body uppercase tracking-wider mb-1">Complete</p>
            <p className="text-sm font-body text-gold">Back to dashboard</p>
          </Link>
        )}
      </div>
    </div>
  );
}
