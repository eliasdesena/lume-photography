import { createClient } from "@lume/supabase/server";
import { courseModules, allLessons } from "@/data/course";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function DashboardPage() {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name")
    .eq("id", user!.id)
    .single();

  const { data: progress } = await supabase
    .from("course_progress")
    .select("lesson_id, completed, updated_at")
    .eq("user_id", user!.id)
    .order("updated_at", { ascending: false });

  const completedIds = new Set(
    (progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id)
  );

  // Find the next incomplete lesson
  const nextLesson = allLessons.find((l) => !completedIds.has(l.id));

  // Recent activity — last watched
  const lastWatched = progress?.[0];
  const lastWatchedLesson = lastWatched
    ? allLessons.find((l) => l.id === lastWatched.lesson_id)
    : null;

  const totalLessons = allLessons.length;
  const completedCount = completedIds.size;

  return (
    <div className="space-y-10 pt-2">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl mb-2">
          Welcome back, {profile?.display_name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="font-body font-light text-muted text-sm">
          {completedCount === 0
            ? "Ready to start your photography journey?"
            : completedCount === totalLessons
            ? "You've completed all lessons. Incredible work!"
            : `${completedCount} of ${totalLessons} lessons complete. Keep going!`}
        </p>
      </div>

      {/* Continue where you left off */}
      {nextLesson && (
        <div className="bg-surface border border-hairline/40 rounded-sm p-6">
          <p className="text-[10px] uppercase tracking-[0.08em] text-muted/70 font-body font-medium mb-3">
            Continue learning
          </p>
          <h2 className="font-display text-lg mb-1">{nextLesson.title}</h2>
          <p className="text-xs text-muted/60 font-body mb-4">
            {nextLesson.moduleTitle} · {nextLesson.duration}
          </p>
          <Link
            href={`/lessons/${nextLesson.slug}`}
            className="inline-flex items-center bg-gold text-obsidian px-6 py-2.5 text-xs uppercase tracking-[0.06em] font-body font-medium hover:bg-cream transition-colors duration-200"
          >
            {completedCount === 0 ? "Start lesson →" : "Continue →"}
          </Link>
        </div>
      )}

      {/* Module grid */}
      <div>
        <h2 className="text-[10px] uppercase tracking-[0.08em] text-muted/70 font-body font-medium mb-4">
          Modules
        </h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {courseModules.map((mod) => {
            const modCompleted = mod.lessons.every((l) =>
              completedIds.has(l.id)
            );
            const modProgress = mod.lessons.filter((l) =>
              completedIds.has(l.id)
            ).length;

            return (
              <Link
                key={mod.id}
                href={`/lessons/${mod.lessons[0].slug}`}
                className="group bg-surface border border-hairline/40 rounded-sm p-5 hover:border-hairline transition-colors"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-[10px] text-muted/60 font-body uppercase tracking-wider">
                    Module {mod.number}
                  </span>
                  {modCompleted && (
                    <span className="text-gold text-xs">✓</span>
                  )}
                </div>
                <h3 className="font-display text-base mb-2 group-hover:text-gold transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-muted/70 font-body font-light leading-relaxed mb-3 line-clamp-2">
                  {mod.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted/60 font-body">
                  <span>
                    {modProgress}/{mod.lessons.length} lessons
                  </span>
                  <div className="flex-1 h-px bg-hairline/40" />
                  <span>
                    {mod.lessons.reduce(
                      (acc, l) =>
                        acc +
                        parseInt(l.duration.split(":")[0]) * 60 +
                        parseInt(l.duration.split(":")[1]),
                      0
                    )}{" "}
                    min
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      </div>

      {/* Downloads quick link */}
      <Link
        href="/downloads"
        className="flex items-center gap-4 bg-surface border border-hairline/40 rounded-sm p-5 hover:border-hairline transition-colors group"
      >
        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
          <svg
            width="18"
            height="18"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.5"
            className="text-gold"
          >
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div>
          <h3 className="font-body text-sm text-cream group-hover:text-gold transition-colors">
            Downloads
          </h3>
          <p className="text-xs text-muted/70 font-body">
            Lightroom presets, monetization workbook
          </p>
        </div>
      </Link>
    </div>
  );
}
