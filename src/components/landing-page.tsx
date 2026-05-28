"use client";

import { useEffect, useState, type ReactNode } from "react";
import { AnimatePresence, motion } from "framer-motion";
import Link from "next/link";
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
  { label: "Overview", href: "#top" },
  { label: "Features", href: "#features" },
  { label: "Chat With Notes", href: "#product" },
  { label: "About", href: "#about" },
  { label: "Pricing", href: "#pricing" },
  { label: "FAQ", href: "#faq" },
  { label: "Contact", href: "#contact" },
];

const trustedCompanies = ["Vercel", "Stripe", "Linear", "Notion", "Airtable", "Intercom"];

const features = [
  {
    icon: Sparkles,
    title: "Upload PDFs or notes",
    description: "Students can paste notes or upload PDFs, then let Synapzi AI extract the text and prepare it for study.",
  },
  {
    icon: Layers3,
    title: "Generate study materials",
    description: "Create summaries, key points, quizzes, revision notes, and important questions automatically from the same note.",
  },
  {
    icon: Shield,
    title: "Chat only from your notes",
    description: "Ask chapter questions, formula questions, or simple explanations and the AI answers only from the uploaded material.",
  },
  {
    icon: Zap,
    title: "Study in multiple languages",
    description: "Use the platform in English, Hindi, or Kannada to make learning easier and more accessible.",
  },
  {
    icon: BookOpen,
    title: "Simple student dashboard",
    description: "See uploaded notes, summary cards, quiz tools, and revision helpers in one clean workspace.",
  },
  {
    icon: MessageSquare,
    title: "Revision notes and important questions",
    description: "Automatically generate revision notes, formula sheets, and important questions for quick exam preparation.",
  },
];

const companyStats = [
  { value: "PDFs", label: "Uploaded and extracted" },
  { value: "AI", label: "Summaries and quizzes" },
  { value: "Chat", label: "Only from notes" },
  { value: "3", label: "Supported languages" },
];

const testimonials = [
  {
    name: "Ava Thompson",
    role: "Class 10 Student",
    quote: "I can upload my chapter notes and quickly get summaries, important questions, and a quiz without jumping between apps.",
    initials: "AT",
  },
  {
    name: "Daniel Kim",
    role: "Engineering Student",
    quote: "The chat with notes feature is the best part. It answers only from my uploaded material, so revision stays focused.",
    initials: "DK",
  },
  {
    name: "Mia Patel",
    role: "Bilingual Learner",
    quote: "Being able to study in Hindi and Kannada makes the platform much easier to use for everyday learning.",
    initials: "MP",
  },
];

const pricingPlans = [
  {
    name: "Starter",
    price: "$19",
    description: "For students who want a simple way to upload notes and study smarter.",
    features: ["Upload PDFs", "Generate summaries", "Key points and questions", "Chat with notes"],
  },
  {
    name: "Growth",
    price: "$49",
    description: "For students who rely on quizzes, revision notes, and multilingual support.",
    recommended: true,
    features: ["Unlimited notes", "Hindi and Kannada support", "Auto quizzes", "Revision tools"],
  },
  {
    name: "Scale",
    price: "Custom",
    description: "For schools or institutions that want to roll it out to many students.",
    features: ["Team rollout", "Central note library", "Study analytics", "Custom onboarding"],
  },
];

const faqs = [
  {
    question: "Can I upload both PDFs and typed notes?",
    answer: "Yes. Students can upload PDFs or paste notes directly, and the platform extracts the text for study tools.",
  },
  {
    question: "How does chat with notes work?",
    answer: "You ask a question, the note text is sent to the AI, and the answer is generated only from the uploaded material.",
  },
  {
    question: "Can I get summaries and quizzes automatically?",
    answer: "Yes. Synapzi AI can generate summaries, key points, quizzes, revision notes, and important questions from your notes.",
  },
  {
    question: "Which languages are supported?",
    answer: "The platform supports English, Hindi, and Kannada to make studying more accessible for more students.",
  },
  {
    question: "What is the main goal of the platform?",
    answer: "To help students study smarter with AI using their own uploaded notes, with a simple and beginner-friendly workflow.",
  },
];

const socialLinks = [
  { icon: Globe, href: "https://example.com", label: "Website" },
  { icon: Mail, href: "mailto:hello@synapzi.ai", label: "Email" },
  { icon: MessageSquare, href: "#product", label: "Chat" },
];

const dashboardCards = [
  { title: "Uploaded notes", value: "12", detail: "PDFs and typed notes", accent: "from-cyan-400/30 to-sky-500/15" },
  { title: "AI summaries", value: "5", detail: "Key points and revision", accent: "from-emerald-400/30 to-teal-500/15" },
  { title: "Quiz types", value: "3", detail: "MCQ, T/F, short answer", accent: "from-indigo-400/30 to-violet-500/15" },
];

