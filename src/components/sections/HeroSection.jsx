import { motion } from "framer-motion";
import { FiArrowRight } from "react-icons/fi";
import { profileData } from "../../data/profileData";

const heroContainer = {
  hidden: { opacity: 0 },
  show: {
    opacity: 1,
    transition: {
      staggerChildren: 0.12,
      delayChildren: 0.08,
    },
  },
};

const heroItem = {
  hidden: { opacity: 0, y: 20 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" },
  },
};

function goToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (section) {
    section.scrollIntoView({ behavior: "smooth" });
  }
}

export default function HeroSection() {
  return (
    <section id="home" className="relative overflow-hidden pb-6">
      <div className="absolute inset-0 -z-10 bg-[radial-gradient(circle_at_12%_18%,rgba(228,87,46,0.24),transparent_30%),radial-gradient(circle_at_86%_22%,rgba(31,138,112,0.2),transparent_28%),radial-gradient(circle_at_50%_100%,rgba(255,255,255,0.1),transparent_48%)]" />
      <div className="float-orb left-[6%] top-[18%] h-28 w-28 bg-[var(--brand)]/20" />
      <div className="float-orb right-[8%] top-[30%] h-36 w-36 bg-[var(--accent)]/20 [animation-delay:1.8s]" />

      <div className="mx-auto grid max-w-7xl gap-10 px-4 pb-20 pt-14 sm:px-6 lg:grid-cols-2 lg:items-center lg:px-8 lg:pt-20">
        <motion.div variants={heroContainer} initial="hidden" animate="show">
          <motion.span
            variants={heroItem}
            className="inline-flex rounded-full border border-subtle bg-surface-alt px-3 py-1 text-xs font-semibold uppercase tracking-[0.2em] text-[var(--accent)]"
          >
            {profileData.role}
          </motion.span>

          <motion.h1 variants={heroItem} className="mt-5 text-4xl font-bold leading-[1.05] sm:text-5xl lg:text-6xl">
            {profileData.headline.split(" ").slice(0, 5).join(" ")}
            <span className="block text-[var(--brand)]">{profileData.headline.split(" ").slice(5).join(" ")}</span>
          </motion.h1>

          <motion.p variants={heroItem} className="mt-6 max-w-xl text-base text-muted sm:text-lg">
            {profileData.shortBio}
          </motion.p>

          <motion.div variants={heroItem} className="mt-8 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => goToSection("projects")}
              data-magnetic="true"
              className="inline-flex items-center gap-2 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 hover:shadow-soft"
            >
              Explore Projects
              <FiArrowRight size={16} />
            </button>
            <button
              type="button"
              onClick={() => goToSection("contact")}
              data-magnetic="true"
              className="rounded-xl border border-subtle px-5 py-3 text-sm font-semibold"
            >
              Let's Talk
            </button>
          </motion.div>

          <motion.div variants={heroItem} className="mt-6 flex flex-wrap items-center gap-2.5">
            {profileData.socialLinks.map((link) => (
              <a
                key={link.label}
                href={link.href}
                target={link.href.startsWith("http") ? "_blank" : undefined}
                rel={link.href.startsWith("http") ? "noreferrer" : undefined}
                data-magnetic="true"
                className="rounded-full border border-subtle bg-surface-alt px-4 py-2 text-xs font-semibold uppercase tracking-wide text-content transition hover:-translate-y-0.5 hover:border-[var(--brand)]"
              >
                {link.label}
              </a>
            ))}
          </motion.div>

          <motion.div variants={heroItem} className="mt-8 grid grid-cols-1 gap-3 sm:grid-cols-3">
            {profileData.highlights.map((highlight) => (
              <article
                key={highlight.title}
                className="rounded-xl border border-subtle bg-surface-alt p-4 transition hover:-translate-y-1 hover:border-[var(--accent)]"
              >
                <p className="text-lg font-bold">{highlight.value}</p>
                <p className="text-xs uppercase tracking-wide text-muted">{highlight.title}</p>
              </article>
            ))}
          </motion.div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, scale: 0.95 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.7 }}
          className="flex justify-center"
        >
          <div className="relative w-full max-w-md">
            <div className="absolute -left-10 top-8 h-40 w-40 rounded-full bg-[var(--brand)]/20 blur-3xl" />
            <div className="absolute -right-8 bottom-8 h-44 w-44 rounded-full bg-[var(--accent)]/20 blur-3xl" />
            <img
              src={profileData.avatar}
              alt={profileData.name}
              loading="eager"
              fetchpriority="high"
              decoding="async"
              className="relative aspect-[3/4] w-full rounded-[2rem] border border-subtle object-cover object-top shadow-soft transition duration-500 hover:scale-[1.015]"
            />
            <div className="absolute -bottom-5 left-5 rounded-2xl border border-subtle bg-surface-alt px-4 py-2 text-xs font-semibold text-muted shadow-soft">
              Available for Product and Freelance work
            </div>
          </div>
        </motion.div>
      </div>
    </section>
  );
}
