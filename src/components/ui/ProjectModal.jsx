import { useEffect } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiExternalLink, FiGithub, FiX } from "react-icons/fi";

export default function ProjectModal({ project, onClose }) {
  useEffect(() => {
    if (!project) {
      return undefined;
    }

    const onKeyDown = (event) => {
      if (event.key === "Escape") {
        onClose();
      }
    };

    document.addEventListener("keydown", onKeyDown);
    return () => document.removeEventListener("keydown", onKeyDown);
  }, [project, onClose]);

  return (
    <AnimatePresence>
      {project ? (
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          className="fixed inset-0 z-[70] flex items-center justify-center bg-black/70 p-4 backdrop-blur-sm"
          onClick={onClose}
          role="dialog"
          aria-modal="true"
          aria-label="Project details"
        >
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 0.9 }}
            exit={{ opacity: 0 }}
            className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_20%_20%,rgba(228,87,46,0.22),transparent_34%),radial-gradient(circle_at_80%_75%,rgba(31,138,112,0.2),transparent_34%)]"
          />

          <motion.div
            initial={{ scale: 0.94, y: 18, rotateX: 4 }}
            animate={{ scale: 1, y: 0 }}
            exit={{ scale: 0.95, y: 8, opacity: 0 }}
            transition={{ type: "spring", damping: 22, stiffness: 280 }}
            className="glass-panel relative w-full max-w-2xl rounded-3xl border border-subtle bg-surface-alt/95 p-6 shadow-soft"
            onClick={(event) => event.stopPropagation()}
          >
            <div className="absolute -left-6 top-10 h-24 w-24 rounded-full bg-[var(--brand)]/20 blur-2xl" />
            <div className="absolute -right-8 bottom-10 h-24 w-24 rounded-full bg-[var(--accent)]/20 blur-2xl" />

            <div className="mb-5 flex items-start justify-between gap-4">
              <div>
                <p className="text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]">{project.category}</p>
                <h3 className="mt-2 text-2xl font-bold">{project.title}</h3>
              </div>

              <button
                type="button"
                onClick={onClose}
                className="inline-flex h-9 w-9 items-center justify-center rounded-full border border-subtle bg-surface-alt"
                aria-label="Close details modal"
              >
                <FiX size={18} />
              </button>
            </div>

            <img
              src={project.image}
              alt={project.title}
              loading="lazy"
              decoding="async"
              className="h-64 w-full rounded-2xl border border-subtle object-cover"
            />

            <p className="mt-5 text-muted">{project.description}</p>
            <p className="mt-4 rounded-xl bg-surface p-4 text-sm text-content">{project.impact}</p>

            <div className="mt-5 flex flex-wrap gap-2">
              {project.tech.map((tech) => (
                <span key={tech} className="rounded-full border border-subtle px-3 py-1 text-xs font-semibold">
                  {tech}
                </span>
              ))}
            </div>

            <div className="mt-6 flex flex-wrap gap-3">
              <a
                href={project.demo}
                target="_blank"
                rel="noreferrer"
                data-magnetic="true"
                className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-4 py-2 text-sm font-semibold text-white"
              >
                <FiExternalLink size={16} />
                Live Demo
              </a>
              <a
                href={project.source}
                target="_blank"
                rel="noreferrer"
                data-magnetic="true"
                className="inline-flex items-center gap-2 rounded-xl border border-subtle px-4 py-2 text-sm font-semibold"
              >
                <FiGithub size={16} />
                Source Code
              </a>
            </div>
          </motion.div>
        </motion.div>
      ) : null}
    </AnimatePresence>
  );
}
