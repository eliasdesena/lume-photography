import type { CourseModule } from "@lume/types";

/**
 * Course structure — Mux playback IDs are added per lesson
 * after uploading videos to the Mux dashboard.
 * For MVP, use placeholder IDs that will be replaced.
 */
export const courseModules: CourseModule[] = [
  {
    id: "mod-01",
    number: "01",
    title: "iPhone Camera Basics",
    description:
      "Your camera app is more powerful than you think. Learn ProRAW, manual focus, exposure lock, and the hidden settings that instantly improve every photo.",
    lessons: [
      {
        id: "les-01-01",
        slug: "camera-app-overview",
        title: "The Camera App — A Deep Dive",
        duration: "12:30",
        muxPlaybackId: "PLACEHOLDER",
      },
      {
        id: "les-01-02",
        slug: "proraw-and-formats",
        title: "ProRAW, HEIF & JPEG — When to Use Each",
        duration: "8:15",
        muxPlaybackId: "PLACEHOLDER",
      },
      {
        id: "les-01-03",
        slug: "manual-focus-exposure",
        title: "Manual Focus & Exposure Lock",
        duration: "10:45",
        muxPlaybackId: "PLACEHOLDER",
      },
    ],
  },
  {
    id: "mod-02",
    number: "02",
    title: "Settings & Modes",
    description:
      "Night mode, Cinematic, Portrait — when to use each and how to set up your iPhone once so every shot starts right.",
    lessons: [
      {
        id: "les-02-01",
        slug: "portrait-mode-mastery",
        title: "Portrait Mode Mastery",
        duration: "11:00",
        muxPlaybackId: "PLACEHOLDER",
      },
      {
        id: "les-02-02",
        slug: "night-cinematic",
        title: "Night Mode & Cinematic Video",
        duration: "9:30",
        muxPlaybackId: "PLACEHOLDER",
      },
    ],
  },
  {
    id: "mod-03",
    number: "03",
    title: "Light & Composition",
    description:
      "Light makes or breaks a photo. Learn to read natural light, use golden hour, and compose shots that stop people mid-scroll.",
    lessons: [
      {
        id: "les-03-01",
        slug: "reading-natural-light",
        title: "Reading Natural Light",
        duration: "14:20",
        muxPlaybackId: "PLACEHOLDER",
      },
      {
        id: "les-03-02",
        slug: "composition-rules",
        title: "Composition Rules That Actually Matter",
        duration: "12:00",
        muxPlaybackId: "PLACEHOLDER",
      },
      {
        id: "les-03-03",
        slug: "golden-hour",
        title: "Golden Hour — The Cheat Code",
        duration: "8:45",
        muxPlaybackId: "PLACEHOLDER",
      },
    ],
  },
  {
    id: "mod-04",
    number: "04",
    title: "Editing in Lightroom & Snapseed",
    description:
      "Build a signature edit in under 2 minutes. Presets, color grading, and export settings for Instagram, print, and client work.",
    lessons: [
      {
        id: "les-04-01",
        slug: "lightroom-mobile-workflow",
        title: "Lightroom Mobile — Full Workflow",
        duration: "18:00",
        muxPlaybackId: "PLACEHOLDER",
      },
      {
        id: "les-04-02",
        slug: "snapseed-advanced",
        title: "Snapseed Advanced Techniques",
        duration: "11:30",
        muxPlaybackId: "PLACEHOLDER",
      },
      {
        id: "les-04-03",
        slug: "presets-export",
        title: "Creating Presets & Export Settings",
        duration: "9:00",
        muxPlaybackId: "PLACEHOLDER",
        downloadIds: ["lightroom-presets"],
      },
    ],
  },
  {
    id: "mod-05",
    number: "05",
    title: "How to Sell Your Photos",
    description:
      "Stock licensing, brand deals, building a portfolio, and finding your first paying client — step by step.",
    lessons: [
      {
        id: "les-05-01",
        slug: "stock-licensing",
        title: "Stock Photography — Getting Started",
        duration: "13:15",
        muxPlaybackId: "PLACEHOLDER",
      },
      {
        id: "les-05-02",
        slug: "portfolio-brand-deals",
        title: "Portfolio Building & Brand Deals",
        duration: "15:00",
        muxPlaybackId: "PLACEHOLDER",
        downloadIds: ["monetization-workbook"],
      },
    ],
  },
];

/** Flat list of all lessons for quick lookups */
export const allLessons = courseModules.flatMap((mod) =>
  mod.lessons.map((lesson) => ({ ...lesson, moduleId: mod.id, moduleTitle: mod.title }))
);

/** Downloadable assets */
export const downloadableAssets = [
  {
    id: "lightroom-presets",
    title: "Lightroom Mobile Preset Pack",
    description: "10 cinematic presets crafted for iPhone photos",
    filename: "lume-lightroom-presets.zip",
    storagePath: "presets/lume-lightroom-presets.zip",
  },
  {
    id: "monetization-workbook",
    title: "Monetization Workbook",
    description: "Step-by-step PDF guide to selling your photos",
    filename: "lume-monetization-workbook.pdf",
    storagePath: "workbooks/lume-monetization-workbook.pdf",
  },
];
