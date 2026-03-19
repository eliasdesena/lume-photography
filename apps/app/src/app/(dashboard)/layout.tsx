import { createClient } from "@lume/supabase/server";
import { courseModules } from "@/data/course";
import DashboardSidebar from "@/components/DashboardSidebar";
import BottomTabBar from "@/components/BottomTabBar";
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
    <div className="h-full flex">
      {/* Desktop Sidebar — hidden on mobile */}
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

      {/* Main scrollable area */}
      <main className="flex-1 h-full lg:pl-72">
        <div id="app-scroll">
          {/* Mobile top spacer for header bar (h-14 + safe-area-inset-top for PWA) */}
          <div className="lg:hidden" style={{ height: "calc(3.5rem + env(safe-area-inset-top, 0px))" }} />

          <div className="max-w-4xl mx-auto px-5 sm:px-6 py-6 sm:py-8 pb-tab-safe lg:pb-8 overflow-x-hidden">
            <PageTransition>{children}</PageTransition>
          </div>
        </div>
      </main>

      {/* Mobile bottom tab bar */}
      <BottomTabBar />

      <WelcomeTour />
    </div>
  );
}
