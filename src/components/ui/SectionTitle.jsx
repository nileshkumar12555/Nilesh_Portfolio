import { motion } from "framer-motion";

export default function SectionTitle({ eyebrow, title, description }) {
  return (
    <motion.div
      className="mb-8 sm:mb-10"
      initial={{ opacity: 0, y: 10 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.6 }}
      transition={{ duration: 0.45 }}
    >
      <span className="inline-flex rounded-full border border-subtle bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold uppercase tracking-wide text-[var(--brand)]">
        {eyebrow}
      </span>
      <h2 className="mt-3 text-3xl font-bold leading-tight sm:text-4xl">{title}</h2>
      <div className="mt-3 h-1.5 w-28 rounded-full bg-gradient-to-r from-[var(--brand)] to-[var(--accent)]" />
      {description ? <p className="mt-3 max-w-3xl text-muted">{description}</p> : null}
    </motion.div>
  );
}