const chatHighlights = [
  {
    title: "Grounded in your notes",
    description: "Answers stay tied to the uploaded chapter, so students get focused help instead of generic responses.",
  },
  {
    title: "Follow-up questions stay in context",
    description: "Students can keep asking until the idea clicks, which makes revision feel like a real tutor session.",
  },
  {
    title: "Built for multilingual study",
    description: "The same note can be studied in English, Hindi, or Kannada without changing the workflow.",
  },
];

const chatMessages = [
  {
    role: "user",
    content: "Explain the main idea behind this chapter in simple language.",
  },
  {
    role: "assistant",
    content: "The chapter focuses on force, motion, and energy. It explains how objects move, how forces change motion, and how energy is transferred in everyday examples.",
    source: "From uploaded notes",
  },
  {
    role: "assistant",
    content: "You can ask a follow-up about formulas, definitions, or a specific paragraph if you want a shorter revision answer.",
    source: "Context preserved",
  },
];

const chatSignals = [
  { label: "Source-grounded", value: "Yes" },
  { label: "Languages", value: "3" },
  { label: "Follow-ups", value: "Unlimited" },
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
    window.localStorage.setItem("synapzi-theme", "dark");
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
              S
            </div>
            <div>
              <p className="text-sm font-semibold tracking-[0.3em] text-slate-900 dark:text-white">SYNAPZI</p>
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
              Study smarter with AI
            </div>

            <h1 className="mt-6 max-w-4xl text-5xl font-semibold tracking-tight text-balance text-slate-950 dark:text-white sm:text-6xl lg:text-7xl">
              Synapzi AI helps students upload notes, ask questions, and learn faster with AI.
            </h1>

            <p className="mt-6 max-w-2xl text-lg leading-8 text-slate-600 dark:text-slate-300 sm:text-xl">
              Upload PDFs or typed notes, extract the text instantly, and generate summaries, key points, quizzes, revision notes, and important questions from one simple dashboard.
            </p>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <a href="/login" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white shadow-lg shadow-slate-950/20 transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
                Get Started <ArrowRight className="ml-2 h-4 w-4" />
              </a>
              <a href="#features" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 dark:bg-white/5 dark:text-white">
                See Features <Play className="ml-2 h-4 w-4" />
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
                    <p className="text-xs uppercase tracking-[0.3em] text-cyan-300/90">Live study dashboard</p>
                    <h2 className="mt-2 text-2xl font-semibold">Everything students need in one glance</h2>
                  </div>
                  <div className="rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">Updated now</div>
                </div>

                <div className="mt-6 grid gap-4 sm:grid-cols-[1.15fr_0.85fr]">
                  <div className="rounded-[1.25rem] border border-white/10 bg-white/5 p-4">
                    <div className="flex items-center justify-between">
                      <div>
                        <p className="text-sm text-slate-300">Study streak</p>
                        <p className="mt-1 text-2xl font-semibold">24 notes</p>
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
                    <p className="text-sm text-slate-300">Today&apos;s study plan</p>
                    <div className="mt-3 space-y-3">
                      {[
                        ["Upload chapter PDF", "Ready", "bg-emerald-400"],
                        ["Generate quiz", "In review", "bg-cyan-400"],
                        ["Revise key points", "Approved", "bg-sky-400"],
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
                        <p className="text-sm text-slate-300">Revision summary</p>
                        <p className="mt-1 text-lg font-semibold">Students are revising faster with AI</p>
                      </div>
                      <Users className="h-5 w-5 text-emerald-300" />
                    </div>
                    <div className="mt-4 grid grid-cols-3 gap-3 text-center">
                      {[
                        ["72%", "Summary use"],
                        ["41%", "Quiz attempts"],
                        ["19%", "Chat questions"],
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
          <p className="mt-2 text-center text-sm text-slate-500 dark:text-slate-400">Built for students, tutors, and anyone who wants a simple AI study workflow.</p>
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
          title="Everything students need to study smarter in one place."
          description="From note upload to AI-generated summaries, quiz creation, revision notes, and language support, the platform keeps learning simple."
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
              eyebrow="Chat With Notes"
              title="Ask questions from your notes and get answers grounded in the source."
              description="Students open a note, ask a question, and continue the conversation with responses that stay tied to the uploaded material."
            />

            <div className="mt-8 space-y-4">
              {[
                "Open any saved note and start a grounded conversation immediately",
                "Keep follow-up questions in context for deeper revision",
                "Move from chat to summary, quiz, or revision in one workflow",
              ].map((item) => (
                <div key={item} className="flex items-start gap-3 rounded-2xl border border-white/10 bg-white/70 p-4 text-sm text-slate-700 dark:bg-white/5 dark:text-slate-200">
                  <CheckCircle2 className="mt-0.5 h-5 w-5 shrink-0 text-emerald-500" />
                  <span>{item}</span>
                </div>
              ))}
            </div>

            <div className="mt-8 grid gap-4 sm:grid-cols-3">
              {chatSignals.map((signal) => (
                <div key={signal.label} className="rounded-2xl border border-white/10 bg-white/60 p-4 dark:bg-white/5">
                  <p className="text-xs uppercase tracking-[0.28em] text-slate-500 dark:text-slate-400">{signal.label}</p>
                  <p className="mt-2 text-2xl font-semibold text-slate-950 dark:text-white">{signal.value}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 space-y-4">
              {chatHighlights.map((item) => (
                <div key={item.title} className="rounded-[1.25rem] border border-white/10 bg-white/70 p-5 dark:bg-white/5">
                  <p className="text-sm font-semibold text-slate-950 dark:text-white">{item.title}</p>
                  <p className="mt-2 text-sm leading-7 text-slate-600 dark:text-slate-300">{item.description}</p>
                </div>
              ))}
            </div>

            <div className="mt-8 flex flex-col gap-3 sm:flex-row">
              <Link href="/chat?note=sample-note" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
                Try Chat With Notes <ArrowRight className="ml-2 h-4 w-4" />
              </Link>
              <Link href="/dashboard" className="inline-flex items-center justify-center rounded-full border border-white/20 bg-white/70 px-6 py-3.5 text-sm font-semibold text-slate-900 transition hover:-translate-y-0.5 dark:bg-white/5 dark:text-white">
                Open Dashboard
              </Link>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 24 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.2 }}
            transition={{ duration: 0.65 }}
            className="glass-panel rounded-[2rem] p-4 sm:p-6"
          >
            <div className="overflow-hidden rounded-[1.5rem] border border-white/10 bg-slate-950 p-5 text-white shadow-2xl shadow-slate-950/25 dark:bg-slate-900">
              <div className="flex items-center justify-between border-b border-white/10 pb-4">
                <div>
                  <p className="text-xs uppercase tracking-[0.28em] text-cyan-300/90">Grounded chat preview</p>
                  <h3 className="mt-1 text-xl font-semibold">A realistic note-to-answer workflow</h3>
                </div>
                <div className="flex items-center gap-2 rounded-full border border-white/10 bg-white/5 px-3 py-1.5 text-xs text-slate-300">
                  <Globe className="h-3.5 w-3.5" />
                  English
                </div>
              </div>

              <div className="mt-5 grid gap-4 lg:grid-cols-[0.9fr_1.1fr]">
                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  <div>
                    <p className="text-xs uppercase tracking-[0.24em] text-slate-400">Selected note</p>
                    <p className="mt-2 text-lg font-semibold text-white">Physics Chapter 4</p>
                    <p className="mt-1 text-sm text-slate-300">Force, motion, and energy</p>
                  </div>

                  <div className="rounded-2xl bg-white/5 p-4">
                    <p className="text-sm text-slate-300">What the AI can answer</p>
                    <div className="mt-3 space-y-3">
                      {[
                        ["Definitions", "What is force?"],
                        ["Formula help", "How do I calculate work?"],
                        ["Revision", "Explain this in simpler words"],
                      ].map(([label, detail]) => (
                        <div key={label} className="flex items-center justify-between gap-3 rounded-2xl bg-white/5 px-3 py-2 text-sm">
                          <span className="text-slate-200">{label}</span>
                          <span className="text-slate-400">{detail}</span>
                        </div>
                      ))}
                    </div>
                  </div>

                  <div className="rounded-2xl border border-emerald-400/20 bg-emerald-400/10 p-4">
                    <p className="text-sm text-emerald-100">Answer quality</p>
                    <p className="mt-2 text-3xl font-semibold text-white">Source only</p>
                    <p className="mt-2 text-sm text-emerald-50/80">Responses stay grounded in the uploaded note instead of drifting into generic AI output.</p>
                  </div>
                </div>

                <div className="space-y-4 rounded-3xl border border-white/10 bg-white/5 p-4">
                  {chatMessages.map((message, index) => (
                    <div
                      key={`${message.role}-${index}`}
                      className={`rounded-[1.5rem] p-4 ${message.role === "user" ? "ml-auto max-w-[90%] bg-cyan-400/15 text-white" : "max-w-[92%] bg-white/5 text-slate-100"}`}
                    >
                      <div className="flex items-center justify-between gap-3 text-xs uppercase tracking-[0.24em] text-slate-400">
                        <span>{message.role === "user" ? "Student" : "Assistant"}</span>
                        {"source" in message ? <span>{message.source}</span> : null}
                      </div>
                      <p className="mt-3 text-sm leading-7 text-slate-100">{message.content}</p>
                    </div>
                  ))}

                  <div className="grid gap-3 sm:grid-cols-3">
                    {dashboardCards.map((card) => (
                      <div key={card.title} className={`rounded-3xl border border-white/10 bg-gradient-to-br ${card.accent} p-4`}>
                        <p className="text-xs uppercase tracking-[0.24em] text-slate-300">{card.title}</p>
                        <p className="mt-3 text-2xl font-semibold text-white">{card.value}</p>
                        <p className="mt-2 text-xs text-slate-200/80">{card.detail}</p>
                      </div>
                    ))}
                  </div>

                  <div className="rounded-2xl border border-white/10 bg-slate-900/80 p-4">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-slate-200">Session health</p>
                      <BarChart3 className="h-4 w-4 text-cyan-300" />
                    </div>
                    <div className="mt-4 grid gap-3 sm:grid-cols-3">
                      {[
                        ["Context retained", "Yes"],
                        ["Quick follow-ups", "Ready"],
                        ["Study workflow", "Unified"],
                      ].map(([label, value]) => (
                        <div key={label} className="rounded-2xl bg-white/5 px-3 py-3">
                          <p className="text-xs uppercase tracking-[0.24em] text-slate-400">{label}</p>
                          <p className="mt-2 text-sm font-semibold text-white">{value}</p>
                        </div>
                      ))}
                    </div>
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
                    <h3 className="mt-3 max-w-md text-2xl font-semibold">Students get one place to upload, study, revise, and ask questions.</h3>
                  </div>
                  <div className="grid gap-3 sm:grid-cols-3">
                    {[
                      "Upload PDFs or notes",
                      "Chat with notes",
                      "Summaries and quizzes",
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
          title="Students can see the value immediately."
          description="These testimonials reflect the core experience: simple uploads, focused answers, and study tools that save time."
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
          title="Simple plans for individuals and classrooms."
          description="Keep pricing easy to understand, with a recommended plan for most students and a custom option for larger rollouts."
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
          title="Quick answers for students and teachers."
          description="These questions explain how uploads, chat with notes, summaries, quizzes, and multilingual support work."
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
            <h2 className="mt-4 text-3xl font-semibold tracking-tight text-slate-950 dark:text-white">Ready to study smarter with Synapzi AI?</h2>
            <p className="mt-4 text-sm leading-7 text-slate-600 dark:text-slate-300">
              Start with a clean, simple learning workflow and add your own backend later if you want to connect real authentication, storage, or classroom features.
            </p>

            <div className="mt-8 space-y-4">
              {[
                { icon: Mail, label: "Email", value: "hello@synapzi.ai" },
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
                <a href="mailto:hello@synapzi.ai" className="inline-flex items-center justify-center rounded-full bg-slate-950 px-6 py-3.5 text-sm font-semibold text-white transition hover:-translate-y-0.5 dark:bg-white dark:text-slate-950">
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
              <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-gradient-to-br from-cyan-400 via-sky-500 to-emerald-400 text-sm font-black text-slate-950">S</div>
              <div>
                <p className="text-sm font-semibold tracking-[0.3em] text-slate-900 dark:text-white">SYNAPZI</p>
                <p className="text-xs text-slate-500 dark:text-slate-400">AI study platform for students</p>
              </div>
            </div>
            <p className="mt-5 max-w-sm text-sm leading-7 text-slate-600 dark:text-slate-300">
              Upload PDFs or notes, extract the text, chat with your study material, and generate the tools you need to revise faster.
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
              <p>hello@synapzi.ai</p>
              <p>+1 (415) 555-0138</p>
              <p>San Francisco, CA</p>
            </div>
            <div className="mt-6 rounded-2xl border border-white/10 bg-white/70 p-4 text-xs leading-6 text-slate-500 dark:bg-white/5 dark:text-slate-400">
              Built for a simple student workflow with dark mode, soft motion, and clear study-focused sections.
            </div>
          </div>
        </div>

        <div className="mx-auto mt-10 flex max-w-7xl flex-col gap-4 border-t border-white/10 px-4 pt-6 text-sm text-slate-500 dark:text-slate-400 sm:flex-row sm:items-center sm:justify-between sm:px-6 lg:px-8">
          <p>© {new Date().getFullYear()} Synapzi AI. All rights reserved.</p>
          <p className="inline-flex items-center gap-2">
            Study smarter with your own notes <ArrowRight className="h-4 w-4" />
          </p>
        </div>
      </footer>
    </main>
  );
}