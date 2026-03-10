import { motion } from "framer-motion";

export default function Preloader() {
  return (
    <motion.div
      initial={{ opacity: 1 }}
      exit={{ opacity: 0, transition: { duration: 0.45 } }}
      className="fixed inset-0 z-[120] flex items-center justify-center bg-surface"
      aria-label="Loading interface"
    >
      <div className="text-center">
        <motion.div
          animate={{ rotate: 360 }}
          transition={{ duration: 1.5, repeat: Infinity, ease: "linear" }}
          className="mx-auto h-14 w-14 rounded-2xl border-2 border-[var(--brand)] border-t-transparent"
        />
        <motion.h2
          initial={{ opacity: 0, y: 8 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.45 }}
          className="mt-5 text-lg font-bold tracking-wide"
        >
          Crafting Next-Level Experience
        </motion.h2>
        <p className="mt-2 text-sm text-muted">Loading premium interface...</p>
      </div>
    </motion.div>
  );
}
