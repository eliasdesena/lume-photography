import { createClient } from "@lume/supabase/server";
import { courseModules } from "@/data/course";
import DashboardSidebar from "@/components/DashboardSidebar";
import WelcomeTour from "@/components/WelcomeTour";
import PageTransition from "@/components/PageTransition";

export default async function DashboardLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const supabase = await createClient();

  const {
    data: { user },
  } = await supabase.auth.getUser();

  const { data: profile } = await supabase
    .from("profiles")
    .select("display_name, avatar_url")
    .eq("id", user!.id)
    .single();

  const { data: progress } = await supabase
    .from("course_progress")
    .select("lesson_id, completed")
    .eq("user_id", user!.id);

  const completedLessons = new Set(
    (progress ?? []).filter((p) => p.completed).map((p) => p.lesson_id)
  );

  const totalLessons = courseModules.reduce(
    (acc, mod) => acc + mod.lessons.length,
    0
  );
  const completedCount = completedLessons.size;
  const progressPct =
    totalLessons > 0 ? Math.round((completedCount / totalLessons) * 100) : 0;

  return (
    <div className="min-h-screen flex">
      {/* Desktop Sidebar */}
      <DashboardSidebar
        displayName={profile?.display_name ?? "Student"}
        avatarUrl={profile?.avatar_url}
        email={user!.email ?? ""}
        userId={user!.id}
        courseModules={courseModules}
        completedLessons={completedLessons}
        progressPct={progressPct}
        completedCount={completedCount}
        totalLessons={totalLessons}
      />

      {/* Main content */}
      <main className="flex-1 min-h-screen lg:pl-72">
        <div className="max-w-4xl mx-auto px-6 py-8">
          <PageTransition>{children}</PageTransition>
        </div>
      </main>
      <WelcomeTour />
    </div>
  );
}
