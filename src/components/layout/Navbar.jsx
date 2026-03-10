import { useEffect, useMemo, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { FiMenu, FiMoon, FiSun, FiX } from "react-icons/fi";

const navItems = [
  { id: "home", label: "Home" },
  { id: "about", label: "About" },
  { id: "insights", label: "Dashboard" },
  { id: "projects", label: "Projects" },
  { id: "skills", label: "Skills" },
  { id: "contact", label: "Contact" },
];

function scrollToSection(sectionId) {
  const section = document.getElementById(sectionId);
  if (!section) {
    return;
  }

  section.scrollIntoView({ behavior: "smooth", block: "start" });
}

export default function Navbar({ theme, onToggleTheme }) {
  const [isOpen, setIsOpen] = useState(false);
  const [activeSection, setActiveSection] = useState("home");

  const observerOptions = useMemo(
    () => ({ rootMargin: "-30% 0px -55% 0px", threshold: [0.1, 0.35, 0.6] }),
    []
  );

  useEffect(() => {
    const sections = navItems
      .map((item) => document.getElementById(item.id))
      .filter(Boolean);

    const observer = new IntersectionObserver((entries) => {
      entries.forEach((entry) => {
        if (entry.isIntersecting) {
          setActiveSection(entry.target.id);
        }
      });
    }, observerOptions);

    sections.forEach((section) => observer.observe(section));
    return () => observer.disconnect();
  }, [observerOptions]);

  useEffect(() => {
    document.body.style.overflow = isOpen ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [isOpen]);

  return (
    <header className="glass-panel sticky top-0 z-50 border-b border-subtle bg-surface backdrop-blur-xl">
      <nav className="mx-auto flex h-20 max-w-7xl items-center justify-between px-4 sm:px-6 lg:px-8" aria-label="Main navigation">
        <motion.button
          type="button"
          onClick={() => scrollToSection("home")}
          data-magnetic="true"
          className="brand-chip group relative inline-flex items-center gap-3 rounded-2xl border border-subtle px-2.5 py-2"
          aria-label="Go to top section"
          whileHover={{ scale: 1.03, y: -1 }}
          whileTap={{ scale: 0.98 }}
          transition={{ type: "spring", stiffness: 320, damping: 22 }}
        >
          <span className="brand-chip__halo" aria-hidden="true" />
          <img
            src="/photo.gif"
            alt="CodeWithNilesh logo"
            loading="eager"
            decoding="async"
            className="h-11 w-11 rounded-xl border border-subtle object-cover shadow-soft"
          />
          <div className="brand-chip__meta text-left">
            <p className="flex items-center text-base font-bold text-content">
              CodeWithNilesh
              <span className="brand-chip__status ml-2" aria-hidden="true" />
            </p>
            <p className="brand-chip__subtitle text-xs text-muted">FullStack Engineer</p>
          </div>
        </motion.button>

        <ul className="hidden items-center gap-2 lg:flex">
          {navItems.map((item) => {
            const isActive = activeSection === item.id;
            return (
              <li key={item.id}>
                <button
                  type="button"
                  onClick={() => scrollToSection(item.id)}
                  data-magnetic="true"
                  className={`rounded-full px-4 py-2 text-sm font-semibold transition ${
                    isActive
                      ? "bg-content text-surface"
                      : "text-content hover:bg-surface-alt"
                  }`}
                  aria-current={isActive ? "page" : undefined}
                >
                  {item.label}
                </button>
              </li>
            );
          })}
        </ul>

        <div className="flex items-center gap-2">
          <button
            type="button"
            onClick={onToggleTheme}
            data-magnetic="true"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-surface-alt text-content transition hover:scale-105"
            aria-label="Toggle theme"
          >
            {theme === "dark" ? <FiSun size={18} /> : <FiMoon size={18} />}
          </button>

          <button
            type="button"
            onClick={() => setIsOpen((current) => !current)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-subtle bg-surface-alt text-content lg:hidden"
            aria-expanded={isOpen}
            aria-label="Toggle mobile menu"
          >
            {isOpen ? <FiX size={18} /> : <FiMenu size={18} />}
          </button>
        </div>
      </nav>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="border-t border-subtle bg-surface-alt p-4 lg:hidden"
          >
            <ul className="flex flex-col gap-2">
              {navItems.map((item) => (
                <li key={item.id}>
                  <button
                    type="button"
                    onClick={() => {
                      scrollToSection(item.id);
                      setIsOpen(false);
                    }}
                    className="w-full rounded-xl px-4 py-3 text-left text-sm font-semibold text-content hover:bg-surface"
                  >
                    {item.label}
                  </button>
                </li>
              ))}
            </ul>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  );
}
