import { createServerClient } from "@supabase/ssr";
import webpush from "web-push";
import { NextResponse } from "next/server";
import { allLessons } from "@/data/course";

// Authorize cron calls with a shared secret
const CRON_SECRET = process.env.CRON_SECRET;

const VAPID_PUBLIC_KEY = process.env.NEXT_PUBLIC_VAPID_PUBLIC_KEY!;
const VAPID_PRIVATE_KEY = process.env.VAPID_PRIVATE_KEY!;
const VAPID_EMAIL = process.env.VAPID_EMAIL ?? "mailto:hello@lumephoto.co";

webpush.setVapidDetails(VAPID_EMAIL, VAPID_PUBLIC_KEY, VAPID_PRIVATE_KEY);

// Reminder messages for different engagement levels
const MESSAGES = {
  notStarted: [
    {
      title: "Your journey awaits 📸",
      body: "You haven't started the course yet. Your first lesson takes just a few minutes — make your investment count.",
    },
    {
      title: "Ready when you are",
      body: "LUMÉ is waiting. Start Lesson 1 today and see the difference in your first photo.",
    },
  ],
  inactive: [
    {
      title: "Pick up where you left off",
      body: "It's been a while since your last lesson. Consistency turns good photographers into great ones.",
    },
    {
      title: "Your course misses you",
      body: "A few minutes a day is all it takes. Jump back in and keep building your skills.",
    },
    {
      title: "Don't let momentum slip",
      body: "You've already made the investment — now make it pay off. Your next lesson is ready.",
    },
  ],
};

function pickRandom<T>(arr: T[]): T {
  return arr[Math.floor(Math.random() * arr.length)];
}

export async function POST(request: Request) {
  // Verify cron secret
  const authHeader = request.headers.get("authorization");
  if (CRON_SECRET && authHeader !== `Bearer ${CRON_SECRET}`) {
    return NextResponse.json({ error: "Unauthorized" }, { status: 401 });
  }

  if (!VAPID_PUBLIC_KEY || !VAPID_PRIVATE_KEY) {
    return NextResponse.json(
      { error: "VAPID keys not configured" },
      { status: 500 }
    );
  }

  // Use service-role client to read all users' data
  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SECRET_KEY!,
    { cookies: { getAll: () => [], setAll: () => {} } }
  );

  // Get all push subscriptions with user entitlements and progress
  const { data: subscriptions } = await supabase
    .from("push_subscriptions")
    .select("id, user_id, endpoint, keys_p256dh, keys_auth");

  if (!subscriptions?.length) {
    return NextResponse.json({ sent: 0, message: "No subscriptions" });
  }

  // Get unique user IDs
  const userIds = [...new Set(subscriptions.map((s) => s.user_id))];

  // Get entitlements for these users
  const { data: entitlements } = await supabase
    .from("entitlements")
    .select("user_id")
    .in("user_id", userIds);

  const entitledUserIds = new Set(entitlements?.map((e) => e.user_id) ?? []);

  // Get latest progress for entitled users
  const { data: progress } = await supabase
    .from("course_progress")
    .select("user_id, lesson_id, completed, updated_at")
    .in("user_id", userIds);

  const totalLessons = allLessons.length;
  let sent = 0;
  let failed = 0;
  const staleEndpoints: string[] = [];

  for (const userId of userIds) {
    // Only remind entitled users
    if (!entitledUserIds.has(userId)) continue;

    const userProgress = (progress ?? []).filter((p) => p.user_id === userId);
    const completedCount = userProgress.filter((p) => p.completed).length;

    // Skip if they've completed the course
    if (completedCount >= totalLessons) continue;

    // Determine last activity
    const latestActivity = userProgress
      .map((p) => new Date(p.updated_at).getTime())
      .sort((a, b) => b - a)[0];

    const daysSinceActivity = latestActivity
      ? Math.floor((Date.now() - latestActivity) / (1000 * 60 * 60 * 24))
      : Infinity;

    let message: { title: string; body: string } | null = null;
    let url = "/";

    if (completedCount === 0 && daysSinceActivity > 2) {
      // Bought but never started — nudge after 2 days
      message = pickRandom(MESSAGES.notStarted);
      url = `/lessons/${allLessons[0].slug}`;
    } else if (daysSinceActivity >= 5) {
      // Haven't engaged in 5+ days
      message = pickRandom(MESSAGES.inactive);
      // Deep-link to their next incomplete lesson
      const nextLesson = allLessons.find(
        (l) => !userProgress.some((p) => p.lesson_id === l.id && p.completed)
      );
      if (nextLesson) url = `/lessons/${nextLesson.slug}`;
    }

    if (!message) continue;

    // Send to all of this user's subscriptions
    const userSubs = subscriptions.filter((s) => s.user_id === userId);
    for (const sub of userSubs) {
      try {
        await webpush.sendNotification(
          {
            endpoint: sub.endpoint,
            keys: { p256dh: sub.keys_p256dh, auth: sub.keys_auth },
          },
          JSON.stringify({ ...message, url, tag: "lume-reminder" })
        );
        sent++;
      } catch (err) {
        failed++;
        // If subscription is expired/invalid (410 Gone), mark for cleanup
        if (err instanceof webpush.WebPushError && err.statusCode === 410) {
          staleEndpoints.push(sub.endpoint);
        }
      }
    }
  }

  // Clean up stale subscriptions
  if (staleEndpoints.length > 0) {
    await supabase
      .from("push_subscriptions")
      .delete()
      .in("endpoint", staleEndpoints);
  }

  return NextResponse.json({
    sent,
    failed,
    cleaned: staleEndpoints.length,
  });
}
