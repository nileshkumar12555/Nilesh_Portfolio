import { useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiExternalLink, FiFilter, FiGithub } from "react-icons/fi";
import { portfolioProjects } from "../../data/portfolioProjects";
import ProjectModal from "../ui/ProjectModal";
import SectionTitle from "../ui/SectionTitle";

const categories = ["All", "React", "Analytics", "AI"];

function isValidUrl(url) {
  return Boolean(url && url.startsWith("http"));
}

export default function ProjectsSection() {
  const [category, setCategory] = useState("All");
  const [search, setSearch] = useState("");
  const [selectedProject, setSelectedProject] = useState(null);

  const projects = useMemo(() => {
    return portfolioProjects.filter((project) => {
      const matchesCategory = category === "All" || project.category === category;
      const matchesSearch =
        project.title.toLowerCase().includes(search.toLowerCase()) ||
        project.tech.join(" ").toLowerCase().includes(search.toLowerCase());

      return matchesCategory && matchesSearch;
    });
  }, [category, search]);

  return (
    <section id="projects" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Interactive"
        title="Featured Projects"
        description="Filterable project cards with quick preview modal, technology tags, and action links."
      />

      <div className="mb-7 flex flex-col gap-3 md:flex-row md:items-center md:justify-between">
        <div className="flex flex-wrap items-center gap-2">
          <span className="inline-flex items-center gap-2 text-sm font-semibold text-muted">
            <FiFilter size={14} /> Category
          </span>

          {categories.map((item) => (
            <button
              key={item}
              type="button"
              onClick={() => setCategory(item)}
              className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                item === category
                  ? "bg-[var(--brand)] text-white"
                  : "border border-subtle bg-surface-alt text-content"
              }`}
            >
              {item}
            </button>
          ))}
        </div>

        <label className="block md:max-w-sm md:flex-1">
          <span className="sr-only">Search projects</span>
          <input
            type="search"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
            placeholder="Search by title or tech"
            className="w-full rounded-xl border border-subtle bg-surface-alt px-4 py-2.5 text-sm outline-none ring-0 placeholder:text-muted focus:border-[var(--accent)]"
          />
        </label>
      </div>

      <motion.div layout className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <AnimatePresence>
          {projects.map((project, index) => (
            <motion.article
              key={project.id}
              layout
              initial={{ opacity: 0, y: 14 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: 8 }}
              transition={{ delay: index * 0.04 }}
              className="group relative overflow-hidden rounded-2xl border border-subtle bg-surface-alt p-2 shadow-md transition hover:-translate-y-1 hover:shadow-lg min-h-[320px] flex flex-col"
            >
              <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_top_right,rgba(228,87,46,0.10),transparent_42%)] opacity-0 transition duration-300 group-hover:opacity-100" />
              <div className="overflow-hidden rounded-xl">
                <img
                  src={project.image}
                  alt={project.title}
                  loading="lazy"
                  decoding="async"
                  className="h-32 w-full rounded-xl object-cover transition duration-500 group-hover:scale-105"
                />
              </div>

              <div className="mt-2 flex-1 flex flex-col justify-between">
                <div>
                  <p className="text-[10px] font-semibold uppercase tracking-[0.16em] text-[var(--accent)]">{project.category}</p>
                  <h3 className="mt-1 text-base font-bold leading-tight">{project.title}</h3>
                  <p className="mt-1 min-h-10 text-xs text-muted">{project.description}</p>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {project.tech.map((item) => (
                      <span key={item} className="rounded-full border border-subtle px-2 py-0.5 text-[10px] font-semibold">
                        {item}
                      </span>
                    ))}
                  </div>
                </div>
                <div className="mt-3 flex flex-wrap gap-2">
                  <button
                    type="button"
                    onClick={() => setSelectedProject(project)}
                    data-magnetic="true"
                    className="rounded-lg border border-subtle px-3 py-1 text-xs font-semibold"
                  >
                    View Details
                  </button>
                  {isValidUrl(project.demo) ? (
                    <a
                      href={project.demo}
                      target="_blank"
                      rel="noreferrer"
                      data-magnetic="true"
                      className="inline-flex items-center gap-1 rounded-lg bg-[var(--brand)] px-3 py-1 text-xs font-semibold text-white"
                    >
                      <FiExternalLink size={12} /> Demo
                    </a>
                  ) : null}
                  {isValidUrl(project.source) ? (
                    <a
                      href={project.source}
                      target="_blank"
                      rel="noreferrer"
                      data-magnetic="true"
                      className="inline-flex items-center gap-1 rounded-lg border border-subtle px-3 py-1 text-xs font-semibold"
                    >
                      <FiGithub size={12} /> Code
                    </a>
                  ) : null}
                </div>
              </div>
            </motion.article>
          ))}
        </AnimatePresence>
      </motion.div>

      {!projects.length ? (
        <div className="mt-6 rounded-2xl border border-subtle bg-surface-alt p-5 text-sm text-muted">
          No projects matched your current filter and search.
        </div>
      ) : null}

      <ProjectModal project={selectedProject} onClose={() => setSelectedProject(null)} />
    </section>
  );
}
