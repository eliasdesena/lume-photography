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

  const totalLessons = allLessons.length;
  const completedCount = completedIds.size;
  const allComplete = completedCount === totalLessons && totalLessons > 0;
  const progressPct = totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="space-y-8 sm:space-y-10 pt-1 pb-tab-safe lg:pb-0">
      {/* Welcome */}
      <div>
        <h1 className="font-display text-2xl sm:text-3xl mb-2">
          Welcome back, {profile?.display_name?.split(" ")[0] ?? "there"}
        </h1>
        <p className="font-body font-light text-muted text-sm">
          {completedCount === 0
            ? "Ready to start your photography journey?"
            : allComplete
            ? "You\u2019ve completed all lessons. Incredible work!"
            : `${completedCount} of ${totalLessons} lessons complete. Keep going!`}
        </p>

        {/* Mobile-only progress bar (desktop has it in sidebar) */}
        <div className="lg:hidden mt-4">
          <div className="flex items-center justify-between text-[11px] text-muted font-body mb-1.5">
            <span>{progressPct}% complete</span>
            <span>{completedCount}/{totalLessons}</span>
          </div>
          <div className="h-1.5 bg-surface-2 rounded-full overflow-hidden">
            <div
              className="h-full bg-gold rounded-full transition-all duration-500"
              style={{ width: `${progressPct}%` }}
            />
          </div>
        </div>
      </div>

      {/* Course complete celebration */}
      {allComplete && (
        <div className="bg-gold/10 border border-gold/20 rounded-sm p-6 text-center">
          <p className="font-display text-2xl text-gold mb-2">Course complete</p>
          <p className="text-sm text-muted font-body">
            You&apos;ve finished every lesson. Revisit any module below, or grab your downloads.
          </p>
        </div>
      )}

      {/* Continue where you left off */}
      {nextLesson && (
        <Link
          href={`/lessons/${nextLesson.slug}`}
          prefetch={true}
          className="block bg-surface border border-hairline rounded-sm p-5 sm:p-6 press-scale hover:border-gold/20 transition-colors group"
        >
          <p className="text-label text-muted mb-3">
            Continue learning
          </p>
          <h2 className="font-display text-lg mb-1 group-hover:text-gold transition-colors">
            {nextLesson.title}
          </h2>
          <p className="text-xs text-muted font-body mb-4">
            {nextLesson.moduleTitle} · {nextLesson.duration}
          </p>
          <span className="inline-flex items-center bg-gold text-obsidian px-6 py-2.5 text-xs uppercase tracking-[0.06em] font-body font-medium rounded-sm">
            {completedCount === 0 ? "Start lesson →" : "Continue →"}
          </span>
        </Link>
      )}

      {/* Module grid */}
      <div>
        <h2 className="text-label text-muted mb-4">Modules</h2>
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 sm:gap-4">
          {courseModules.map((mod) => {
            const modCompleted = mod.lessons.every((l) => completedIds.has(l.id));
            const modProgress = mod.lessons.filter((l) => completedIds.has(l.id)).length;

            return (
              <Link
                key={mod.id}
                href={`/lessons/${mod.lessons[0].slug}`}
                prefetch={true}
                className="group bg-surface border border-hairline rounded-sm p-4 sm:p-5 hover:border-gold/20 transition-colors press-scale"
              >
                <div className="flex items-start justify-between mb-3">
                  <span className="text-label text-gold-dim">Module {mod.number}</span>
                  {modCompleted && <span className="text-gold text-xs">✓</span>}
                </div>
                <h3 className="font-display text-base mb-2 group-hover:text-gold transition-colors">
                  {mod.title}
                </h3>
                <p className="text-xs text-muted font-body font-light leading-relaxed mb-3 line-clamp-2">
                  {mod.description}
                </p>
                <div className="flex items-center gap-2 text-[10px] text-muted/80 font-body">
                  <span>{modProgress}/{mod.lessons.length} lessons</span>
                  <div className="flex-1 h-px bg-hairline" />
                  <span>
                    {mod.lessons.reduce((acc, l) => {
                      const parts = l.duration.split(":");
                      return acc + (parseInt(parts[0] || "0") * 60) + parseInt(parts[1] || "0");
                    }, 0)} min
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
        prefetch={true}
        className="flex items-center gap-4 bg-surface border border-hairline rounded-sm p-4 sm:p-5 hover:border-gold/20 transition-colors group press-scale"
      >
        <div className="w-10 h-10 rounded-full bg-gold/10 border border-gold/20 flex items-center justify-center shrink-0">
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-gold">
            <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
            <polyline points="7 10 12 15 17 10" />
            <line x1="12" y1="15" x2="12" y2="3" />
          </svg>
        </div>
        <div>
          <h3 className="font-body text-sm text-cream group-hover:text-gold transition-colors">Downloads</h3>
          <p className="text-xs text-muted font-body">Lightroom presets, monetization workbook</p>
        </div>
      </Link>
    </div>
  );
}
