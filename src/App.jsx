import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Toaster } from "react-hot-toast";
import { FiArrowUp } from "react-icons/fi";
import Footer from "./components/layout/Footer";
import Navbar from "./components/layout/Navbar";
import AboutSection from "./components/sections/AboutSection";
import ContactSection from "./components/sections/ContactSection";
import HeroSection from "./components/sections/HeroSection";
import InsightsSection from "./components/sections/InsightsSection";
import ProjectsSection from "./components/sections/ProjectsSection";
import SkillsSection from "./components/sections/SkillsSection";
import Preloader from "./components/ui/Preloader";
import useTheme from "./hooks/useTheme";

function App() {
  const { theme, toggleTheme } = useTheme();
  const [scrollProgress, setScrollProgress] = useState(0);
  const [showScrollTop, setShowScrollTop] = useState(false);
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    const startedAt = Date.now();

    const markAsReady = () => {
      const elapsed = Date.now() - startedAt;
      const minVisibleMs = 850;
      const delay = Math.max(minVisibleMs - elapsed, 0);
      window.setTimeout(() => setIsReady(true), delay);
    };

    if (document.readyState === "complete") {
      markAsReady();
    } else {
      window.addEventListener("load", markAsReady, { once: true });
    }

    return () => {
      window.removeEventListener("load", markAsReady);
    };
  }, []);

  useEffect(() => {
    const onScroll = () => {
      const scrollTop = window.scrollY;
      const maxHeight = document.documentElement.scrollHeight - window.innerHeight;
      const progress = maxHeight > 0 ? (scrollTop / maxHeight) * 100 : 0;
      setScrollProgress(progress);
      setShowScrollTop(scrollTop > 420);
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    const onMouseMove = (event) => {
      document.documentElement.style.setProperty("--cursor-x", `${event.clientX}px`);
      document.documentElement.style.setProperty("--cursor-y", `${event.clientY}px`);
    };

    window.addEventListener("mousemove", onMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", onMouseMove);
  }, []);

  useEffect(() => {
    const magneticNodes = Array.from(document.querySelectorAll("[data-magnetic='true']"));

    const cleanups = magneticNodes.map((node) => {
      const onMove = (event) => {
        const rect = node.getBoundingClientRect();
        const x = event.clientX - rect.left - rect.width / 2;
        const y = event.clientY - rect.top - rect.height / 2;
        node.style.transform = `translate(${x * 0.14}px, ${y * 0.14}px)`;
      };

      const onLeave = () => {
        node.style.transform = "translate(0px, 0px)";
      };

      node.addEventListener("mousemove", onMove);
      node.addEventListener("mouseleave", onLeave);

      return () => {
        node.removeEventListener("mousemove", onMove);
        node.removeEventListener("mouseleave", onLeave);
        node.style.transform = "translate(0px, 0px)";
      };
    });

    return () => {
      cleanups.forEach((cleanup) => cleanup());
    };
  }, [isReady]);

  return (
    <div className="min-h-screen bg-surface text-content transition-colors duration-300 cursor-glow-enabled">
      <AnimatePresence>{!isReady ? <Preloader key="preloader" /> : null}</AnimatePresence>

      <div className="scroll-progress" aria-hidden="true" style={{ width: `${scrollProgress}%` }} />

      <Navbar theme={theme} onToggleTheme={toggleTheme} />

      <motion.main
        initial={{ opacity: 0, y: 14 }}
        animate={{ opacity: isReady ? 1 : 0, y: isReady ? 0 : 14 }}
        transition={{ duration: 0.5, ease: "easeOut" }}
      >
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.35 }} transition={{ duration: 0.6 }}>
          <HeroSection />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
          <AboutSection />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
          <InsightsSection />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
          <ProjectsSection />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
          <SkillsSection />
        </motion.div>
        <motion.div initial={{ opacity: 0, y: 18 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ duration: 0.55 }}>
          <ContactSection />
        </motion.div>
      </motion.main>

      <Footer />

      {showScrollTop && (
        <button
          type="button"
          aria-label="Back to top"
          onClick={() => window.scrollTo({ top: 0, behavior: "smooth" })}
          data-magnetic="true"
          className="fixed bottom-5 right-5 z-50 inline-flex h-12 w-12 items-center justify-center rounded-full border border-white/20 bg-content text-surface shadow-soft transition hover:-translate-y-1"
        >
          <FiArrowUp size={18} />
        </button>
      )}

      <Toaster
        position="top-right"
        toastOptions={{
          style: {
            borderRadius: "12px",
            background: theme === "dark" ? "#202329" : "#f9fafb",
            color: theme === "dark" ? "#f4f5f6" : "#111827",
          },
        }}
      />
    </div>
  );
}

export default App;
