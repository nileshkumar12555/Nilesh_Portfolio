import { useMemo, useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { FiRefreshCw, FiCode, FiStar, FiGitBranch, FiActivity } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import { fetchGithubRepos } from "../../services/portfolioApi";
import SectionTitle from "../ui/SectionTitle";
import SkeletonCard from "../ui/SkeletonCard";

function buildLanguageChart(repos) {
  const counts = repos.reduce((accumulator, repo) => {
    const language = repo.language || "Other";
    accumulator[language] = (accumulator[language] || 0) + 1;
    return accumulator;
  }, {});
  return Object.entries(counts)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => b.value - a.value)
    .slice(0, 5);
}

function buildTimelineChart(repos) {
  const byYear = repos.reduce((accumulator, repo) => {
    const year = new Date(repo.updated_at).getFullYear();
    accumulator[year] = (accumulator[year] || 0) + 1;
    return accumulator;
  }, {});
  
  // Fill missing recent years safely up to 5 years ago
  const currentYear = new Date().getFullYear();
  for (let i = currentYear - 4; i <= currentYear; i++) {
    if (!byYear[i]) byYear[i] = 0;
  }

  return Object.entries(byYear)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => Number(a.label) - Number(b.label))
    .slice(-6);
}

// Generates aesthetic sparkline data based on a base value
const useSparkline = (baseValue) => {
  return useMemo(() => {
    return Array.from({ length: 8 }, () => Math.max(0, baseValue * 0.5 + Math.random() * baseValue * 0.8));
  }, [baseValue]);
};

const Sparkline = ({ points, colorClass }) => {
  const max = Math.max(...points, 1);
  const min = Math.min(...points, 0);
  const range = max - min || 1;
  const path = points.map((p, i) => `${(i * 100) / (points.length - 1)},${100 - ((p - min) / range) * 100}`).join(" L ");

  return (
    <svg viewBox="0 -10 100 120" className="h-6 w-16 opacity-70" preserveAspectRatio="none">
      <motion.path
        d={`M 0,${100 - ((points[0] - Math.min(...points)) / range) * 100} L ${path}`}
        fill="none"
        stroke="currentColor"
        strokeWidth="6"
        strokeLinecap="round"
        strokeLinejoin="round"
        className={colorClass}
        initial={{ pathLength: 0 }}
        animate={{ pathLength: 1 }}
        transition={{ duration: 1.5, ease: "easeOut" }}
      />
    </svg>
  );
};

const DashboardCard = ({ title, value, icon: Icon, trendLabel, colorClass }) => {
  const sparkPoints = useSparkline(value === 0 ? 5 : value);

  return (
    <motion.div
      whileHover={{ y: -3, scale: 1.01 }}
      className="group relative overflow-hidden rounded-2xl border border-subtle bg-surface-alt p-4 shadow-sm transition-all duration-300 hover:shadow-soft"
    >
      <div className={`absolute -right-6 -top-6 h-20 w-20 rounded-full opacity-0 blur-2xl transition-opacity duration-500 group-hover:opacity-15 ${colorClass.replace('text-', 'bg-')}`} />
      
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2.5">
          <div className={`rounded-md border border-subtle bg-surface p-1.5 ${colorClass}`}>
            <Icon size={16} />
          </div>
          <p className="text-xs font-semibold text-muted tracking-wide">{title}</p>
        </div>
        <Sparkline points={sparkPoints} colorClass={colorClass} />
      </div>

      <div className="mt-3 flex items-end justify-between">
        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          className="text-2xl font-bold text-content tracking-tight tabular-nums"
        >
          {value}
        </motion.div>
        <div className="text-[10px] font-medium text-muted uppercase tracking-wider bg-surface px-1.5 py-0.5 rounded-sm border border-subtle">
          {trendLabel}
        </div>
      </div>
    </motion.div>
  );
};

