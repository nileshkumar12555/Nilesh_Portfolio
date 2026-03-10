import { motion } from "framer-motion";

export default function KpiCard({ label, value, trend }) {
  return (
    <motion.article
      whileHover={{ y: -6, scale: 1.01 }}
      className="relative overflow-hidden rounded-2xl border border-subtle bg-surface-alt p-5 shadow-soft"
    >
      <div className="absolute -right-8 -top-8 h-24 w-24 rounded-full bg-[var(--brand)]/15 blur-2xl" />
      <div className="absolute -left-10 -bottom-10 h-24 w-24 rounded-full bg-[var(--accent)]/15 blur-2xl" />
      <p className="text-sm font-medium text-muted">{label}</p>
      <p className="mt-3 text-3xl font-extrabold text-content md:text-4xl">{value}</p>
      <p className="mt-2 text-xs font-semibold uppercase tracking-wide text-[var(--accent)]">{trend}</p>
    </motion.article>
  );
}
