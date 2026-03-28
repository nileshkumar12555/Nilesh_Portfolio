import { motion, AnimatePresence, useScroll, useSpring, useInView, animate } from "framer-motion";
import { useEffect, useState, useRef } from "react";
import { FiAward, FiBookOpen, FiBriefcase, FiCalendar, FiClock, FiCode, FiMapPin, FiChevronDown } from "react-icons/fi";
import SectionTitle from "../ui/SectionTitle";
import { profileData } from "../../data/profileData";

const sectionReveal = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, staggerChildren: 0.1 }
  }
};

const itemReveal = {
  hidden: { opacity: 0, y: 18 },
  show: { opacity: 1, y: 0, transition: { duration: 0.35 } }
};

const AnimatedNumber = ({ value }) => {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true });
  
  useEffect(() => {
    if (inView) {
      const controls = animate(0, parseFloat(value), {
        duration: 1.5,
        ease: "easeOut",
        onUpdate(v) {
          if (ref.current) {
            ref.current.textContent = v.toFixed(value.includes('.') ? 2 : 0);
          }
        }
      });
      return () => controls.stop();
    }
  }, [inView, value]);

  return <span ref={ref}>{value}</span>;
};

const AnimatedCgpa = ({ text }) => {
  if (!text) return null;
  const parts = text.split(" / ");
  if (parts.length === 2 && !isNaN(parseFloat(parts[0]))) {
     return <><AnimatedNumber value={parts[0]} /> / {parts[1]}</>;
  }
  return <>{text}</>;
};

const AnimatedLine = ({ className }) => {
  const ref = useRef(null);
  const { scrollYProgress } = useScroll({
    target: ref,
    offset: ["start 85%", "end 25%"]
  });
  const scaleY = useSpring(scrollYProgress, {
    stiffness: 100, damping: 30, restDelta: 0.001
  });

  return (
    <div ref={ref} className={`bg-[var(--border)] overflow-hidden ${className}`}>
      <motion.div
        className="w-full h-full bg-gradient-to-b from-[var(--brand)] via-[var(--accent)] to-[var(--brand)]"
        style={{ scaleY, originY: 0 }}
      />
    </div>
  );
};

const ExpandableEduCard = ({ item, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.article
      initial={{ opacity: 0, x: -18 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ y: -3, scale: 1.01 }}
      viewport={{ once: true, amount: 0.35 }}
      transition={{ duration: 0.35, delay: index * 0.08 }}
      onClick={() => setIsOpen(!isOpen)}
      className="premium-card group relative cursor-pointer overflow-hidden rounded-2xl border border-subtle bg-surface p-4 shadow-soft transition-all duration-300 hover:border-[var(--accent)]/40 hover:shadow-md"
    >
      <div className="absolute inset-0 bg-gradient-to-tl from-[var(--accent)]/5 to-[var(--brand)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      <div className="absolute -right-10 top-0 h-24 w-24 rounded-full bg-[var(--brand)]/10 blur-2xl group-hover:bg-[var(--brand)]/20 transition-colors duration-500" />
      
      <span className="absolute -left-[27px] top-7 z-10 inline-flex h-4 w-4 items-center justify-center rounded-full border-2 border-surface bg-[var(--accent)]">
         <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--accent)] opacity-60"></span>
      </span>

      <div className="relative flex items-start gap-3">
        <motion.div 
          whileHover={{ rotate: -10 }} 
          className="mt-0.5 inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]"
        >
          <FiBookOpen size={18} />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="inline-flex items-center gap-1 rounded-full bg-[var(--brand-soft)] px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.14em] text-[var(--brand)]">
                <FiCalendar size={12} />
                {item.period}
              </span>
              <span className="inline-flex items-center gap-1 rounded-full border border-subtle bg-surface-alt px-3 py-1 text-[11px] font-semibold text-muted transition-colors group-hover:border-[var(--brand)]/30">
                <FiAward size={12} />
                CGPA <AnimatedCgpa text={item.cgpa} />
              </span>
            </div>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-muted group-hover:text-content">
               <FiChevronDown size={14} />
            </motion.div>
          </div>

          <h5 className="mt-3 text-sm font-bold sm:text-base group-hover:text-[var(--brand)] transition-colors">{item.degree}</h5>

          <p className="mt-2 inline-flex items-center gap-2 text-sm text-muted">
            <FiMapPin size={14} className="shrink-0 text-[var(--accent)]" />
            {item.institution}
          </p>

          <AnimatePresence initial={false}>
            {isOpen && (
              <motion.div
                 initial={{ height: 0, opacity: 0 }}
                 animate={{ height: "auto", opacity: 1 }}
                 exit={{ height: 0, opacity: 0 }}
                 className="overflow-hidden"
              >
                <div className="relative mt-4 space-y-2 text-sm text-muted border-t border-subtle pt-3">
                  {item.points.map((point, pointIndex) => (
                    <motion.div
                      key={point}
                      initial={{ opacity: 0, x: -8 }}
                      animate={{ opacity: 1, x: 0 }}
                      transition={{ delay: pointIndex * 0.05 }}
                      className="flex items-start gap-2 rounded-xl border border-subtle/60 bg-surface-alt/60 px-3 py-2"
                    >
                      <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--accent)]" />
                      <p>{point}</p>
                    </motion.div>
                  ))}
                </div>
              </motion.div>
            )}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
};

