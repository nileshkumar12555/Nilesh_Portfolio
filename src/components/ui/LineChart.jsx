import { useMemo, useState } from "react";

function createPath(points, width, height, maxValue) {
  if (!points.length) {
    return "";
  }

  return points
    .map((point, index) => {
      const x = (index / Math.max(points.length - 1, 1)) * width;
      const y = height - (point.value / Math.max(maxValue, 1)) * height;
      return `${index === 0 ? "M" : "L"}${x.toFixed(1)} ${y.toFixed(1)}`;
    })
    .join(" ");
}

export default function LineChart({ data }) {
  const [activePoint, setActivePoint] = useState(null);
  const width = 460;
  const height = 180;
  const maxValue = Math.max(...data.map((item) => item.value), 1);
  const path = createPath(data, width, height, maxValue);
  const pathLength = useMemo(() => {
    return path.split("L").length * 36;
  }, [path]);

  return (
    <div className="rounded-xl border border-subtle bg-surface-alt p-3">
      <h3 className="text-base font-bold mb-2">Repository Activity</h3>
      <svg viewBox={`0 0 ${width} ${height}`} className="w-full">
        <path
          d={path}
          fill="none"
          stroke="var(--accent)"
          strokeWidth="3"
          strokeLinecap="round"
          style={{ strokeDasharray: pathLength, strokeDashoffset: 0, animation: "draw-path 1.2s ease-out" }}
        />

        {data.map((item, index) => {
          const cx = (index / Math.max(data.length - 1, 1)) * width;
          const cy = height - (item.value / maxValue) * height;
          return (
            <g
              key={item.label}
              onMouseEnter={() => setActivePoint({ x: cx, y: cy, label: item.label, value: item.value })}
              onMouseLeave={() => setActivePoint(null)}
            >
              <circle cx={cx} cy={cy} r="5" fill="var(--brand)" className="transition-all duration-200 hover:r-6" />
            </g>
          );
        })}

        {activePoint ? (
          <g>
            <rect
              x={Math.max(activePoint.x - 40, 4)}
              y={Math.max(activePoint.y - 34, 4)}
              width="84"
              height="24"
              rx="6"
              fill="var(--surface-alt)"
              stroke="var(--border)"
            />
            <text x={Math.max(activePoint.x - 34, 8)} y={Math.max(activePoint.y - 18, 18)} fill="var(--content)" fontSize="10" fontWeight="700">
              {`${activePoint.label}: ${activePoint.value}`}
            </text>
          </g>
        ) : null}
      </svg>
      <div className="mt-3 flex flex-wrap gap-3 text-xs text-muted">
        {data.map((item) => (
          <span key={item.label} className="rounded-full bg-surface px-3 py-1">
            {item.label}
          </span>
        ))}
      </div>
    </div>
  );
}
