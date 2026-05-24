"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import {
  ArrowRight,
  BarChart3,
  BookOpen,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Globe,
  Layers3,
  Mail,
  Menu,
  MessageSquare,
  Mic,
  Play,
  Shield,
  Sparkles,
  Star,
  Users,
  X,
  Zap,
} from "lucide-react";

const navLinks = [
  { label: "Features", href: "#features" },
  { label: "Product", href: "#product" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const trustedCompanies = ["Vercel", "Stripe", "Linear", "Notion", "Airtable", "Intercom"];

const features = [
  {
    icon: Sparkles,
    title: "AI notes that feel curated",
    description: "Summaries, action items, and key takeaways presented like a premium internal product, not a generic chatbot.",
  },
  {
    icon: Layers3,
    title: "Structured workflows",
    description: "Organize knowledge into notes, tasks, and revisions with a clear layout that scales for real teams.",
  },
  {
    icon: Shield,
    title: "Trusted by design",
    description: "Built with a calm, enterprise-friendly visual language, smooth interactions, and transparent states.",
  },
  {
    icon: Zap,
    title: "Fast by default",
    description: "Everything is optimized for quick scanning, crisp motion, and mobile-first responsiveness.",
  },
  {
    icon: BookOpen,
    title: "Learning-focused dashboard",
    description: "Track learning progress, key concepts, quizzes, and confidence levels in one elegant workspace.",
  },
  {
    icon: MessageSquare,
    title: "Context-aware chat",
    description: "Ask questions and get answers grounded in your content, with a clean response history and citations-ready structure.",
  },
];

const companyStats = [
  { value: "12k+", label: "Teams onboarded" },
  { value: "99.9%", label: "Uptime" },
  { value: "4.9/5", label: "Customer rating" },
  { value: "180ms", label: "Average response" },
];

const testimonials = [
  {
    name: "Ava Thompson",
    role: "Product Design Lead, Northstar",
    quote: "The UI feels like a funded startup shipped it yesterday. It is polished, fast, and immediately credible.",
    initials: "AT",
  },
  {
    name: "Daniel Kim",
    role: "Operations Director, Helio",
    quote: "The dashboard preview, pricing, and motion system make the product feel premium without becoming noisy.",
    initials: "DK",
  },
  {
    name: "Mia Patel",
    role: "Founder, Atlas Studio",
    quote: "We used this layout as the foundation for our launch page and it looked investor-ready on day one.",
    initials: "MP",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$19",
    description: "For solo founders and early experiments.",
    features: ["1 workspace", "AI summaries", "Basic analytics", "Email support"],
  },
  {
    name: "Growth",
    price: "$49",
    description: "For teams shipping a serious product.",
    recommended: true,
    features: ["Unlimited workspaces", "Advanced automations", "Priority support", "Custom branding"],
  },
  {
    name: "Scale",
    price: "Custom",
    description: "For larger teams with security and service needs.",
    features: ["SSO and roles", "Dedicated onboarding", "SLA support", "Security reviews"],
  },
];

const faqs = [
  {
    question: "Can I customize the branding and layout?",
    answer: "Yes. The structure is modular, so colors, spacing, copy, and sections can be adapted without changing the visual system.",
  },
  {
    question: "Is dark mode supported?",
    answer: "Yes. The page respects system preferences and includes an in-page toggle for a polished light or dark experience.",
  },
  {
    question: "Does the design work on mobile?",
    answer: "Absolutely. Each section is built responsively with stacked layouts, touch-friendly controls, and accessible spacing.",
  },
  {
    question: "Can this be connected to a real backend?",
    answer: "The contact form and product areas are ready to be wired into APIs, forms, or auth flows when you add them.",
  },
  {
    question: "Is the animation heavy?",
    answer: "The motion is intentionally subtle. It adds polish without hurting clarity, performance, or readability.",
  },
];

const socialLinks = [
  { icon: Globe, href: "https://example.com", label: "Website" },
  { icon: Mail, href: "mailto:hello@notemind.ai", label: "Email" },
  { icon: MessageSquare, href: "#contact", label: "Updates" },
];

const dashboardCards = [
  { title: "Active workspace", value: "NoteMind AI", detail: "+18% this week", accent: "from-cyan-400/30 to-sky-500/15" },
  { title: "Tasks completed", value: "84", detail: "7 remaining", accent: "from-emerald-400/30 to-teal-500/15" },
  { title: "Reading pace", value: "1.8x", detail: "Average speed", accent: "from-indigo-400/30 to-violet-500/15" },
];

const chartBars = [52, 74, 58, 86, 64, 92, 78];

function SectionHeading({ eyebrow, title, description }: { eyebrow: string; title: string; description: string }) {
  return (
    <div className="mx-auto max-w-3xl text-center">
      <p className="mb-3 text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">{eyebrow}</p>
      <h2 className="text-3xl font-semibold tracking-tight text-balance text-slate-950 dark:text-white sm:text-4xl">
        {title}
      </h2>
      <p className="mx-auto mt-4 max-w-2xl text-sm leading-7 text-slate-600 dark:text-slate-300 sm:text-base">{description}</p>
    </div>
  );
}

function GlassCard({ children, className = "" }: { children: ReactNode; className?: string }) {
  return <div className={`glass-panel rounded-[1.75rem] ${className}`}>{children}</div>;
}

export default function LandingPage() {
  const [scrolled, setScrolled] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [activeFaq, setActiveFaq] = useState<number>(0);

  useEffect(() => {
    document.documentElement.classList.add("dark");
    window.localStorage.setItem("notemind-theme", "dark");
  }, []);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <main className="relative overflow-hidden">
      <div className="soft-grid pointer-events-none absolute inset-0 opacity-40 dark:opacity-30" />
      <div className="pointer-events-none absolute left-1/2 top-0 h-[44rem] w-[44rem] -translate-x-1/2 rounded-full bg-cyan-400/15 blur-3xl animate-drift" />
      <div className="pointer-events-none absolute right-[-8rem] top-[28rem] h-80 w-80 rounded-full bg-emerald-400/10 blur-3xl animate-drift" />

      <header
        className={`sticky top-0 z-50 border-b transition-all duration-300 ${
          scrolled
            ? "glass-panel border-white/10 bg-white/75 shadow-[0_20px_80px_rgba(15,23,42,0.1)] dark:bg-slate-950/70"
            : "border-transparent bg-transparent"
        }`}
      >
        <div className="mx-auto flex max-w-7xl items-center justify-between px-4 py-4 sm:px-6 lg:px-8">
          <a href="#top" className="flex items-center gap-3">
            <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-sm font-black text-slate-950 shadow-lg shadow-cyan-500/25">
              N
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-slate-900 dark:text-white">NOTE MIND</p>
              <p className="text-xs text-slate-500 dark:text-slate-400">Premium AI study platform</p>
            </div>
          </a>

          <nav className="hidden items-center gap-8 lg:flex">
            {navLinks.map((item) => (
              <a key={item.label} href={item.href} className="text-sm text-slate-600 transition hover:text-slate-950 dark:text-slate-300 dark:hover:text-white">
                {item.label}
              </a>
            ))}
          </nav>

          <div className="flex items-center gap-3">
            <a
              href="#contact"
              className="hidden rounded-full bg-slate-950 px-5 py-2.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950 sm:inline-flex"
            >
              Get started
            </a>
            <button
              type="button"
              onClick={() => setMenuOpen((value) => !value)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/70 text-slate-900 shadow-sm dark:bg-white/5 dark:text-white lg:hidden"
              aria-label="Toggle navigation"
            >
              {menuOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
            </button>
          </div>
        </div>

        <AnimatePresence>
          {menuOpen ? (
            <motion.div
              initial={{ opacity: 0, y: -8 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -8 }}
              className="mx-4 mb-4 rounded-[1.5rem] border border-white/10 bg-white/90 p-4 shadow-[0_20px_80px_rgba(15,23,42,0.1)] backdrop-blur-xl dark:bg-slate-950/85 lg:hidden"
            >
              <div className="flex flex-col gap-3">
                {navLinks.map((item) => (
                  <a key={item.label} href={item.href} onClick={() => setMenuOpen(false)} className="rounded-2xl px-3 py-2 text-sm font-medium text-slate-700 transition hover:bg-slate-100 dark:text-slate-200 dark:hover:bg-white/5">
                    {item.label}
                  </a>
                ))}
              </div>
            </motion.div>
          ) : null}
        </AnimatePresence>
      </header>

      <section id="top" className="relative mx-auto max-w-7xl px-4 pb-20 pt-16 sm:px-6 lg:px-8 lg:pb-28 lg:pt-24">
        <div className="grid items-center gap-12 lg:grid-cols-[1.05fr_0.95fr]">
          <motion.div initial={{ opacity: 0, y: 24 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.7 }} className="relative z-10">
            <div className="inline-flex items-center gap-2 rounded-full border border-cyan-400/20 bg-cyan-400/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.3em] text-cyan-100 shadow-[0_10px_40px_rgba(34,211,238,0.12)]">
              <Sparkles className="h-4 w-4" />
              Premium SaaS landing page
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Build a polished product story that feels like Stripe, Linear, and Framer combined.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              NoteMind AI presents your product with a premium visual system, fluid motion, glassmorphism panels, and a fully responsive layout designed to convert visitors into users.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/login" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a href="#features" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 dark:bg-white/5 dark:text-white">
                Learn More <Play className="ml-2 h-4 w-4" />
              </a>
            </div>

            <div className="mt-10 grid max-w-2xl gap-4 sm:grid-cols-3">
              {companyStats.map((stat) => (
                <GlassCard key={stat.label} className="p-4">
                  <p className="text-2xl font-semibold text-slate-950 dark:text-white">{stat.value}</p>
                  <p className="mt-1 text-sm text-slate-600 dark:text-slate-300">{stat.label}</p>
                </GlassCard>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 36, scale: 0.96 }}
            animate={{ opacity: 1, y: 0, scale: 1 }}
            transition={{ duration: 0.8, delay: 0.1 }}
            className="relative"
          >
            <div className="absolute -left-6 top-8 h-24 w-24 rounded-full bg-cyan-400/20 blur-3xl animate-shimmer" />
            <div className="absolute -right-4 bottom-10 h-28 w-28 rounded-full bg-emerald-400/20 blur-3xl animate-shimmer" />

            <GlassCard className="relative overflow-hidden p-4 sm:p-6">
              <div className="absolute inset-x-0 top-0 h-20 bg-gradient-to-r from-cyan-400/20 via-sky-400/10 to-emerald-400/20" />
              <div className="relative rounded-[1.35rem] border border-white/10 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/25 dark:bg-slate-900">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/90">Live product overview</p>
                    <h2 className="mt-2 text-2xl font-semibold">Everything your visitors need in one glance</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">Updated now</div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-300">Revenue trend</p>
                        <p className="mt-1 text-2xl font-semibold">$24.8k</p>
                      </div>
                      <BarChart3 className="h-5 w-5 text-cyan-300" />
                    </div>
                    <div className="mt-5 flex h-44 items-end gap-2">
                      {chartBars.map((height, index) => (
                        <motion.div
                          key={index}
                          initial={{ height: 0 }}
                          animate={{ height: `${height}%` }}
                          transition={{ duration: 0.8, delay: 0.1 * index }}
                          className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-400 via-sky-400 to-emerald-300 shadow-[0_0_20px_rgba(34,211,238,0.18)]"
                        />
                      ))}
                    </div>
                  </div>

                  <div className="space-y-4">
                    {dashboardCards.map((card) => (
                      <div key={card.title} className={`rounded-[1.25rem] border border-white/10 bg-gradient-to-br ${card.accent} p-4`}>
                        <p className="text-sm text-slate-300">{card.title}</p>
                        <div className="mt-2 flex items-end justify-between gap-3">
                          <p className="text-3xl font-semibold text-white">{card.value}</p>
                          <p className="text-xs text-slate-200/80">{card.detail}</p>
                        </div>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="mt-4 grid gap-4 sm:grid-cols-[0.95fr_1.05fr]">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Today&apos;s focus</p>
                    <div className="mt-3 space-y-3">
                      {[
                        ["Launch page", "Ready", "bg-emerald-400"],
                        ["Product demo", "In review", "bg-cyan-400"],
                        ["Social proof", "Approved", "bg-sky-400"],
                      ].map(([label, status, tone]) => (
                        <div key={label} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-3 py-2">
                          <div className="flex items-center gap-3">
                            <span className={`h-2.5 w-2.5 rounded-full ${tone}`} />
                            <span className="text-sm text-slate-200">{label}</span>
                          </div>
                          <span className="text-xs text-slate-400">{status}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-300">Engagement summary</p>
                        <p className="mt-1 text-lg font-semibold">High-intent visitors are converting</p>
                      </div>
                      <Users className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                      {[
                        ["72%", "Scroll depth"],
                        ["41%", "CTA clicks"],
                        ["19%", "Demo requests"],
                      ].map(([value, label]) => (
                        <div key={label} className="rounded-2xl bg-white/5 px-3 py-4">
                          <p className="text-xl font-semibold text-white">{value}</p>
                          <p className="mt-1 text-xs text-slate-400">{label}</p>
                        </div>
                      ))}
                    </div>
                  </div>
                </div>
              </div>
            </GlassCard>
          </motion.div>
        </div>
      </section>

      <section className="mx-auto max-w-7xl px-4 py-8 sm:px-6 lg:px-8">
        <GlassCard className="p-6 sm:p-8">
          <p className="text-center text-xs font-semibold uppercase tracking-[0.35em] text-slate-500 dark:text-slate-400">Trusted by companies</p>
          <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-3 lg:grid-cols-6">
            {trustedCompanies.map((company) => (
              <div key={company} className="flex items-center justify-center rounded-2xl border border-white/10 bg-white/50 px-4 py-4 text-sm font-semibold text-slate-600 transition hover:-translate-y-0.5 dark:bg-white/5 dark:text-slate-200">
                {company}
              </div>
            ))}
          </div>
        </GlassCard>
      </section>

      <section id="features" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Features"
          title="Designed to look expensive, work beautifully, and feel effortless."
          description="Every block is intentionally composed with premium spacing, motion, and hierarchy so your product page feels like a real startup launch."
        />

        <div className="mt-14 grid gap-5 md:grid-cols-2 xl:grid-cols-3">
          {features.map((feature, index) => {
            const Icon = feature.icon;
            return (
              <motion.article
                key={feature.title}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.55, delay: index * 0.05 }}
                className="group rounded-[1.75rem] border border-white/10 bg-white/70 p-6 shadow-[0_20px_90px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 hover:shadow-[0_24px_100px_rgba(15,23,42,0.12)] dark:bg-slate-950/55"
              >
                <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400/20 via-sky-400/15 to-emerald-400/20 text-cyan-500 dark:text-cyan-300">
                  <Icon className="h-6 w-6" />
                </div>
                <h3 className="mt-5 text-xl font-semibold text-slate-950 dark:text-white">{feature.title}</h3>
                <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{feature.description}</p>
                <div className="mt-6 inline-flex items-center gap-2 text-sm font-medium text-cyan-600 transition group-hover:gap-3 dark:text-cyan-300">
                  Learn more <ChevronRight className="h-4 w-4" />
                </div>
              </motion.article>
            );
          })}
        </div>
      </section>

      <section id="product" className="mx-auto max-w-7xl px-4 py-16 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.9fr_1.1fr]">
          <motion.div
            initial={{ opacity: 0, x: -24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.25 }}
            transition={{ duration: 0.6 }}
          >
            <SectionHeading
              eyebrow="Dashboard"
              title="A product preview that communicates value before the first click."
              description="Use this section to visually explain your platform, show depth, and make the website feel like an actual product launch."
            />

            <div className="mt-8 space-y-4">
              {[
                "Realtime analytics and clear progress states",
                "Elegant content cards for product storytelling",
                "Focused CTA placement that drives conversions",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/70 p-4 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="glass-panel rounded-[2rem] p-4 sm:p-6"
          >
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950 p-5 text-white dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-400">Product preview</p>
                  <h3 className="mt-1 text-xl font-semibold">Analytics cockpit</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  <Globe className="h-3.5 w-3.5" />
                  Live
                </div>
              </div>

              <div className="mt-5 grid gap-4 sm:grid-cols-3">
                {dashboardCards.map((card) => (
                  <div key={card.title} className="rounded-3xl border border-white/10 bg-white/5 p-4">
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{card.title}</p>
                    <p className="mt-3 text-3xl font-semibold">{card.value}</p>
                    <p className="mt-2 text-sm text-slate-300">{card.detail}</p>
                  </div>
                ))}
              </div>

              <div className="mt-4 grid gap-4 lg:grid-cols-[1.05fr_0.95fr]">
                <div className="rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-slate-200">Weekly engagement</p>
                    <BarChart3 className="h-4 w-4 text-cyan-300" />
                  </div>
                  <div className="mt-5 flex h-52 items-end gap-2">
                    {[42, 61, 75, 52, 88, 64, 94].map((height, index) => (
                      <motion.div
                        key={index}
                        initial={{ height: 0 }}
                        whileInView={{ height: `${height}%` }}
                        viewport={{ once: true }}
                        transition={{ duration: 0.7, delay: index * 0.05 }}
                        className="flex-1 rounded-t-2xl bg-gradient-to-t from-cyan-400 via-sky-400 to-emerald-300"
                      />
                    ))}
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-300">Recent activity</p>
                    <div className="mt-4 space-y-3">
                      {[
                        ["New user cohort", "+128 signups"],
                        ["Template update", "Deployed 2h ago"],
                        ["Demo requests", "18 today"],
                      ].map(([title, detail]) => (
                        <div key={title} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-3 py-2 text-sm">
                          <span className="text-slate-200">{title}</span>
                          <span className="text-slate-400">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                  <div className="rounded-2xl bg-gradient-to-br from-cyan-400/20 via-sky-400/10 to-emerald-400/15 p-4">
                    <p className="text-sm text-slate-200">Conversion snapshot</p>
                    <p className="mt-2 text-4xl font-semibold text-white">8.6%</p>
                    <p className="mt-2 text-sm text-slate-300">This section is ideal for a real product mockup, graph, or screenshot when you connect your final visuals.</p>
                  </div>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </section>

      <section id="about" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.92fr_1.08fr]">
          <GlassCard className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">About</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Built to feel like a premium funded startup from the first scroll.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              This layout combines sharp visual hierarchy, refined spacing, modern cards, and elegant motion so your site immediately communicates credibility, clarity, and momentum.
            </p>
            <div className="mt-6 grid gap-4 sm:grid-cols-2">
              {[
                ["Design system", "Consistent tokens and reusable panels."],
                ["Responsive first", "Optimized for phone, tablet, and desktop."],
                ["Motion aware", "Subtle animation that supports the message."],
                ["Brand ready", "Flexible enough for real company content."],
              ].map(([title, description]) => (
                <div key={title} className="rounded-2xl border border-white/10 bg-white/60 p-4 dark:bg-white/5">
                  <p className="font-medium text-slate-900 dark:text-white">{title}</p>
                  <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-300">{description}</p>
                </div>
              ))}
            </div>
          </GlassCard>

          <div className="grid gap-4 sm:grid-cols-2">
            {[
              { value: "240+", label: "Pixel-perfect UI blocks" },
              { value: "18", label: "Reusable content sections" },
              { value: "3x", label: "Clearer product storytelling" },
              { value: "100%", label: "Mobile responsive" },
            ].map((metric) => (
              <GlassCard key={metric.label} className="p-6">
                <p className="text-4xl font-semibold text-slate-950 dark:text-white">{metric.value}</p>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-300">{metric.label}</p>
              </GlassCard>
            ))}
            <GlassCard className="sm:col-span-2 overflow-hidden p-0">
              <div className="relative isolate h-full min-h-64 overflow-hidden rounded-[1.75rem] bg-gradient-to-br from-slate-950 via-slate-900 to-cyan-950 p-6 text-white">
                <div className="absolute inset-0 bg-[radial-gradient(circle_at_top_right,_rgba(34,211,238,0.22),_transparent_35%),radial-gradient(circle_at_bottom_left,_rgba(16,185,129,0.18),_transparent_28%)]" />
                <div className="relative flex h-full flex-col justify-between">
                  <div>
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-200/80">Why it works</p>
                    <h3 className="mt-3 max-w-md text-2xl font-semibold">A landing page should feel like the product, not just a brochure.</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      "Professional typography",
                      "Gradient-rich composition",
                      "Smooth conversion flow",
                    ].map((item) => (
                      <div key={item} className="rounded-2xl border border-white/10 bg-white/5 px-4 py-3 text-sm text-slate-200">
                        {item}
                      </div>
                    ))}
                  </div>
                </div>
              </div>
            </GlassCard>
          </div>
        </div>
      </section>

      <section id="testimonials" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Testimonials"
          title="Social proof that looks as credible as the rest of the page."
          description="Use these cards to show what real users say about the product and to reinforce trust at the right moment."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {testimonials.map((testimonial, index) => (
            <motion.article
              key={testimonial.name}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.2 }}
              transition={{ duration: 0.55, delay: index * 0.05 }}
              className="rounded-[1.75rem] border border-white/10 bg-white/70 p-6 shadow-[0_20px_90px_rgba(15,23,42,0.08)] dark:bg-slate-950/55"
            >
              <div className="flex items-center gap-1 text-amber-400">
                {[1, 2, 3, 4, 5].map((star) => (
                  <Star key={star} className="h-4 w-4 fill-current" />
                ))}
              </div>
              <p className="mt-5 text-sm leading-7 text-slate-600 dark:text-slate-300">“{testimonial.quote}”</p>
              <div className="mt-6 flex items-center gap-4">
                <div className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-sm font-bold text-slate-950">
                  {testimonial.initials}
                </div>
                <div>
                  <p className="font-semibold text-slate-950 dark:text-white">{testimonial.name}</p>
                  <p className="text-sm text-slate-500 dark:text-slate-400">{testimonial.role}</p>
                </div>
              </div>
            </motion.article>
          ))}
        </div>
      </section>

      <section id="pricing" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="Pricing"
          title="Three plans with a clear recommended choice."
          description="A strong pricing section should make the decision obvious. Keep the visual emphasis on the middle tier while still giving every option a clean presentation."
        />

        <div className="mt-14 grid gap-5 lg:grid-cols-3">
          {pricingPlans.map((plan) => (
            <div
              key={plan.name}
              className={`relative rounded-[1.75rem] border p-6 shadow-[0_20px_90px_rgba(15,23,42,0.08)] transition hover:-translate-y-1 ${
                plan.recommended
                  ? "border-cyan-300/40 bg-gradient-to-b from-cyan-400/15 via-white/80 to-white dark:via-slate-950/75 dark:to-slate-950"
                  : "border-white/10 bg-white/70 dark:bg-slate-950/55"
              }`}
            >
              {plan.recommended ? <div className="absolute right-5 top-5 rounded-full bg-cyan-400/15 px-3 py-1 text-xs font-semibold text-cyan-700 dark:text-cyan-200">Recommended</div> : null}
              <p className="text-sm font-medium uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{plan.name}</p>
              <div className="mt-4 flex items-end gap-2">
                <span className="text-5xl font-semibold text-slate-950 dark:text-white">{plan.price}</span>
                {plan.price !== "Custom" ? <span className="pb-1 text-sm text-slate-500 dark:text-slate-400">/month</span> : null}
              </div>
              <p className="mt-3 text-sm leading-7 text-slate-600 dark:text-slate-300">{plan.description}</p>
              <div className="mt-6 space-y-3">
                {plan.features.map((feature) => (
                  <div key={feature} className="flex items-center gap-3 text-sm text-slate-700 dark:text-slate-200">
                    <CheckCircle2 className="h-4 w-4 text-emerald-500" />
                    {feature}
                  </div>
                ))}
              </div>
              <a
                href="#contact"
                className={`mt-8 inline-flex w-full items-center justify-center rounded-full px-5 py-3 text-sm font-semibold transition hover:-translate-y-0.5 ${
                  plan.recommended ? "bg-slate-950 text-white dark:bg-white dark:text-slate-950" : "border border-white/10 bg-white/70 text-slate-900 dark:bg-white/5 dark:text-white"
                }`}
              >
                {plan.price === "Custom" ? "Talk to sales" : "Start trial"}
              </a>
            </div>
          ))}
        </div>
      </section>

      <section id="faq" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <SectionHeading
          eyebrow="FAQ"
          title="A clean FAQ makes the page feel complete and ready for launch."
          description="These questions cover the essentials visitors usually want before they convert, and the accordion keeps the section compact and polished."
        />

        <div className="mx-auto mt-14 max-w-3xl space-y-4">
          {faqs.map((faq, index) => {
            const open = activeFaq === index;
            return (
              <GlassCard key={faq.question} className="overflow-hidden">
                <button
                  type="button"
                  onClick={() => setActiveFaq(open ? -1 : index)}
                  className="flex w-full items-center justify-between gap-4 px-5 py-5 text-left sm:px-6"
                >
                  <span className="text-sm font-medium text-slate-950 dark:text-white sm:text-base">{faq.question}</span>
                  <ChevronDown className={`h-5 w-5 shrink-0 text-slate-500 transition ${open ? "rotate-180" : ""}`} />
                </button>
                <AnimatePresence initial={false}>
                  {open ? (
                    <motion.div
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: "auto", opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.25 }}
                      className="overflow-hidden"
                    >
                      <div className="px-5 pb-5 text-sm leading-7 text-slate-600 dark:text-slate-300 sm:px-6">{faq.answer}</div>
                    </motion.div>
                  ) : null}
                </AnimatePresence>
              </GlassCard>
            );
          })}
        </div>
      </section>

      <section id="contact" className="mx-auto max-w-7xl px-4 py-20 sm:px-6 lg:px-8">
        <div className="grid gap-8 lg:grid-cols-[0.95fr_1.05fr]">
          <GlassCard className="p-6 sm:p-8">
            <p className="text-xs font-semibold uppercase tracking-[0.35em] text-cyan-300/90">Contact</p>
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Everything you expect from a real SaaS website is here.</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Add your own backend later, but keep this polished surface in place so the page already feels complete, legitimate, and conversion-ready.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: Mail, label: "Email", value: "hello@notemind.ai" },
                { icon: Mic, label: "Phone", value: "+1 (415) 555-0138" },
                { icon: Globe, label: "Location", value: "San Francisco, California" },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div key={item.label} className="flex items-center gap-4 rounded-2xl border border-white/10 bg-white/60 p-4 dark:bg-white/5">
                    <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-cyan-400/10 text-cyan-500 dark:text-cyan-300">
                      <Icon className="h-5 w-5" />
                    </div>
                    <div>
                      <p className="text-xs uppercase tracking-[0.24em] text-slate-500 dark:text-slate-400">{item.label}</p>
                      <p className="mt-1 text-sm font-medium text-slate-900 dark:text-white">{item.value}</p>
                    </div>
                  </div>
                );
              })}
            </div>
          </GlassCard>

          <GlassCard className="p-6 sm:p-8">
            <form className="grid gap-4">
              <div className="grid gap-4 sm:grid-cols-2">
                <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  First name
                  <input type="text" placeholder="Alex" className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white" />
                </label>
                <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                  Company
                  <input type="text" placeholder="Northstar Labs" className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white" />
                </label>
              </div>
              <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Email
                <input type="email" placeholder="alex@company.com" className="rounded-2xl border border-white/10 bg-white/80 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white" />
              </label>
              <label className="grid gap-2 text-sm font-medium text-slate-700 dark:text-slate-200">
                Message
                <textarea
                  rows={6}
                  placeholder="Tell us about your product goals, launch timeline, or customization needs."
                  className="rounded-[1.25rem] border border-white/10 bg-white/80 px-4 py-3 text-slate-950 outline-none transition placeholder:text-slate-400 focus:border-cyan-300 dark:bg-slate-950/50 dark:text-white"
                />
              </label>

              <div className="flex flex-col gap-3 sm:flex-row sm:items-center">
                <a href="mailto:hello@notemind.ai" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
                  Send inquiry <ArrowRight className="ml-2 h-4 w-4" />
                </a>
                <p className="text-sm text-slate-500 dark:text-slate-400">Response within one business day.</p>
              </div>
            </form>
          </GlassCard>
        </div>
      </section>

      <footer className="border-t border-white/10 bg-white/70 py-14 dark:bg-slate-950/60">
        <div className="mx-auto grid max-w-7xl gap-10 px-4 sm:px-6 lg:grid-cols-[0.95fr_0.85fr_0.9fr] lg:px-8">
          <div>
            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-sm font-black text-slate-950">N</div>
              <div>
                <p className="text-sm font-semibold tracking-[0.3em] text-slate-900 dark:text-white">NOTE MIND</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">Premium product UI kit</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-300">
              A clean, modular marketing experience built to make a startup look credible, premium, and ready to ship.
            </p>
            <div className="mt-6 flex items-center gap-3">
              {socialLinks.map((item) => {
                const Icon = item.icon;
                return (
                  <a key={item.label} href={item.href} aria-label={item.label} className="flex h-11 w-11 items-center justify-center rounded-full border border-white/10 bg-white/80 text-slate-700 transition hover:-translate-y-0.5 dark:bg-white/5 dark:text-slate-200">
                    <Icon className="h-4 w-4" />
                  </a>
                );
              })}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Quick links</p>
            <div className="mt-5 grid gap-3 text-sm text-slate-600 dark:text-slate-300">
              {navLinks.map((item) => (
                <a key={item.label} href={item.href} className="transition hover:text-slate-950 dark:hover:text-white">
                  {item.label}
                </a>
              ))}
            </div>
          </div>

          <div>
            <p className="text-sm font-semibold uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">Contact info</p>
            <div className="mt-5 space-y-3 text-sm text-slate-600 dark:text-slate-300">
              <p>hello@notemind.ai</p>
              <p>+1 (415) 555-0138</p>
              <p>San Francisco, CA</p>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/70 p-4 text-xs leading-6 text-slate-500 dark:bg-white/5 dark:text-slate-400">
              Smooth gradients, premium spacing, subtle glassmorphism, and motion carefully tuned for a polished SaaS launch experience.
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-white/10 px-4 pt-6 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} NoteMind AI. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            Crafted for a premium first impression <ArrowRight className="h-4 w-4" />
          </p>
        </div>
      </footer>
    </main>
  );
}