const ExpandableExpCard = ({ entry, index }) => {
  const [isOpen, setIsOpen] = useState(false);
  
  return (
    <motion.article
      initial={{ opacity: 0, x: 18 }}
      whileInView={{ opacity: 1, x: 0 }}
      whileHover={{ x: 2, y: -3, scale: 1.01 }}
      viewport={{ once: true, amount: 0.3 }}
      transition={{ delay: index * 0.1 }}
      onClick={() => setIsOpen(!isOpen)}
      className="premium-card relative cursor-pointer overflow-hidden rounded-2xl border border-subtle bg-surface-alt p-5 shadow-soft group transition-all duration-300 hover:border-[var(--brand)]/30 hover:shadow-md"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-[var(--brand)]/5 to-[var(--accent)]/5 opacity-0 transition-opacity duration-300 group-hover:opacity-100 pointer-events-none" />
      <div className="absolute -right-8 top-0 h-24 w-24 rounded-full bg-[var(--accent)]/10 blur-2xl group-hover:bg-[var(--accent)]/25 transition-colors duration-500" />
      
      <span className="absolute -left-[27px] top-6 z-10 inline-flex h-3.5 w-3.5 items-center justify-center rounded-full border-2 border-surface bg-[var(--brand)]">
         <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-[var(--brand)] opacity-60"></span>
      </span>

      <div className="relative flex items-start gap-3">
        <motion.div
          whileHover={{ rotate: -10, scale: 1.06 }}
          className="inline-flex h-11 w-11 shrink-0 items-center justify-center rounded-2xl bg-[var(--brand-soft)] text-[var(--brand)]"
        >
          <FiBriefcase size={18} />
        </motion.div>

        <div className="min-w-0 flex-1">
          <div className="flex flex-wrap items-center justify-between gap-2">
            <div className="flex flex-wrap items-center gap-2">
              <span className="rounded-full bg-[var(--brand-soft)] px-3 py-1 text-xs font-semibold text-[var(--brand)]">
                <AnimatedNumber value={entry.year} />
              </span>
              {entry.type ? (
                <span className="rounded-full border border-subtle bg-surface px-3 py-1 text-xs font-semibold text-muted">
                  {entry.type}
                </span>
              ) : null}
              {entry.duration ? (
                <span className="inline-flex items-center gap-1 rounded-full border border-subtle bg-surface px-3 py-1 text-xs font-semibold text-muted">
                  <FiClock size={12} />
                  {entry.duration}
                </span>
              ) : null}
            </div>
            <motion.div animate={{ rotate: isOpen ? 180 : 0 }} className="text-muted group-hover:text-content">
               <FiChevronDown size={14} />
            </motion.div>
          </div>

          <h4 className="mt-3 text-base font-bold group-hover:text-[var(--accent)] transition-colors">{entry.title}</h4>
          <p className="mt-1 text-sm font-semibold text-[var(--accent)] group-hover:brightness-110">{entry.organization}</p>
          <p className="mt-2 text-sm text-muted">{entry.summary}</p>

          {entry.skills?.length ? (
            <div className="mt-3 flex flex-wrap gap-2">
              {entry.skills.map((skill) => (
                <span
                  key={skill}
                  className="inline-flex items-center gap-1 rounded-full border border-subtle bg-surface px-3 py-1 text-[11px] font-semibold text-muted transition-colors group-hover:border-[var(--brand)]/30"
                >
                  <FiCode size={11} />
                  {skill}
                </span>
              ))}
            </div>
          ) : null}

          <AnimatePresence initial={false}>
             {isOpen && entry.points?.length ? (
                <motion.div
                  initial={{ height: 0, opacity: 0 }}
                  animate={{ height: "auto", opacity: 1 }}
                  exit={{ height: 0, opacity: 0 }}
                  className="overflow-hidden"
                >
                  <div className="mt-4 space-y-2 border-t border-subtle pt-3">
                    {entry.points.map((point, pointIndex) => (
                      <motion.div
                        key={point}
                        initial={{ opacity: 0, x: -8 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: pointIndex * 0.04 }}
                        className="flex items-start gap-2 rounded-xl border border-subtle/60 bg-surface px-3 py-2 text-sm text-muted"
                      >
                        <span className="mt-1.5 inline-block h-1.5 w-1.5 shrink-0 rounded-full bg-[var(--brand)]" />
                        <p>{point}</p>
                      </motion.div>
                    ))}
                  </div>
                </motion.div>
             ) : null}
          </AnimatePresence>
        </div>
      </div>
    </motion.article>
  );
};

