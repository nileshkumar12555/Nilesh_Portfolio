import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import { FiBarChart2, FiCode, FiDatabase, FiGrid, FiLayers, FiMonitor, FiTool } from "react-icons/fi";
import SectionTitle from "../ui/SectionTitle";
import { profileData } from "../../data/profileData";

const proficiencyMap = {
  C: 74,
  "C++": 100,
  Python: 87,
  HTML: 94,
  CSS: 90,
  JavaScript: 88,
  "React.js": 92,
  Django: 80,
  "REST API": 85,
  MySQL: 84,
  SQL: 82,
  "Data Analysis": 84,
  "Power BI": 79,
  "Big Data": 72,
  "Git & GitHub": 88,
  "VS Code": 95,
};

const categoryMeta = {
  "Programming Languages": { icon: FiCode, tone: "from-[var(--brand)]/25 to-transparent" },
  "Frontend Technologies": { icon: FiMonitor, tone: "from-[var(--accent)]/25 to-transparent" },
  "Backend Technologies": { icon: FiLayers, tone: "from-[var(--brand)]/20 to-transparent" },
  Database: { icon: FiDatabase, tone: "from-[var(--accent)]/20 to-transparent" },
  "Data Science & Analytics": { icon: FiBarChart2, tone: "from-[var(--brand)]/22 to-transparent" },
  Tools: { icon: FiTool, tone: "from-[var(--accent)]/22 to-transparent" },
};

const circleRadius = 14;
const circleCircumference = 2 * Math.PI * circleRadius;

