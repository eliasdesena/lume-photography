/* ── Marketing site types ── */

export interface Module {
  number: string;
  title: string;
  description: string;
}

export interface Testimonial {
  quote: string;
  name: string;
  handle: string;
}

export interface FAQ {
  question: string;
  answer: string;
}

export interface IncludesItem {
  text: string;
}

/* ── Supabase / database types ── */

export interface Profile {
  id: string;
  display_name: string | null;
  email: string;
  avatar_url: string | null;
  created_at: string;
}

export interface Entitlement {
  id: string;
  user_id: string;
  product_id: string;
  stripe_payment_intent_id: string | null;
  granted_at: string;
}

export interface Lead {
  id: string;
  name: string;
  email: string;
  stripe_payment_intent_id: string | null;
  converted: boolean;
  created_at: string;
}

export interface CourseProgress {
  id: string;
  user_id: string;
  lesson_id: string;
  completed: boolean;
  progress_seconds: number;
  updated_at: string;
}

/* ── Course content types ── */

export interface Lesson {
  id: string;
  slug: string;
  title: string;
  duration: string;
  muxPlaybackId: string;
  downloadIds?: string[];
}

export interface CourseModule {
  id: string;
  number: string;
  title: string;
  description: string;
  lessons: Lesson[];
}