export default function AboutSection() {
  return (
    <motion.section
      id="about"
      className="relative mx-auto max-w-7xl overflow-hidden px-4 py-16 sm:px-6 lg:px-8"
      variants={sectionReveal}
      initial="hidden"
      whileInView="show"
      viewport={{ once: true, amount: 0.15 }}
    >
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -left-14 top-8 h-36 w-36 rounded-full bg-[var(--brand)]/20 blur-3xl"
        animate={{ y: [0, -10, 0], opacity: [0.45, 0.65, 0.45] }}
        transition={{ duration: 6, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div
        aria-hidden="true"
        className="pointer-events-none absolute -right-16 bottom-8 h-44 w-44 rounded-full bg-[var(--accent)]/20 blur-3xl"
        animate={{ y: [0, 10, 0], opacity: [0.35, 0.55, 0.35] }}
        transition={{ duration: 7, repeat: Infinity, ease: "easeInOut" }}
      />

      <SectionTitle
        eyebrow="Profile"
        title="About and Experience Timeline"
        description="A concise view of my background, focus areas, and real-world development journey."
      />

      <motion.div variants={itemReveal} className="grid gap-6 lg:grid-cols-2">
        {/* Left Column (Profile & Education) */}
        <motion.article
          whileHover={{ y: -4 }}
          transition={{ type: "spring", stiffness: 220, damping: 22 }}
          className="premium-card glass-panel group relative overflow-hidden rounded-3xl border border-subtle bg-surface-alt p-6 shadow-soft transition-all duration-300 hover:shadow-md"
        >
          <div className="absolute -right-10 top-4 h-24 w-24 rounded-full bg-[var(--brand)]/20 blur-2xl group-hover:bg-[var(--brand)]/30 transition-colors duration-500" />
          <h3 className="text-xl font-bold">Who I Am</h3>
          <p className="mt-4 text-muted">
            {profileData.name} from {profileData.location}. {profileData.shortBio}
          </p>
          <p className="mt-4 rounded-xl border border-subtle bg-surface p-4 text-sm transition group-hover:border-[var(--accent)]/50 group-hover:bg-surface-alt">
            Availability: <span className="font-semibold text-content">{profileData.availability}</span>
          </p>

          <div className="mt-5 grid grid-cols-2 gap-3">
            <div className="group/stat rounded-xl border border-subtle bg-surface p-3 transition hover:border-[var(--brand)]/50">
              <p className="text-xs uppercase tracking-wide text-muted">Primary Role</p>
              <p className="mt-1 text-sm font-bold text-content group-hover/stat:text-[var(--brand)] transition-colors">SoftwareDeveloper</p>
            </div>
            <div className="group/stat rounded-xl border border-subtle bg-surface p-3 transition hover:border-[var(--accent)]/50">
              <p className="text-xs uppercase tracking-wide text-muted">Work Style</p>
              <p className="mt-1 text-sm font-bold text-content group-hover/stat:text-[var(--accent)] transition-colors">Clean UI + Data</p>
            </div>
          </div>

          <div className="mt-6 space-y-5">
            <div className="flex items-center justify-between gap-3">
              <h4 className="text-base font-bold">Education</h4>
              <span className="rounded-full border border-subtle bg-surface px-3 py-1 text-xs font-semibold text-muted">
                Academic Journey
              </span>
            </div>

            <div className="relative space-y-4 pl-5">
              <AnimatedLine className="absolute bottom-3 left-0 top-3 w-[2px]" />

              {profileData.education.map((item, index) => (
                <ExpandableEduCard key={`${item.degree}-${item.period}`} item={item} index={index} />
              ))}
            </div>
          </div>
        </motion.article>

        {/* Right Column (Experience Timeline) */}
        <motion.div variants={itemReveal} className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <h3 className="text-xl font-bold text-content">Experience</h3>
            <span className="inline-flex items-center gap-2 rounded-full border border-subtle bg-surface px-3 py-1 text-xs font-semibold text-muted shadow-sm">
              <span className="h-2 w-2 rounded-full bg-[var(--accent)] animate-pulse" aria-hidden="true" />
              Hands-on Journey
            </span>
          </div>

          <div className="relative space-y-4 pl-4 sm:pl-6">
            <AnimatedLine className="absolute bottom-2 left-1 top-2 w-[2px] sm:left-1.5" />
            
            {profileData.timeline.map((entry, index) => (
              <ExpandableExpCard key={entry.title} entry={entry} index={index} />
            ))}
          </div>
        </motion.div>
      </motion.div>
    </motion.section>
  );
}