const SmoothLineChart = ({ data }) => {
  const [activePoint, setActivePoint] = useState(null);
  const maxValue = Math.max(...data.map(d => d.value), 4);
  const width = 400;
  const height = 120;

  // Generate cubic bezier curve path
  const createSmoothPath = () => {
    if (data.length === 0) return "";
    let path = `M 0,${height - (data[0].value / maxValue) * height}`;
    for (let i = 0; i < data.length - 1; i++) {
        const x0 = (i / (data.length - 1)) * width;
        const y0 = height - (data[i].value / maxValue) * height;
        const x1 = ((i + 1) / (data.length - 1)) * width;
        const y1 = height - (data[i + 1].value / maxValue) * height;
        const xc = (x0 + x1) / 2;
        path += ` C ${xc},${y0} ${xc},${y1} ${x1},${y1}`;
    }
    return path;
  };

  const pathString = createSmoothPath();

  return (
    <div className="relative rounded-2xl border border-subtle bg-surface-alt p-4 sm:p-5 shadow-sm h-full flex flex-col group">
       <div className="absolute inset-0 bg-gradient-to-tr from-[var(--brand)]/5 to-[var(--accent)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 rounded-2xl pointer-events-none" />
       <div className="flex items-center justify-between mb-4 z-10">
          <div>
            <h3 className="text-sm font-bold text-content">Repository Activity</h3>
            <p className="text-xs text-muted mt-0.5">Active repos by year</p>
          </div>
          <span className="flex h-2 w-2 relative">
             <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-[var(--accent)] opacity-75"></span>
             <span className="relative inline-flex rounded-full h-2 w-2 bg-[var(--accent)]"></span>
          </span>
       </div>
       
       <div className="relative flex-1 mt-2 z-10" onMouseLeave={() => setActivePoint(null)}>
          <svg viewBox={`0 -10 ${width} ${height + 20}`} className="w-full h-full overflow-visible">
            {/* Gradient definition */}
            <defs>
              <linearGradient id="lineGrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="var(--brand)" />
                <stop offset="100%" stopColor="var(--accent)" />
              </linearGradient>
              <linearGradient id="fillGrad" x1="0%" y1="0%" x2="0%" y2="100%">
                <stop offset="0%" stopColor="var(--brand)" stopOpacity="0.2" />
                <stop offset="100%" stopColor="var(--surface-alt)" stopOpacity="0" />
              </linearGradient>
            </defs>
            
            {/* Area Fill */}
            <motion.path
              d={`${pathString} L ${width},${height} L 0,${height} Z`}
              fill="url(#fillGrad)"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5, duration: 1 }}
            />

            {/* Line */}
            <motion.path
              d={pathString}
              fill="none"
              stroke="url(#lineGrad)"
              strokeWidth="3"
              strokeLinecap="round"
              initial={{ pathLength: 0 }}
              animate={{ pathLength: 1 }}
              transition={{ duration: 1.5, ease: "easeInOut" }}
            />

            {/* Hover Targets & Points */}
            {data.map((item, index) => {
              const x = (index / (data.length - 1)) * width;
              const y = height - (item.value / maxValue) * height;
              return (
                <g key={item.label}>
                  {/* Invisible larger circle for easier hovering */}
                  <circle cx={x} cy={y} r="20" fill="transparent" onMouseEnter={() => setActivePoint({ x, y, ...item })} className="cursor-pointer" />
                  <motion.circle 
                    cx={x} 
                    cy={y} 
                    r="4" 
                    fill="var(--surface-alt)" 
                    stroke={activePoint?.label === item.label ? "var(--brand)" : "var(--accent)"} 
                    strokeWidth="2.5" 
                    className="pointer-events-none transition-all duration-200"
                    animate={{ r: activePoint?.label === item.label ? 6 : 4 }}
                  />
                </g>
              );
            })}
          </svg>

          {/* HTML Tooltip (absolute positioned over SVG) */}
          <AnimatePresence>
            {activePoint && (
              <motion.div
                initial={{ opacity: 0, y: 5, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.15 }}
                className="absolute pointer-events-none flex flex-col items-center z-20"
                style={{ 
                  left: `${(data.findIndex(d => d.label === activePoint.label) / (data.length - 1)) * 100}%`, 
                  top: `calc(${((height - (activePoint.value / maxValue) * height) / height) * 100}% - 40px)`,
                  transform: 'translateX(-50%)' 
                }}
              >
                <div className="bg-content text-surface text-[10px] font-bold px-2 py-1 rounded shadow-lg whitespace-nowrap">
                  {activePoint.label}: {activePoint.value}
                </div>
                <div className="w-0 h-0 border-l-[4px] border-r-[4px] border-t-[4px] border-l-transparent border-r-transparent border-t-content -mt-px" />
              </motion.div>
            )}
          </AnimatePresence>
       </div>
    </div>
  );
};

