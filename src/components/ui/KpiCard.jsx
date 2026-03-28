import { motion } from "framer-motion";

export default function KpiCard({ label, value, trend }) {
  return (
    <motion.article
      whileHover={{ y: -4, scale: 1.03 }}
      initial={{ opacity: 0, y: 10 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ type: "spring", stiffness: 180, damping: 18 }}
      className="relative overflow-hidden rounded-xl border border-subtle bg-surface-alt p-3 shadow transition-all duration-300 min-h-[90px]"
    >
      <div className="absolute -right-6 -top-6 h-14 w-14 rounded-full bg-[var(--brand)]/15 blur-2xl" />
      <div className="absolute -left-7 -bottom-7 h-14 w-14 rounded-full bg-[var(--accent)]/15 blur-2xl" />
      <p className="text-xs font-medium text-muted">{label}</p>
      <p className="mt-2 text-xl font-extrabold text-content">{value}</p>
      <p className="mt-1 text-[10px] font-semibold uppercase tracking-wide text-[var(--accent)]">{trend}</p>
    </motion.article>
  );
}
