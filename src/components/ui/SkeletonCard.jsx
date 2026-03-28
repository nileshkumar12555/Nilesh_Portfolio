export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-xl border border-subtle bg-surface-alt p-3">
      <div className="h-2 w-1/2 rounded bg-slate-300/70 dark:bg-slate-700/70" />
      <div className="mt-2 h-6 w-2/3 rounded bg-slate-300/70 dark:bg-slate-700/70" />
      <div className="mt-2 h-2 w-1/3 rounded bg-slate-300/70 dark:bg-slate-700/70" />
    </div>
  );
}
