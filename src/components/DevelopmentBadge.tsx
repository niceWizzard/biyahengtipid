'use client';

export default function DevelopmentBadge() {
  return (
    <div className="fixed top-4 right-4 z-40">
      <div className="bg-amber-500/10 border border-amber-500/30 rounded-full px-3 py-1.5 flex items-center gap-2">
        <div className="w-2 h-2 bg-amber-500 rounded-full animate-pulse"></div>
        <span className="text-xs font-semibold text-amber-700 dark:text-amber-400">
          Development Project
        </span>
      </div>
    </div>
  );
}
