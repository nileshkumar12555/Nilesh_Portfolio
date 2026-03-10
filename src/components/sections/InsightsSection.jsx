import { useMemo } from "react";
import { FiRefreshCw } from "react-icons/fi";
import useFetch from "../../hooks/useFetch";
import { fetchGithubRepos } from "../../services/portfolioApi";
import BarChart from "../ui/BarChart";
import KpiCard from "../ui/KpiCard";
import LineChart from "../ui/LineChart";
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

  return Object.entries(byYear)
    .map(([label, value]) => ({ label, value }))
    .sort((a, b) => Number(a.label) - Number(b.label))
    .slice(-6);
}

export default function InsightsSection() {
  const { data, error, loading, refetch } = useFetch((signal) => fetchGithubRepos(signal), []);

  const metrics = useMemo(() => {
    if (!data?.length) {
      return null;
    }

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
    <section id="insights" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <div className="flex flex-wrap items-start justify-between gap-3">
        <SectionTitle
          eyebrow="Data Driven"
          title="Live Developer Dashboard"
          description="Dynamic GitHub integration with loading, error handling, and visual insights."
        />

        <button
          type="button"
          onClick={refetch}
          className="mt-2 inline-flex items-center gap-2 rounded-xl border border-subtle bg-surface-alt px-4 py-2 text-sm font-semibold transition hover:-translate-y-0.5 hover:border-[var(--accent)]"
        >
          <FiRefreshCw size={16} className="animate-[spin_2.8s_linear_infinite]" />
          Refresh Data
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
        <div className="rounded-2xl border border-red-300 bg-red-50 p-5 text-red-700 dark:border-red-800 dark:bg-red-950/20 dark:text-red-300">
          <p className="font-semibold">Could not load dashboard data.</p>
          <p className="mt-1 text-sm">{error}</p>
        </div>
      ) : null}

      {!loading && !error && metrics ? (
        <div className="space-y-6 rounded-3xl border border-subtle bg-surface-alt p-4 sm:p-6">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <KpiCard label="Repositories" value={metrics.repoCount} trend="Updated from GitHub API" />
            <KpiCard label="Total Stars" value={metrics.stars} trend="Community confidence" />
            <KpiCard label="Total Forks" value={metrics.forks} trend="Reuse and contribution" />
            <KpiCard label="Active (90 Days)" value={metrics.recentRepos} trend="Execution consistency" />
          </div>

          <div className="grid gap-5 xl:grid-cols-2">
            <BarChart data={metrics.languageChart} />
            <LineChart data={metrics.timelineChart} />
          </div>
        </div>
      ) : null}
    </section>
  );
}
