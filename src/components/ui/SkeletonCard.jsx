export default function SkeletonCard() {
  return (
    <div className="animate-pulse rounded-2xl border border-subtle bg-surface-alt p-5">
      <div className="h-3 w-1/2 rounded bg-slate-300/70 dark:bg-slate-700/70" />
      <div className="mt-4 h-8 w-2/3 rounded bg-slate-300/70 dark:bg-slate-700/70" />
      <div className="mt-3 h-2 w-1/3 rounded bg-slate-300/70 dark:bg-slate-700/70" />
    </div>
  );
}
