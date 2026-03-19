"use client";

/** Reusable skeleton primitives */

export function SkeletonLine({ className = "" }: { className?: string }) {
  return <div className={`skeleton h-3 rounded ${className}`} />;
}

export function SkeletonBox({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-sm ${className}`} />;
}

export function SkeletonCircle({ className = "" }: { className?: string }) {
  return <div className={`skeleton rounded-full ${className}`} />;
}

/** Dashboard home skeleton */
export function DashboardSkeleton() {
  return (
    <div className="space-y-10 pt-2 animate-fade-in">
      {/* Welcome */}
      <div>
        <SkeletonLine className="w-56 h-7 mb-3" />
        <SkeletonLine className="w-72 h-4" />
      </div>
      {/* Continue card */}
      <SkeletonBox className="h-40 w-full" />
      {/* Module grid */}
      <div>
        <SkeletonLine className="w-20 h-3 mb-4" />
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
          {[1, 2, 3, 4].map((i) => (
            <SkeletonBox key={i} className="h-36" />
          ))}
        </div>
      </div>
    </div>
  );
}

/** Lesson page skeleton */
export function LessonSkeleton() {
  return (
    <div className="space-y-6 animate-fade-in">
      <SkeletonLine className="w-40 h-3" />
      <SkeletonBox className="aspect-video w-full" />
      <div>
        <SkeletonLine className="w-72 h-6 mb-3" />
        <SkeletonLine className="w-20 h-3" />
      </div>
    </div>
  );
}

/** Lessons list skeleton */
export function LessonsListSkeleton() {
  return (
    <div className="space-y-6 pt-2 animate-fade-in">
      <div>
        <SkeletonLine className="w-32 h-7 mb-2" />
        <SkeletonLine className="w-40 h-4" />
      </div>
      {[1, 2, 3].map((mod) => (
        <div key={mod}>
          <div className="flex items-center gap-3 mb-3">
            <SkeletonCircle className="w-6 h-6" />
            <SkeletonLine className="w-40 h-4" />
          </div>
          <div className="space-y-1 ml-1">
            {[1, 2].map((l) => (
              <SkeletonBox key={l} className="h-14" />
            ))}
          </div>
        </div>
      ))}
    </div>
  );
}

/** Settings skeleton */
export function SettingsSkeleton() {
  return (
    <div className="max-w-2xl animate-fade-in">
      <div className="mb-8">
        <SkeletonLine className="w-40 h-3 mb-4" />
        <SkeletonLine className="w-56 h-8" />
      </div>
      <SkeletonBox className="h-64 w-full mb-6" />
      <SkeletonBox className="h-48 w-full mb-6" />
      <SkeletonBox className="h-20 w-full" />
    </div>
  );
}

/** Downloads skeleton */
export function DownloadsSkeleton() {
  return (
    <div className="space-y-8 pt-2 animate-fade-in">
      <div>
        <SkeletonLine className="w-36 h-7 mb-2" />
        <SkeletonLine className="w-64 h-4" />
      </div>
      <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
        {[1, 2].map((i) => (
          <SkeletonBox key={i} className="h-44" />
        ))}
      </div>
    </div>
  );
}
