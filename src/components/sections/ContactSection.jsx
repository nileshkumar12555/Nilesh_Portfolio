import emailjs from "@emailjs/browser";
import { useForm } from "react-hook-form";
import toast from "react-hot-toast";
import SectionTitle from "../ui/SectionTitle";

const EMAILJS_SERVICE_ID = "service_iifu0zc";
const EMAILJS_TEMPLATE_ID = "template_u56y58b";
const EMAILJS_PUBLIC_KEY = import.meta.env.VITE_EMAILJS_PUBLIC_KEY;

export default function ContactSection() {
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors, isSubmitting },
  } = useForm();

  const onSubmit = async (values) => {
    if (!EMAILJS_PUBLIC_KEY) {
      toast.error("Email service is not configured. Add VITE_EMAILJS_PUBLIC_KEY in .env file.");
      return;
    }

    try {
      const sentAt = new Date().toLocaleString();
      const templateParams = {
        name: values.name,
        email: values.email,
        from_name: values.name,
        from_email: values.email,
        user_name: values.name,
        user_email: values.email,
        reply_to: values.email,
        to_name: "Nilesh",
        message: values.message,
        sent_at: sentAt,
        time: sentAt,
      };

      await emailjs.send(EMAILJS_SERVICE_ID, EMAILJS_TEMPLATE_ID, templateParams, EMAILJS_PUBLIC_KEY);
      toast.success("Message sent successfully.");
      reset();
    } catch (error) {
      toast.error("Unable to send your message. Please try again.");
      console.error(error);
    }
  };

  return (
    <section id="contact" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
      <SectionTitle
        eyebrow="Collaborate"
        title="Let's Build Something Great"
        description="A clean contact workflow with validation, loading states, and feedback notifications."
      />

      <div className="grid gap-6 lg:grid-cols-[1fr_1.2fr]">
        <aside className="glass-panel relative overflow-hidden rounded-3xl border border-subtle bg-surface-alt p-6 shadow-soft">
          <div className="absolute -right-10 top-6 h-24 w-24 rounded-full bg-[var(--accent)]/20 blur-2xl" />
          <h3 className="text-xl font-bold">Why work with me?</h3>
          <ul className="mt-4 space-y-3 text-sm text-muted">
            <li>Product-focused frontend architecture and clean component design.</li>
            <li>Performance-aware implementation using modern React patterns.</li>
            <li>Strong communication and delivery with measurable outcomes.</li>
          </ul>

          <div className="mt-6 rounded-2xl border border-subtle bg-surface p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Response window</p>
            <p className="mt-2 text-lg font-bold">Within 24-48 hours</p>
          </div>

          <div className="mt-4 rounded-2xl border border-subtle bg-surface p-4">
            <p className="text-xs uppercase tracking-wide text-muted">Support</p>
            <p className="mt-1 text-sm font-semibold text-content">Architecture, redesign, animation, frontend optimization</p>
          </div>
        </aside>

        <form
          onSubmit={handleSubmit(onSubmit)}
          className="glass-panel rounded-3xl border border-subtle bg-surface-alt p-6 shadow-soft"
          noValidate
        >
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <label htmlFor="name" className="text-sm font-semibold">
                Full Name
              </label>
              <input
                id="name"
                type="text"
                {...register("name", { required: "Full name is required." })}
                className="mt-2 w-full rounded-xl border border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                disabled={isSubmitting}
              />
              {errors.name ? <p className="mt-1 text-xs text-red-500">{errors.name.message}</p> : null}
            </div>

            <div>
              <label htmlFor="email" className="text-sm font-semibold">
                Email Address
              </label>
              <input
                id="email"
                type="email"
                {...register("email", {
                  required: "Email is required.",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Enter a valid email address.",
                  },
                })}
                className="mt-2 w-full rounded-xl border border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
                disabled={isSubmitting}
              />
              {errors.email ? <p className="mt-1 text-xs text-red-500">{errors.email.message}</p> : null}
            </div>
          </div>

          <div className="mt-4">
            <label htmlFor="message" className="text-sm font-semibold">
              Message
            </label>
            <textarea
              id="message"
              rows={6}
              {...register("message", {
                required: "Please add a message.",
                minLength: {
                  value: 15,
                  message: "Message should be at least 15 characters.",
                },
              })}
              className="mt-2 w-full rounded-xl border border-subtle bg-surface px-4 py-2.5 text-sm outline-none focus:border-[var(--accent)]"
              disabled={isSubmitting}
            />
            {errors.message ? <p className="mt-1 text-xs text-red-500">{errors.message.message}</p> : null}
          </div>

          <button
            type="submit"
            disabled={isSubmitting}
            data-magnetic="true"
            className="mt-5 rounded-xl bg-[var(--brand)] px-5 py-3 text-sm font-semibold text-white transition hover:-translate-y-1 disabled:cursor-not-allowed disabled:opacity-60"
          >
            {isSubmitting ? "Sending..." : "Send Message"}
          </button>
        </form>
      </div>
    </section>
  );
}
