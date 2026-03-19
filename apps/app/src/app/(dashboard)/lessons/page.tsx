import { createClient } from "@lume/supabase/server";
import { courseModules, allLessons } from "@/data/course";
import Link from "next/link";

export const dynamic = "force-dynamic";

export default async function LessonsPage() {
  const supabase = await createClient();
  const { data: { user } } = await supabase.auth.getUser();

  const { data: progress } = await supabase
    .from("course_progress")
    .select("lesson_id, completed")
    .eq("user_id", user!.id);

  const completedIds = new Set(
    (progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id)
  );

  const totalLessons = allLessons.length;
  const completedCount = completedIds.size;

  return (
    <div className="space-y-6 pt-2 min-w-0 overflow-hidden">
      <div>
        <h1 className="font-display text-2xl sm:text-3xl mb-1">Lessons</h1>
        <p className="font-body font-light text-muted text-sm">
          {completedCount} of {totalLessons} complete
        </p>
      </div>

      <div className="space-y-6">
        {courseModules.map((mod) => {
          const modCompleted = mod.lessons.every((l) => completedIds.has(l.id));
          const modProgress = mod.lessons.filter((l) => completedIds.has(l.id)).length;

          return (
            <div key={mod.id}>
              {/* Module header */}
              <div className="flex items-center gap-3 mb-3">
                <span className={`w-6 h-6 rounded-full flex items-center justify-center text-[10px] font-body font-medium border ${
                  modCompleted
                    ? "bg-gold/20 border-gold/40 text-gold"
                    : "bg-surface border-hairline text-muted"
                }`}>
                  {modCompleted ? "✓" : mod.number}
                </span>
                <div className="flex-1 min-w-0">
                  <h2 className="font-display text-base text-cream text-fade-right">{mod.title}</h2>
                  <p className="text-[11px] text-muted font-body">
                    {modProgress}/{mod.lessons.length} lessons
                  </p>
                </div>
              </div>

              {/* Lessons */}
              <div className="space-y-1 ml-1 min-w-0">
                {mod.lessons.map((lesson) => {
                  const isComplete = completedIds.has(lesson.id);
                  return (
                    <Link
                      key={lesson.id}
                      href={`/lessons/${lesson.slug}`}
                      prefetch={true}
                      className="flex items-center gap-3 bg-surface border border-hairline/60 rounded-sm px-4 py-3.5 press-scale hover:border-gold/20 transition-colors group overflow-hidden min-w-0 w-full"
                    >
                      {/* Status indicator */}
                      <div className={`w-5 h-5 rounded-full flex items-center justify-center shrink-0 ${
                        isComplete
                          ? "bg-gold/20 text-gold"
                          : "bg-surface-2 text-muted/40"
                      }`}>
                        {isComplete ? (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3">
                            <polyline points="20 6 9 17 4 12" />
                          </svg>
                        ) : (
                          <svg width="10" height="10" viewBox="0 0 24 24" fill="currentColor">
                            <polygon points="5 3 19 12 5 21 5 3" />
                          </svg>
                        )}
                      </div>

                      <div className="flex-1 min-w-0 overflow-hidden">
                        <p className={`font-body text-sm whitespace-nowrap ${
                          isComplete ? "text-muted" : "text-cream"
                        } group-hover:text-gold transition-colors`}>
                          {lesson.title}
                        </p>
                      </div>

                      <span className="text-[11px] text-muted/60 font-body shrink-0">
                        {lesson.duration}
                      </span>
                    </Link>
                  );
                })}
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
