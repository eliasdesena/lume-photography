import { createClient } from "@lume/supabase/server";
import { allLessons, courseModules } from "@/data/course";
import { notFound } from "next/navigation";
import Link from "next/link";
import LessonPlayer from "@/components/LessonPlayer";
import jwt from "jsonwebtoken";

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

  // Sign playback + thumbnail tokens (server component — no self-fetch needed)
  let playbackToken: string | null = null;
  let thumbnailToken: string | null = null;
  if (lesson.muxPlaybackId !== "PLACEHOLDER") {
    const signingKeyId = process.env.MUX_SIGNING_KEY_ID;
    const signingKeyPrivate = process.env.MUX_SIGNING_KEY_PRIVATE;
    if (signingKeyId && signingKeyPrivate) {
      const key = Buffer.from(signingKeyPrivate, "base64");
      const exp = Math.floor(Date.now() / 1000) + 60 * 60;
      try {
        playbackToken = jwt.sign(
          { sub: lesson.muxPlaybackId, aud: "v", exp, kid: signingKeyId },
          key,
          { algorithm: "RS256" }
        );
        thumbnailToken = jwt.sign(
          { sub: lesson.muxPlaybackId, aud: "t", exp, kid: signingKeyId },
          key,
          { algorithm: "RS256" }
        );
      } catch {
        // Token signing failed — player will show error
      }
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
    <div className="space-y-6">
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
        thumbnailToken={thumbnailToken}
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

      {/* Prev / Next navigation */}
      <div className="flex flex-col gap-2 pt-4 border-t border-hairline/40">
        {nextLesson ? (
          <Link
            href={`/lessons/${nextLesson.slug}`}
            prefetch={true}
            className="flex items-center justify-between bg-surface border border-hairline/60 rounded-sm px-4 py-3.5 press-scale hover:border-gold/20 transition-colors group"
          >
            <div className="min-w-0 mr-3">
              <p className="text-[10px] text-muted/60 font-body uppercase tracking-wider mb-0.5">Next lesson</p>
              <p className="text-sm font-body text-cream group-hover:text-gold transition-colors truncate">
                {nextLesson.title}
              </p>
            </div>
            <span className="text-muted/40 shrink-0">→</span>
          </Link>
        ) : (
          <Link
            href="/"
            className="flex items-center justify-between bg-gold/10 border border-gold/20 rounded-sm px-4 py-3.5 press-scale hover:bg-gold/15 transition-colors"
          >
            <div>
              <p className="text-[10px] text-gold/60 font-body uppercase tracking-wider mb-0.5">All done</p>
              <p className="text-sm font-body text-gold">Back to dashboard</p>
            </div>
            <span className="text-gold/40 shrink-0">→</span>
          </Link>
        )}
        {prevLesson && (
          <Link
            href={`/lessons/${prevLesson.slug}`}
            prefetch={false}
            className="flex items-center bg-surface/50 border border-hairline/40 rounded-sm px-4 py-3 press-scale hover:border-gold/20 transition-colors group"
          >
            <span className="text-muted/40 shrink-0 mr-3">←</span>
            <div className="min-w-0">
              <p className="text-[10px] text-muted/60 font-body uppercase tracking-wider mb-0.5">Previous</p>
              <p className="text-xs font-body text-muted group-hover:text-cream transition-colors truncate">
                {prevLesson.title}
              </p>
            </div>
          </Link>
        )}
      </div>
    </div>
  );
}