export default function SkillsSection() {
  const [activeFilter, setActiveFilter] = useState("All");
  const totalSkills = profileData.skillCategories.reduce((count, category) => count + category.items.length, 0);
  const filterOptions = ["All", ...profileData.skillCategories.map((category) => category.title)];
  const filterCounts = useMemo(() => {
    const counts = { All: totalSkills };

    profileData.skillCategories.forEach((category) => {
      counts[category.title] = category.items.length;
    });

    return counts;
  }, [totalSkills]);

  const visibleCategories = useMemo(() => {
    if (activeFilter === "All") {
      return profileData.skillCategories;
    }

    return profileData.skillCategories.filter((category) => category.title === activeFilter);
  }, [activeFilter]);

  const topSkills = useMemo(() => {
    const allSkills = profileData.skillCategories.flatMap((category) => category.items);
    const uniqueSkills = [...new Set(allSkills)];
    return uniqueSkills
      .map((skill) => ({ skill, score: proficiencyMap[skill] || 76 }))
      .sort((a, b) => b.score - a.score)
      .slice(0, 6);
  }, []);

  return (
    <section id="skills" className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 lg:px-8">
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-10 top-10 h-32 w-32 rounded-full bg-[var(--brand)]/20 blur-3xl"
        animate={{ y: [0, -12, 0], opacity: [0.4, 0.65, 0.4] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-14 bottom-8 h-40 w-40 rounded-full bg-[var(--accent)]/20 blur-3xl"
        animate={{ y: [0, 12, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />

      <SectionTitle
        eyebrow="Capability"
        title="Skill Matrix"
        description="A structured breakdown of technologies and areas I use to ship modern products."
      />

      <div className="mb-6 flex flex-wrap items-center gap-3">
        <span className="rounded-full border border-subtle bg-surface px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-muted">
          {visibleCategories.length} Categories
        </span>
        <span className="rounded-full bg-[var(--brand-soft)] px-4 py-2 text-xs font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
          {totalSkills} Skills
        </span>
      </div>

      <div className="mb-5 overflow-hidden rounded-2xl border border-subtle bg-surface-alt p-1.5 shadow-soft">
        <div
          role="tablist"
          aria-label="Skill categories"
          className="flex gap-2 overflow-x-auto pb-1 [scrollbar-width:none] [-ms-overflow-style:none] [&::-webkit-scrollbar]:hidden"
        >
          {filterOptions.map((option) => {
            const isActive = option === activeFilter;
            const Icon = option === "All" ? FiGrid : categoryMeta[option]?.icon || FiCode;

            return (
              <motion.button
                key={option}
                layout
                type="button"
                role="tab"
                aria-selected={isActive}
                aria-pressed={isActive}
                onClick={() => setActiveFilter(option)}
                whileTap={{ scale: 0.98 }}
                className={`relative inline-flex shrink-0 items-center gap-2 rounded-xl px-3 py-2.5 text-xs font-semibold uppercase tracking-[0.12em] transition ${
                  isActive
                    ? "text-surface"
                    : "text-muted hover:text-content"
                }`}
              >
                {isActive ? (
                  <motion.span
                    layoutId="active-skill-filter"
                    className="absolute inset-0 rounded-xl bg-content"
                    transition={{ type: "spring", stiffness: 360, damping: 30 }}
                  />
                ) : null}

                <span className="relative z-10 inline-flex h-5 w-5 items-center justify-center rounded-md border border-subtle/40 bg-surface/70">
                  <Icon size={12} />
                </span>
                <span className="relative z-10">{option}</span>
                <span
                  className={`relative z-10 rounded-full px-1.5 py-0.5 text-[10px] ${
                    isActive
                      ? "bg-surface/20 text-surface"
                      : "bg-[var(--brand-soft)] text-[var(--brand)]"
                  }`}
                >
                  {filterCounts[option] || 0}
                </span>
              </motion.button>
            );
          })}
        </div>
      </div>

      <div className="mb-6 rounded-2xl border border-subtle bg-surface-alt p-4 shadow-soft">
        <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">Top Skills</p>
        <div className="mt-3 flex flex-wrap gap-2">
          {topSkills.map((item) => (
            <motion.span
              key={item.skill}
              initial={{ opacity: 0, y: 8 }}
              whileInView={{ opacity: 1, y: 0 }}
              whileHover={{ y: -2 }}
              viewport={{ once: true, amount: 0.5 }}
              className="inline-flex items-center gap-2 rounded-full border border-subtle bg-surface px-3 py-1.5 text-xs font-semibold text-content"
            >
              <span>{item.skill}</span>
              <span className="rounded-full bg-[var(--brand-soft)] px-2 py-0.5 text-[10px] text-[var(--brand)]">
                {item.score}%
              </span>
            </motion.span>
          ))}
        </div>
      </div>

      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        {visibleCategories.map((category, categoryIndex) => (
          <motion.article
            key={category.title}
            initial={{ opacity: 0, y: 15 }}
            whileInView={{ opacity: 1, y: 0 }}
            whileHover={{ y: -6, scale: 1.01 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ delay: categoryIndex * 0.12, duration: 0.55 }}
            className="premium-card group relative overflow-hidden rounded-3xl border border-subtle bg-surface-alt p-5 shadow-soft"
          >
            <div className={`absolute inset-x-0 top-0 h-20 bg-gradient-to-b ${categoryMeta[category.title]?.tone || "from-[var(--brand)]/15 to-transparent"}`} />
            <div className="relative flex items-center gap-3">
              <div className="inline-flex h-11 w-11 items-center justify-center rounded-2xl bg-surface text-[var(--brand)] shadow-soft">
                {(() => {
                  const Icon = categoryMeta[category.title]?.icon || FiCode;
                  return <Icon size={18} />;
                })()}
              </div>
              <div>
                <h3 className="text-lg font-bold text-[var(--brand)]">{category.title}</h3>
                <p className="text-xs font-semibold uppercase tracking-[0.14em] text-muted">
                  {category.items.length} items
                </p>
              </div>
            </div>

            <ul className="mt-4 space-y-3">
              {category.items.map((item, skillIndex) => (
                <motion.li
                  key={item}
                  initial={{ opacity: 0, x: -8 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true, amount: 0.35 }}
                  transition={{ delay: skillIndex * 0.05 }}
                  className="rounded-2xl border border-subtle/60 bg-surface p-3"
                >
                  <div className="mb-2 flex items-center justify-between gap-3 text-sm">
                    <span className="font-semibold text-content">{item}</span>
                    <div className="relative inline-flex h-9 w-9 items-center justify-center">
                      <svg viewBox="0 0 36 36" className="h-9 w-9 -rotate-90">
                        <circle
                          cx="18"
                          cy="18"
                          r={circleRadius}
                          fill="none"
                          stroke="color-mix(in srgb, var(--border) 80%, transparent)"
                          strokeWidth="3"
                        />
                        <circle
                          cx="18"
                          cy="18"
                          r={circleRadius}
                          fill="none"
                          stroke="url(#skillRingGradient)"
                          strokeWidth="3"
                          strokeLinecap="round"
                          strokeDasharray={circleCircumference}
                          strokeDashoffset={circleCircumference * (1 - (proficiencyMap[item] || 76) / 100)}
                        />
                        <defs>
                          <linearGradient id="skillRingGradient" x1="0%" y1="0%" x2="100%" y2="100%">
                            <stop offset="0%" stopColor="var(--brand)" />
                            <stop offset="100%" stopColor="var(--accent)" />
                          </linearGradient>
                        </defs>
                      </svg>
                      <span className="absolute text-[10px] font-bold text-muted">{proficiencyMap[item] || 76}</span>
                    </div>
                  </div>
                  <div className="h-2 overflow-hidden rounded-full bg-[color-mix(in_srgb,var(--border)_80%,transparent)]">
                    <motion.div
                      className="h-full rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]"
                      initial={{ width: 0 }}
                      whileInView={{ width: `${proficiencyMap[item] || 76}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 0.8, delay: 0.1 }}
                    />
                  </div>
                </motion.li>
              ))}
            </ul>
          </motion.article>
        ))}
      </div>
    </section>
  );
}
