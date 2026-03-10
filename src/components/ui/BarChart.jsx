import { useState } from "react";

export default function BarChart({ data }) {
  const [activeLabel, setActiveLabel] = useState("");
  const maxValue = Math.max(...data.map((item) => item.value), 1);

  return (
    <div className="rounded-2xl border border-subtle bg-surface-alt p-5">
      <h3 className="text-lg font-bold">Top Languages</h3>
      <div className="mt-5 space-y-4">
        {data.map((item) => (
          <div
            key={item.label}
            onMouseEnter={() => setActiveLabel(item.label)}
            onMouseLeave={() => setActiveLabel("")}
          >
            <div className="mb-1 flex items-center justify-between text-sm">
              <span className="font-semibold text-content">{item.label}</span>
              <span className="text-muted">{item.value} repos</span>
            </div>
            <div className="relative h-2 overflow-hidden rounded-full bg-slate-200 dark:bg-slate-700">
              <div
                className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] transition-all duration-700"
                style={{ width: `${Math.max((item.value / maxValue) * 100, 4)}%` }}
              />

              {activeLabel === item.label ? (
                <div
                  className="pointer-events-none absolute -top-8 rounded-lg border border-subtle bg-surface px-2.5 py-1 text-[11px] font-semibold shadow-soft"
                  style={{ left: `calc(${Math.max((item.value / maxValue) * 100, 4)}% - 30px)` }}
                >
                  {item.label}: {item.value}
                </div>
              ) : null}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
