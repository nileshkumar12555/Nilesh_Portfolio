import { FiGithub, FiInstagram, FiLinkedin, FiMail } from "react-icons/fi";

const links = [
  { icon: FiGithub, href: "https://github.com/nileshkumar12555", label: "GitHub" },
  { icon: FiLinkedin, href: "https://www.linkedin.com", label: "LinkedIn" },
  { icon: FiInstagram, href: "https://www.instagram.com", label: "Instagram" },
  { icon: FiMail, href: "mailto:nilesh@example.com", label: "Email" },
];

export default function Footer() {
  return (
    <footer className="border-t border-subtle bg-surface-alt">
      <div className="mx-auto max-w-7xl px-4 pb-10 pt-8 sm:px-6 lg:px-8">

        <div className="flex flex-col items-center gap-6">
        <div className="flex items-center gap-3">
          {links.map(({ icon: Icon, href, label }) => (
            <a
              key={label}
              href={href}
              target="_blank"
              rel="noreferrer"
              data-magnetic="true"
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-subtle text-content transition hover:-translate-y-1 hover:border-[var(--brand)] hover:bg-content hover:text-surface"
              aria-label={label}
            >
              <Icon size={18} />
            </a>
          ))}
        </div>

        <p className="text-center text-sm text-muted">
          Copyright {new Date().getFullYear()} Nilesh Kumar
        </p>
        </div>
      </div>
    </footer>
  );
}