const MinimalBarChart = ({ data }) => {
  const maxValue = Math.max(...data.map(d => d.value), 1);
  return (
    <div className="rounded-2xl border border-subtle bg-surface-alt p-4 sm:p-5 shadow-sm h-full">
      <h3 className="text-sm font-bold text-content mb-4">Top Languages</h3>
      <div className="space-y-3.5">
        {data.map((item, idx) => (
          <div key={item.label} className="relative group">
            <div className="flex justify-between text-[11px] mb-1.5 font-medium">
              <span className="text-content group-hover:text-[var(--brand)] transition-colors">{item.label}</span>
              <span className="text-muted">{item.value}</span>
            </div>
            <div className="h-1.5 w-full bg-surface rounded-full overflow-hidden">
              <motion.div
                initial={{ width: 0 }}
                animate={{ width: `${Math.max((item.value / maxValue) * 100, 2)}%` }}
                transition={{ duration: 1, delay: idx * 0.1, ease: "easeOut" }}
                className="h-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)] rounded-full"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
};

export default function InsightsSection() {
  const { data, error, loading, refetch } = useFetch((signal) => fetchGithubRepos(signal), []);

  const metrics = useMemo(() => {
    if (!data?.length) return null;
    const stars = data.reduce((total, repo) => total + repo.stargazers_count, 0);
    const forks = data.reduce((total, repo) => total + repo.forks_count, 0);
    const recentRepos = data.filter((repo) => {
      const updatedAt = new Date(repo.updated_at);
      const ninetyDaysAgo = Date.now() - 1000 * 60 * 60 * 24 * 90;
      return updatedAt.getTime() > ninetyDaysAgo;
    }).length;

    return {
      repoCount: data.length,
      stars,
      forks,
      recentRepos,
      languageChart: buildLanguageChart(data),
      timelineChart: buildTimelineChart(data),
    };
  }, [data]);

  return (
    <section id="insights" className="mx-auto max-w-7xl px-4 py-12 sm:px-6 lg:px-8">
      <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 mb-8">
        <SectionTitle
          eyebrow="Data Driven"
          title="Live Developer Dashboard"
          description="Compact, animated, and interactive GitHub insights."
        />
        <button
          type="button"
          onClick={refetch}
          className="group inline-flex items-center gap-2 rounded-lg border border-subtle bg-surface-alt px-3 py-1.5 text-xs font-semibold shadow-sm transition hover:-translate-y-0.5 hover:border-[var(--brand)] hover:shadow-soft self-start sm:self-auto"
        >
          <FiRefreshCw size={14} className="text-muted group-hover:text-[var(--brand)] group-hover:animate-spin" />
          Sync
        </button>
      </div>

      {loading ? (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
          <SkeletonCard />
        </div>
      ) : null}

      {!loading && error ? (
        <div className="rounded-xl border border-red-300 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">
          <p className="font-semibold">Could not load dashboard data.</p>
          <p className="mt-1">{error}</p>
        </div>
      ) : null}

      {!loading && !error && metrics ? (
        <div className="space-y-4 lg:space-y-5">
          {/* KPI Cards Grid */}
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <DashboardCard 
              title="Repositories" 
              value={metrics.repoCount} 
              icon={FiCode} 
              trendLabel="Total" 
              colorClass="text-blue-500" 
            />
            <DashboardCard 
              title="Total Stars" 
              value={metrics.stars} 
              icon={FiStar} 
              trendLabel="Starred" 
              colorClass="text-[var(--brand)]" 
            />
            <DashboardCard 
              title="Total Forks" 
              value={metrics.forks} 
              icon={FiGitBranch} 
              trendLabel="Network" 
              colorClass="text-emerald-500" 
            />
            <DashboardCard 
              title="Active (90d)" 
              value={metrics.recentRepos} 
              icon={FiActivity} 
              trendLabel="Recent" 
              colorClass="text-purple-500" 
            />
          </div>

          {/* Charts Row */}
          <div className="grid gap-4 lg:grid-cols-5 h-auto">
            <div className="lg:col-span-3 h-full min-h-[220px]">
              <SmoothLineChart data={metrics.timelineChart} />
            </div>
            <div className="lg:col-span-2 h-full min-h-[220px]">
              <MinimalBarChart data={metrics.languageChart} />
            </div>
          </div>
        </div>
      ) : null}
    </section>
  );
}
